const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const ResizeImg = require('resize-img');

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';

let mainWindow;

// Create a main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    useContentSize: true,
    title: 'Image Resizer',
    width: isDev ? 1000 : 700,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Open devtools if in dev env
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// Create About Window
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    useContentSize: true,
    title: 'About App',
    width: 400,
    height: 300,
    modal: true,
    resizable: false,
  });

  aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}

// App is ready
app.whenReady().then(() => {
  createMainWindow();

  // remove main window on clsoe
  mainWindow.on('closed', () => (mainWindow = null));

  // Implement menu
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Menu template
const menu = [
  {
    role: 'fileMenu',
  },

  ...(!isMac
    ? [
        {
          label: 'Help',
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
];

// Respond to Ipcrenderer
ipcMain.on('image:resize', (e, options) => {
  options.dest = path.join(os.homedir(), 'Resized Images');
  resizeImage(options);
  console.log(options);
});

// Resize the Image
async function resizeImage({ imgPath, width, height, dest }) {
  try {
    const image = fs.readFileSync(imgPath);

    const newImage = await ResizeImg(image, {
      width: +width,
      height: +height,
    });

    // Create file name
    const filename =
      path.basename(imgPath, path.extname(imgPath)) +
      ' - resized' +
      path.extname(imgPath);

    // Create dest folder if it doesnt exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    // Write file to dest
    fs.writeFileSync(path.join(dest, filename), newImage);

    // Send success to renderer
    mainWindow.webContents.send('image:done');

    // open dest folder
    shell.openPath(dest);
  } catch (err) {
    console.log(err);
  }
}

// Main Menu
const mainMenu = Menu.buildFromTemplate(menu);
Menu.setApplicationMenu(mainMenu);

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});
