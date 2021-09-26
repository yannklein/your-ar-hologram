// function to encode image

const encodeImageURL = (imageURL, onComplete) => {
  var image = new Image;
  image.crossOrigin = "Anonymous";
  image.onload = function(){
    onComplete(image);
  }
  image.src = imageURL;
}

const encodeImage = (image) => {
  // copy image on canvas
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d')
  canvas.width = 16;
  canvas.height = 16;

  var patternFileString = '';
  for(var orientation = 0; orientation > -2*Math.PI; orientation -= Math.PI/2){
    // draw on canvas - honor orientation
    context.save();
    context.clearRect(0,0,canvas.width,canvas.height);
    context.translate(canvas.width/2,canvas.height/2);
    context.rotate(orientation);
    context.drawImage(image, -canvas.width/2,-canvas.height/2, canvas.width, canvas.height);
    context.restore();

    //Uint8ClampedArray(1024)
    // get imageData
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // generate the patternFileString for this orientation
    if( orientation !== 0 ) patternFileString += '\n'
    // NOTE bgr order and not rgb!!! so from 2 to 0
    for(var channelOffset = 2; channelOffset >= 0; channelOffset--){
      // console.log('channelOffset', channelOffset)
      for(var y = 0; y < imageData.height; y++){
        for(var x = 0; x < imageData.width; x++){

          if( x !== 0 ) patternFileString += ' '

          var offset = (y*imageData.width*4) + (x * 4) + channelOffset
          var value = imageData.data[offset]

          patternFileString += String(value).padStart(3);
        }
        patternFileString += '\n'
      }
    }
  }
  // console.log(patternFileString);
  // window.pattern = patternFileString;
  // debugger
  document.querySelector("#hologram_marker_pattern").value = patternFileString;
}

const initMarkerPatternCreator = (imageURL) => {
  encodeImageURL(imageURL, encodeImage);
};

export { initMarkerPatternCreator };
