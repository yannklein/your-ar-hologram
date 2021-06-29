import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initARJS, isMarkerVisible } from './initAR';
import { ChromaKeyMaterial } from '../vendor/chromakey';
import Swal from 'sweetalert2';

let isVideoPlay = false;
let videoElement;

const onDocumentTouchStart = (event) => {

    event.preventDefault();

    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown( event );

}

const onDocumentMouseDown = (event) => {

  if (window.holoDepth) {
    return;
  }
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, window.camera );

  const videoPlaneArray = [window.videoPlane];

  const videoIntersects = raycaster.intersectObjects( videoPlaneArray );

  if ( videoIntersects.length > 0) {
    if(videoElement.paused == true){
      videoElement.play();
      isVideoPlay = true;
    }else{
      videoElement.pause();
      isVideoPlay = false;
    }
  }
}

const welcomeMessage = () => {
  Swal.queue([{
      title: 'Scan successful!',
      type: 'success',
      confirmButtonText: 'OK',
      footer: 'Please, allow the access to your camera',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        Swal.insertQueueStep({
          title: 'Point the marker with you phone!',
          footer: 'Tap the holo to play it',
            type: 'info',
        confirmButtonText: 'OK'
      })
    }
  }])
}

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = (e) => { resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
};

const getImageData = (img) => {  
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = img.width;
  ctx.canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
};

// return the pixel at UV coordinates (0 to 1) in 0 to 1 values
const getPixel = (imageData, u, v) => {
  const x = u * (imageData.width  - 1) | 0;
  const y = v * (imageData.height - 1) | 0;
  if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
    return [0, 0, 0, 0];
  } else {
    const offset = (y * imageData.width + x) * 4;
    return Array.from(imageData.data.slice(offset, offset + 4)).map(v => v / 255);
  }
};


const addHoloVideo = (subScene, onRenderFcts, holoVideo) => {
  const xsize = 3;
  const ysize = xsize * 0.5625;

  const holoGeometry = new THREE.PlaneGeometry(xsize, ysize);

  const videoMaterial = new ChromaKeyMaterial(holoVideo, 1280, 720, parseInt(window.holoBackground.slice(1),16));
  videoElement = window.video;
  // green: 0xd432
  // white: 0xffff
  const videoPlane = new THREE.Mesh( holoGeometry, videoMaterial );
  videoPlane.scale.multiplyScalar(1);
  videoPlane.position.y = ysize/2;
  subScene.add( videoPlane );
  window.videoPlane = videoPlane;

  onRenderFcts.push(function(delta, now){
    videoMaterial.update();
  })
};

const addHoloPhoto = async (subScene) => {

  const holoGeometry = new THREE.BufferGeometry();

  const images = await Promise.all([
    loadImage(window.holoVideo),  // RGB
    loadImage(window.holoDepth),  // Depth
  ]);
  const data = images.map(getImageData);
  
  const rgbData = data[0];
  const depthData = data[1];
  
  const skip = 1;
  const across = Math.ceil(rgbData.width / skip);
  const down = Math.ceil(rgbData.height / skip);
  
  const positions = [];
  const colors = [];
  const color = new THREE.Color();
  const spread = 1;
  const depthSpread = 1;
  const imageAspect = rgbData.width / rgbData.height;
  
  for (let y = 0; y < down; ++y) {
    const v = y / (down - 1);
    for (let x = 0; x < across; ++x) {
      const u = x / (across - 1);
      const rgb = getPixel(rgbData, u, v);
      const depth = getPixel(depthData, u, v)[0];
      
      positions.push( 
         (u *  2 - 1) * spread * imageAspect, 
         (v * -2 + 1) * spread, 
         depth * depthSpread,
      );
      colors.push( ...rgb.slice(0,3) );
    }
  }
  
  holoGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  holoGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  holoGeometry.computeBoundingSphere();
  const material = new THREE.PointsMaterial( { size: 0.01, vertexColors: THREE.VertexColors } );
  // holoGeometry.scale(0.5,0.5,0.5);
  holoGeometry.translate(0,holoGeometry.boundingSphere.radius,0);
  // holoGeometry.rotateY(Math.PI);
	const points = new THREE.Points( holoGeometry, material );

  // const geo = new THREE.BoxGeometry( 1, 1, 1 );
  // const mat = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  // const cube = new THREE.Mesh( geo, mat );
  // cube.position.y = 2;
  // subScene.add( cube );
  subScene.add( points );
  
  // const videoMaterial = new ChromaKeyMaterial(holoVideo, 1280, 720, parseInt(window.holoBackground.slice(1),16));
  // videoElement = window.video;
  // // green: 0xd432
  // // white: 0xffff
  // const videoPlane = new THREE.Mesh( holoGeometry, videoMaterial );
  // videoPlane.scale.multiplyScalar(1);
  // videoPlane.position.y = ysize/2;
  // scene.add( videoPlane );
  // window.videoPlane = videoPlane;

  // onRenderFcts.push(function(delta, now){
  //   videoMaterial.update();
  // })
};

const initThree = (holoVideo, qrcodePatt) => {
  //Error if not WebGL compatible
  // if ( WEBGL.isWebGLAvailable() === false ) {
  //     document.body.appendChild( WEBGL.getWebGLErrorMessage() );
  // }

  // WElcome popup message
  welcomeMessage();

  // init renderer
  const renderer  = new THREE.WebGLRenderer({
    antialias : true,
    autoResize : true,
    alpha: true
  });
  renderer.setClearColor(new THREE.Color('lightgrey'), 0);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.top = '0px'
  renderer.domElement.style.left = '0px'
  document.querySelector(".live-hologram").appendChild( renderer.domElement );

  // array of functions for the rendering loop
  const onRenderFcts= [];

  // init scene
  const scene = new THREE.Scene();

  // Create a camera and light
  const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1500 );
  scene.add(camera);
  window.camera = camera;

  const light = new THREE.AmbientLight( 0xffffff ); // soft white light
  scene.add( light );

  // init AR World
  const arWorldRoot = initARJS(scene, camera, onRenderFcts, renderer, qrcodePatt)

  // Add the objects in the scene

  // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  // var cube = new THREE.Mesh( geometry, material );
  // arWorldRoot.add( cube );

  // add the video
  const all = new THREE.Group();

  if (window.holoDepth) {
    // the asset is a iPhone portrait image
    addHoloPhoto(all)
  } else {
    // the asset is a video
    addHoloVideo(all, onRenderFcts);
  }

  // add logo floor
  // var geometry = new THREE.PlaneGeometry(2,2);
  // var loader = new THREE.TextureLoader().load('logo.png', (imgLoader) => {
  // });
  // //Load the image into a custom material
  // var material = new THREE.MeshLambertMaterial({
  //   map: loader,
  //   transparent: true,
  // });

  // var logo = new THREE.Mesh(geometry, material);
  // logo.rotation.x = - Math.PI / 2;
  // all.add(logo);

  arWorldRoot.add(all);

  //////////////////////////////////////////////////////////////////////////////////
  //    render the whole thing on the page
  //////////////////////////////////////////////////////////////////////////////////

  // render the scene
  onRenderFcts.push(function(){
    renderer.render( scene, camera );
    if (!window.holoDepth) {
      if(isMarkerVisible() == false){
        videoElement.pause();
      }
      else if(isMarkerVisible() && videoElement.paused == true && isVideoPlay == true){
        videoElement.play();
      }
    }
  })

  // run the rendering loop
  var lastTimeMsec= null
  requestAnimationFrame(function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );
    // measure time
    lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec  = nowMsec
    // call each update function
    onRenderFcts.forEach(function(onRenderFct){
      onRenderFct(deltaMsec/1000, nowMsec/1000)
    })
  })

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
}

export { initThree };
