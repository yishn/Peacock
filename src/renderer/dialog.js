import {remote} from 'electron'
import mutate from './mutate'

const {app, dialog} = remote
const win = remote.getCurrentWindow()

export function showMessageBox(message, type = 'none', buttons = ['OK'], options = {}) {
    return dialog.showMessageBox(win, mutate({
        type, buttons, message,
        title: app.getName(),
        noLink: true
    }, options))
}

export function showOpenDialog(options = {}) {
    return dialog.showOpenDialog(win, mutate({
        properties: ['openFile', 'createDirectory']
    }, options))
}

export function showSaveDialog(options = {}) {
    return dialog.showSaveDialog(win, options)
}
