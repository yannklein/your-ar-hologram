import "bootstrap";
import { initDigitalQRcode } from '../components/digital_qrcode';
import { initThree } from '../plugins/initThree';
import { initMarkerPatternCreator } from '../components/marker_pattern_creator';
import { initVideoForm } from '../components/video_form';
import { createPicker } from '../vendor/colorPicker';

// Launch the ARJS simulation mode if ?mode=simulation in URL
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const isSimulation = params.get("mode") === 'simulation';

if (window.qrcode) {
  initDigitalQRcode(window.qrcode);
}

if (document.querySelector(".live-hologram")) {
  initThree(window.holoVideo, window.holoQRPatt, isSimulation);
}

if (window.QRForPattern) {
  initMarkerPatternCreator(window.QRForPattern);
}

if(document.querySelector(".new-form-progress")) {
  initVideoForm();
}
if(document.querySelector(".close-welcome")) {
  document.querySelector(".close-welcome").addEventListener("click", (event) => {
    document.querySelector(".card-welcome").style.display = 'none';
  });
}

if(document.querySelector('#hologram_background')) {
  createPicker();
}
