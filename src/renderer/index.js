import {ipcRenderer, remote} from 'electron'
import querystring from 'querystring'
import {h, render} from 'preact'

import App from '../components/App'
import ColorPicker from '../components/color-picker'
import Eyedropper from '../components/color-picker/Eyedropper'

let props = querystring.parse(window.location.hash.slice(1))

if (props.page === 'color-picker') {
    render(h(ColorPicker, {
        color: props.color,
        onSubmit: evt => {
            ipcRenderer.send(`color-picker-callback-${props.id}`, evt)
            remote.getCurrentWindow().close()
        }
    }), document.body)
} else if (props.page === 'eyedropper') {
    render(h(Eyedropper, {
        onSubmit: evt => {
            ipcRenderer.send(`eyedropper-callback-${props.id}`, evt)
            remote.getCurrentWindow().close()
        }
    }), document.body)
} else {
    render(h(App), document.body)
}
