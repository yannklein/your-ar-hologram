import * as THREE from 'three';

const ChromaKeyMaterial = function (url, width, height, keyColor) {
	THREE.ShaderMaterial.call(this);

	const video = document.createElement('video');
	video.loop = false;
	video.src = url;
  video.crossOrigin = "anonymous";
	video.setAttribute("playsinline", "");
	video.setAttribute("id", "video")
	video.load();
  window.video = video;

	var videoImage = document.createElement('canvas');
	if (window["webkitURL"]) document.body.appendChild(videoImage);
	videoImage.width = width;
	videoImage.height = height;
	videoImage.style.display="none";

	var keyColorObject = new THREE.Color(keyColor);

	var videoImageContext = videoImage.getContext('2d');
	// background color if no video present
	videoImageContext.fillStyle = '#' + keyColorObject.getHexString();
	videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

	var videoTexture = new THREE.Texture(videoImage);
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;

	this.update = function () {
		if (video.readyState === video.HAVE_ENOUGH_DATA) {
			videoImageContext.drawImage(video, (width / 2) - (video.videoWidth / 2), 0);
			if (videoTexture) {
				videoTexture.needsUpdate = true;
			}
		}
	}

  const fragmentShaderSource = `
    uniform sampler2D texture;
    uniform vec3 color;

    varying vec2 vUv;

    void main()
    {
      vec3 colorToRemove = vec3(${keyColorObject.r}, ${keyColorObject.g}, ${keyColorObject.b});
      vec3 fragmentColor = texture2D( texture, vUv ).rgb;
      float thresholdColor = 0.6;
      float thresholdTone = 0.6;

      float diffR = abs(colorToRemove[0] - fragmentColor.r);
      float diffG = abs(colorToRemove[0] - fragmentColor.r);
      float diffB = abs(colorToRemove[0] - fragmentColor.r);

      float diffRG = abs( (colorToRemove[0] - fragmentColor.r) - (colorToRemove[1] - fragmentColor.g) );
      float diffRB = abs( (colorToRemove[0] - fragmentColor.r) - (colorToRemove[2] - fragmentColor.b) );

      if ( diffRG <= thresholdTone
        && diffRB <= thresholdTone
        && diffR <= thresholdColor
        && diffG <= thresholdColor
        && diffB <= thresholdColor ) {
        gl_FragColor = vec4(texture2D( texture, vUv ).rgb, 0.0);
      } else {
        gl_FragColor = vec4(texture2D( texture, vUv ).rgb, 1.0);
      }

    }
  `;

  const vertxShaderSource = `
    varying vec2 vUv;

    void main()
    {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_Position = projectionMatrix * mvPosition;

    }
  `;

	this.setValues({

		uniforms: {
			texture: {
				type: "t",
				value: videoTexture
			},
			color: {
				type: "c",
				value: keyColorObject
			}
		},
		vertexShader: vertxShaderSource,
		fragmentShader: fragmentShaderSource,

		transparent: true
	});


}

ChromaKeyMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

export { ChromaKeyMaterial };
