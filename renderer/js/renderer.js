const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const fileName = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
  const file = e.target.files[0];
  if (!isFileImage(file)) {
    console.log('Please Select an image');
    return;
  }

  // Get original dimension
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = 'flex';
  fileName.innerText = file.name;

  console.log('Success');
}

// Make sure file is image
function isFileImage(file) {
  const acceptedImages = [
    'image/gif',
    'image/png',
    'image/jpeg',
    'image/bmp',
    'image/webp',
    'image/tiff',
    'image/svg+xml',
    'image/x-icon',
    'image/heic',
    'image/heif',
  ];
  return file && acceptedImages.includes(file['type']);
}

img.addEventListener('change', loadImage);
