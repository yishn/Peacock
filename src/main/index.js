const {app, BrowserWindow} = require('electron')

let window = null

// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit())

app.on('ready', () => {
    window = new BrowserWindow()

    // window.toggleDevTools()

    window.on('closed', () => { window = null })
    window.loadURL(`file://${__dirname}/../../index.html`)
})
