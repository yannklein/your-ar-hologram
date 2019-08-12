import "bootstrap";
import { initDigitalQRcode } from '../components/digital_qrcode';
import { initThree } from '../plugins/initThree';

if (window.qrcode) {
  initDigitalQRcode(window.qrcode);
}

if (document.querySelector(".live-hologram")) {
  initThree(window.holoVideo, window.holoQRPic, window.holoQRPatt);
}
