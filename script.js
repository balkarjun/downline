const image = document.querySelector('#images img');

let index = 0;
function updateImage(){
  image.setAttribute('src', 'assets/' + (index + 1) + '.png');
  // Modulus by the number of images
  index = (index + 1) % 11;
}

updateImage();
setInterval(updateImage, 1500);
