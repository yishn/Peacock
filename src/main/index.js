const {app, dialog, BrowserWindow} = require('electron')
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
        show: false,
        backgroundColor: '#111',
        webPreferences: {
            nodeIntegrationInWorker: true
        }
    })

    if (setting.get('debug.devtools')) {
        window.webContents.openDevTools()
    }

    window.once('ready-to-show', () => window.show())

    window.once('close', () => {
        if (window.isMinimized() || window.isMaximized()) return

        let [width, height] = window.getContentSize()
        let [x, y] = window.getPosition()

        setting
        .set('window.width', width)
        .set('window.height', height)
        .set('window.x', x)
        .set('window.y', y)
    })

    window.once('closed', () => window = null)

    window.loadURL(`file://${__dirname}/../../index.html`)
})

process.on('uncaughtException', err => {
    dialog.showErrorBox(`${app.getName()} v${app.getVersion()}`, [
        'Something weird happened. ',
        `${app.getName()} will shut itself down. `,
        'If possible, please report this on ',
        `${app.getName()}’s repository on GitHub.\n\n`,
        err.stack
    ].join(''))

    process.exit(1)
})
