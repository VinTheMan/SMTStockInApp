const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('index.html')
} // createWindow

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => { // for macOS where apps dont really close
        if( BrowserWindow.getAllWindows().length === 0 ) createWindow()
    })
})

app.on('window-all-closed', () => {
    if(process.platform !== "darwin") app.quit()
})