import {remote} from 'electron'
import {h, Component} from 'preact'

import mutate from '../renderer/mutate'

import FilterPanel from './FilterPanel'
import FilterPaletteList from './FilterPaletteList'
import Toolbar, {ToolbarButton} from './Toolbar'

const setting = remote.require('./setting')

export default class App extends Component {
    constructor() {
        super()

        this.window = remote.getCurrentWindow()

        this.state = {
            palettes: setting.loadPalettes(),
            filter: {
                text: '',
                hue: null
            }
        }

        this.handleFilterChange = this.handleFilterChange.bind(this)
    }

    handleFilterChange(evt) {
        this.setState(({filter}) => ({filter: mutate(filter, evt)}))
    }

    render() {
        let page = 'browse'

        return h('div', {id: 'root', class: `page-${page}`},
            h('section', {id: 'browse', class: 'page'},
                h(FilterPanel, {
                    text: this.state.filter.text,
                    hue: this.state.filter.hue,
                    onChange: this.handleFilterChange
                }),

                h(FilterPaletteList, {
                    palettes: this.state.palettes,
                    filter: this.state.filter
                }),

                h(Toolbar, {},
                    h(ToolbarButton, {
                        text: 'Add Palette…',
                        icon: './img/add.svg'
                    })
                )
            )
        )
    }
}
