const {app, BrowserWindow} = require('electron')
const setting = require('./setting')

let window = null

app.on('window-all-closed', () => app.quit())

app.on('ready', () => {
    window = new BrowserWindow({
        width: setting.get('window.width'),
        height: setting.get('window.height'),
        x: setting.get('window.x'),
        y: setting.get('window.y'),
        minWidth: setting.get('window.minwidth'),
        minHeight: setting.get('window.minheight'),
        useContentSize: true,
        center: true,
        show: false
    })

    if (setting.get('debug.devtools')) {
        window.webContents.openDevTools()
    }

    window.on('closed', () => window = null)
    window.once('ready-to-show', () => window.show())
    window.loadURL(`file://${__dirname}/../../index.html`)
})
