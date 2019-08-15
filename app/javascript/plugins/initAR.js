import * as THREE from 'three';
import {THREEx, WebAR } from '../vendor/ar.js';
//Initialisation of AR JS
let artoolkitMarker;

const initARJS = (scene, camera, onRenderFcts, renderer, qrcodePatt) => {

  ////////////////////////////////////////////////////////////////////////////////
  //          handle arToolkitSource
  ////////////////////////////////////////////////////////////////////////////////
  var arToolkitSource = new THREEx.ArToolkitSource({
    // to read from the webcam
    sourceType : 'webcam'
  });

  arToolkitSource.init(function onReady(){
    onResize();
  });

  // handle resize
  window.addEventListener('resize', function(){
    onResize();
  });
  function onResize(){
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
    if( arToolkitContext.arController !== null ){
      arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
    }
  };
  ////////////////////////////////////////////////////////////////////////////////
  //          initialize arToolkitContext
  ////////////////////////////////////////////////////////////////////////////////


  // create atToolkitContext
  var arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
    detectionMode: 'mono',
    maxDetectionRate: 30,
    canvasWidth: 80*3,
    canvasHeight: 60*3,
  });
  // initialize it
  arToolkitContext.init(function onCompleted(){
    // copy projection matrix to camera
    camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
  });

  // update artoolkit on every frame
  onRenderFcts.push(function(){
    if( arToolkitSource.ready === false ) return
    arToolkitContext.update( arToolkitSource.domElement )
  });

  ////////////////////////////////////////////////////////////////////////////////
  //          Create a ArMarkerControls
  ////////////////////////////////////////////////////////////////////////////////
  var markerRoot = new THREE.Group;
  scene.add(markerRoot);
  artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    //type: 'barcode',
    //barcodeValue: 'https://magicstickr.github.io/video-base/index.html',
    type : 'pattern',
    patternUrl: qrcodePatt
  });

  // build a smoothedControls
  var smoothedRoot = new THREE.Group();
  scene.add(smoothedRoot);
  var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
    lerpPosition: 0.4,
    lerpQuaternion: 0.3,
    lerpScale: 1,
  });
  onRenderFcts.push(function(delta){
    smoothedControls.update(markerRoot);
    // console.log(artoolkitMarker.object3d.visible);
    let elements = document.querySelectorAll(".manual-display");
    elements.forEach( (element) => {
      if (element){
        if (artoolkitMarker.object3d.visible) {
          element.style.display = "";
        } else {
          element.style.display = "none";
        }
      }
    });
  });

  return smoothedRoot;
}

const isMarkerVisible = () => artoolkitMarker.object3d.visible;

export { initARJS, isMarkerVisible };
