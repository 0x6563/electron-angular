const { app, BrowserWindow, ipcMain } = require('electron'),
    { UIReady, UIUrl, ServicesUpdates, ServicesReady } = require('./environment')
let mainWindow;
let api;
async function createWindow() {
    await ServicesReady();
    await UIReady();

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        minHeight: 800,
        minWidth: 1024,
        title: 'Electron App',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    mainWindow.setMenu(null);
    mainWindow.loadURL(UIUrl);
    ServicesUpdates.subscribe(v => {
        api = v;
        mainWindow.reload()
    })
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => { mainWindow = null })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => { process.platform !== 'darwin' && app.quit() })
app.on('activate', () => { mainWindow === null && createWindow() })


ipcMain.handle('title', async (event, someArgument) => {
    return api.title;
 })

 ipcMain.handle('header', async (event, someArgument) => {
     return api.header;
  })

 ipcMain.handle('content', async (event, someArgument) => {
    return api.content;
 })
  