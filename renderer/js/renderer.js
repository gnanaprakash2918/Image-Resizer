const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const fileName = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
  const file = e.target.files[0];
  if (!isFileImage(file)) {
    alertError('Please Select an Image');
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
  outputPath.innerText = path.join(os.homedir(), 'Resized Images');

  alertSuccess('Success');
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

function alertError(msg) {
  Toastify.toast({
    text: msg,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center',
      width: '100%',
      padding: '12px',
    },
  });
}

function alertSuccess(msg) {
  Toastify.toast({
    text: msg,
    duration: 5000,
    close: false,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
      width: '100%',
      padding: '12px',
    },
  });
}

img.addEventListener('change', loadImage);
