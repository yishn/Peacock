const {app} = require('electron')
const EventEmitter = require('events')
const fs = require('fs')
const path = require('path')

exports.userDataDirectory = app.getPath('userData')
exports.settingsPath = path.join(exports.userDataDirectory, 'settings.json')
exports.palettesPath = path.join(exports.userDataDirectory, 'palettes.json')

try { fs.mkdirSync(exports.userDataDirectory) } catch (err) {}

let settings = {}
let defaults = {
    'debug.devtools': false,
    'window.height': 500,
    'window.minheight': 300,
    'window.minwidth': 300,
    'window.width': 300,
    'window.x': null,
    'window.y': null
}

exports.events = new EventEmitter()
exports.events.setMaxListeners(100)

exports.load = function() {
    try {
        settings = JSON.parse(fs.readFileSync(exports.settingsPath, 'utf8'))
    } catch (err) {
        settings = {}
    }

    // Load default settings

    for (let key in defaults) {
        if (key in settings) continue
        settings[key] = defaults[key]
    }

    return exports.save()
}

exports.save = function() {
    try {
        fs.writeFileSync(exports.settingsPath, JSON.stringify(settings, null, '  '))
    } catch (err) {}

    return exports
}

exports.get = function(key) {
    if (key in settings) return settings[key]
    if (key in defaults) return defaults[key]
    return null
}

exports.set = function(key, value) {
    settings[key] = value
    exports.save()
    exports.events.emit('change', {key})
    return exports
}

exports.load()

exports.loadPalettes = function() {
    try {
        return JSON.parse(fs.readFileSync(exports.palettesPath, 'utf8'))
    } catch (err) {
        return []
    }
}

exports.savePalettes = function(palettes) {
    try {
        fs.writeFileSync(exports.palettesPath, JSON.stringify(palettes))
    } catch (err) {}

    return exports
}
