import {remote} from 'electron'
import {h, Component} from 'preact'

import PaletteList from './PaletteList'

const setting = remote.require('./setting')

export default class App extends Component {
    constructor() {
        super()

        this.window = remote.getCurrentWindow()

        this.state = {
            palettes: setting.get('data.palettes')
        }
    }

    render() {
        return h('div', {id: 'root'},
            h(PaletteList, {
                palettes: this.state.palettes
            })
        )
    }
}
