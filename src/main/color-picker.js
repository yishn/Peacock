const {BrowserWindow} = require('electron')
const setting = require('./setting')

let window = null

exports.show = function() {
    window = new BrowserWindow({
        width: setting.get('color_picker.width'),
        height: setting.get('color_picker.height'),
        useContentSize: true,
        center: true,
        resizable: false,
        maximizable: false,
        show: false,
        parent: BrowserWindow.getFocusedWindow(),
        modal: true,
        backgroundColor: '#fafafa'
    })

    if (setting.get('debug.devtools')) {
        window.webContents.openDevTools()
    }

    window.once('ready-to-show', () => window.show())

    window.once('closed', () => window = null)

    window.loadURL(`file://${__dirname}/../../index.html#page=color-picker&color=red`)
}
