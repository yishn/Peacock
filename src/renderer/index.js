import querystring from 'querystring'
import {h, render} from 'preact'

import App from '../components/App'
import ColorPicker from '../components/color-picker'

let props = querystring.parse(window.location.hash.slice(1))

if (props.page && props.page === 'color-picker') {
    render(h(ColorPicker, {color: props.color}), document.body)
} else {
    render(h(App), document.body)
}
