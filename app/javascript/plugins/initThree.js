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

const addHoloVideo = (scene, onRenderFcts, holoGeometry, holoVideo, ysize) => {
  const videoMaterial = new ChromaKeyMaterial(holoVideo, 1280, 720, parseInt(window.holoBackground.slice(1),16));
  videoElement = window.video;
  // green: 0xd432
  // white: 0xffff
  const videoPlane = new THREE.Mesh( holoGeometry, videoMaterial );
  videoPlane.scale.multiplyScalar(1);
  videoPlane.position.y = ysize/2;
  scene.add( videoPlane );
  window.videoPlane = videoPlane;

  onRenderFcts.push(function(delta, now){
    videoMaterial.update();
  })
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

  const xsize = 3;
  const ysize = xsize * 0.5625;

  const holoGeometry = new THREE.PlaneGeometry(xsize, ysize);
  addHoloVideo(all, onRenderFcts, holoGeometry, holoVideo, ysize);

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
    if(isMarkerVisible() == false){
      videoElement.pause();
    }
    else if(isMarkerVisible() && videoElement.paused == true && isVideoPlay == true){
      videoElement.play();
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
