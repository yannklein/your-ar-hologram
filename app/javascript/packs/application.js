import "bootstrap";
import { initDigitalQRcode } from '../components/digital_qrcode';
import { initThree } from '../plugins/initThree';
import { initMarkerPatternCreator } from '../components/marker_pattern_creator';
import { initVideoForm } from '../components/video_form';

if (window.qrcode) {
  initDigitalQRcode(window.qrcode);
}

if (document.querySelector(".live-hologram")) {
  initThree(window.holoVideo, window.holoQRPatt);
}

if (window.QRForPattern) {
  initMarkerPatternCreator(window.QRForPattern);
}

if(document.querySelector(".new-form-progress")) {
  initVideoForm();
}
