// canvas function
function useCanvas(el,image,callback){
  el.width = image.width; // img width
  el.height = image.height; // img height
  // draw image in canvas tag
  el.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
  return callback();
}

// convert rgba to hex
// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

const createPicker = () => {
  // vars
  console.log("hello");
  const img = document.querySelector('.picker-thumbnail img');
  const canvas = document.querySelector('#picker-cs');
  const result = document.querySelector('.picker-result');
  const preview = document.querySelector('.picker-preview');
  const submitBackground = document.querySelector('#hologram_background');
  var x = '', y = '';
  console.log("hello!");

  // click function
  img.addEventListener('click', function(e){
    // chrome
    if(e.offsetX) {
      x = e.offsetX;
      y = e.offsetY;
    }
    // firefox
    else if(e.layerX) {
      x = e.layerX;
      y = e.layerY;
    }
    useCanvas(canvas,img,function(){
      // get image data
      var p = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
      //console.log(rgbToHex(p[0],p[1],p[2]));
      const hexBackground = rgbToHex(p[0],p[1],p[2]);
      submitBackground.value = hexBackground;
      // show info
      //result.innerHTML = '<span>HEX: '+rgbToHex(p[0],p[1],p[2])+'</span>'+'<span>RGB:  rgb('+p[0]+','+p[1]+','+p[2]+')</span>';

      // add background in body
      document.body.style.background =rgbToHex(p[0],p[1],p[2]);
    });
  },false);

  // preview function mousemove
  img.addEventListener('mousemove', function(e){
    // chrome
    if(e.offsetX) {
      x = e.offsetX;
      y = e.offsetY;
    }
    // firefox
    else if(e.layerX) {
      x = e.layerX;
      y = e.layerY;
    }

    useCanvas(canvas,img,function(){
      // get image data
      var p = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
      // show preview color
      preview.style.background = rgbToHex(p[0],p[1],p[2]);
    });
  },false);
}

export { createPicker };
