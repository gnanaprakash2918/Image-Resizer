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

// Send image to main
function sendImage(e) {
  e.preventDefault();

  const width = widthInput.value;
  const height = heightInput.value;

  if (!img.files[0]) {
    alertError('Please Upload an Image');
    return;
  }

  if (width === '' || height === '') {
    alertError('Please Fill in Width and Height');
    return;
  }
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

form.addEventListener('submit', sendImage);
