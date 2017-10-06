import {remote} from 'electron'
import {h, Component} from 'preact'

import mutate from '../renderer/mutate'

import FilterPanel from './FilterPanel'
import FilterPaletteList from './FilterPaletteList'
import Palette from './Palette'
import Toolbar, {ToolbarButton} from './Toolbar'

const setting = remote.require('./setting')

export default class App extends Component {
    constructor() {
        super()

        this.window = remote.getCurrentWindow()

        this.state = {
            page: 'browse',
            detailIndex: 0,
            palettes: setting.loadPalettes(),
            filter: {text: '', hue: null}
        }

        this.handleFilterChange = this.handleFilterChange.bind(this)
        this.handlePaletteClick = this.handlePaletteClick.bind(this)
    }

    handleFilterChange(evt) {
        this.setState(({filter}) => ({filter: mutate(filter, evt)}))
    }

    handlePaletteClick(evt) {
        this.setState({page: 'details', detailIndex: evt.index})
    }

    render() {
        return h('div', {id: 'root', class: `page-${this.state.page}`},
            h('section', {id: 'browse', class: 'page'},
                h(FilterPanel, {
                    text: this.state.filter.text,
                    hue: this.state.filter.hue,
                    onChange: this.handleFilterChange
                }),

                h(FilterPaletteList, {
                    palettes: this.state.palettes,
                    filter: this.state.filter,
                    onItemClick: this.handlePaletteClick
                }),

                h(Toolbar, {},
                    h(ToolbarButton, {
                        text: 'Add Palette…',
                        icon: './img/add.svg'
                    })
                )
            ),

            h('section', {id: 'details', class: 'page'},
                h('section', {class: 'title'},
                    h('a', {class: 'back'}, 'Go Back'),
                    h('input', {
                        class: 'name',
                        type: 'text',
                        value: this.state.palettes[this.state.detailIndex].name
                    })
                ),

                h(Palette, {
                    colors: this.state.palettes[this.state.detailIndex].colors.map(x => x.hex)
                })
            )
        )
    }
}
