import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const initDigitalQRcode = (qrcode) => {
  //Error if not WebGL compatible
  // if ( WEBGL.isWebGLAvailable() === false ) {
  //     document.body.appendChild( WEBGL.getWebGLErrorMessage() );
  // }

  // Rendering loop
  const onRenderFcts = [];

  // init renderer
  const digitalQr = document.querySelector(".digital-qr");
  const renderer = new THREE.WebGLRenderer({
    antialias : true,
    autoResize : true,
    alpha: true
  });
  renderer.setClearColor(new THREE.Color('lightgrey'), 0);
  renderer.setSize( digitalQr.offsetWidth, digitalQr.offsetHeight );
  // renderer.domElement.style.position = 'absolute';
  // renderer.domElement.style.top = '0px';
  // renderer.domElement.style.left = '0px';
  digitalQr.appendChild( renderer.domElement );

  // init scene
  const scene = new THREE.Scene();

  // create a camera and light
  const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1500 );
  camera.position.set( 2, 8, 6 );
  scene.add(camera);

  const light = new THREE.AmbientLight( 0xffffff ); // soft white light
  scene.add( light );

  // controls
  const controls = new OrbitControls( camera, renderer.domElement );
  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.minDistance = 0;
  controls.maxDistance = 500;
  //controls.maxPolarAngle = Math.PI / 2;

  // add the objects in the scene
  const all = new THREE.Group();

  // add the virtual qrcode
  const qrGeometry = new THREE.PlaneGeometry(5,5);
  const qrTexture = new THREE.TextureLoader().load(qrcode);
  //const qrTexture = new THREE.ImageUtils.loadTexture( qrcode );
  const qrMaterial = new THREE.MeshLambertMaterial({ map: qrTexture });

  const qrcodeTile = new THREE.Mesh(qrGeometry, qrMaterial);
  qrcodeTile.rotation.x = - Math.PI / 2;
  all.add(qrcodeTile);

  // add floor
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorTexture = new THREE.TextureLoader().load('https://threejsfundamentals.org/threejs/lessons/resources/images/compressed-but-large-wood-texture.jpg');
  const floorMaterial = new THREE.MeshLambertMaterial({ map: floorTexture });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = - Math.PI / 2;
  floor.position.y = -0.1;
  all.add(floor);

  scene.add(all);

  // render the scene
  onRenderFcts.push(function(){
    renderer.render( scene, camera );
  })

  // run the rendering loop
  var lastTimeMsec= null
  requestAnimationFrame(function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    // measure time
    lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec  = nowMsec
    // call each update function
    onRenderFcts.forEach(function(onRenderFct){
      onRenderFct(deltaMsec/1000, nowMsec/1000)
    })
  })
}

export { initDigitalQRcode };
