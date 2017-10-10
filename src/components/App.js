import {remote} from 'electron'
import {h, Component} from 'preact'

import mutate from '../renderer/mutate'

import BrowsePage from './pages/BrowsePage'
import DetailsPage from './pages/DetailsPage'
import ColorPicker from './color-picker'

const setting = remote.require('./setting')

export default class App extends Component {
    constructor() {
        super()

        this.window = remote.getCurrentWindow()

        this.state = {
            page: 'browse',
            detailIndex: 0,
            palettes: setting.loadPalettes(),
            showColorPicker: true
        }

        this.handleItemClick = evt => {
            this.setState({page: 'details', detailIndex: evt.index})
        }

        this.handlePaletteChange = evt => {
            this.setState(({detailIndex, palettes}) => ({
                palettes: mutate(palettes, {[detailIndex]: evt})
            }))
        }

        this.handleDetailsBackClick = () => {
            this.setState({page: 'browse'})
        }

        this.handlePaletteRemove = evt => {
            tthis.handleDetailsBackClick()

            setTimeout(() => this.setState(({palettes, detailIndex}) => ({
                palettes: mutate(palettes, {splice: [detailIndex, 1]}),
                detailIndex: Math.min(detailIndex, palettes.length - 2)
            })), 500)
        }
    }

    render() {
        let palette = this.state.palettes[this.state.detailIndex]

        return h('div', {id: 'root', class: `page-${this.state.page}`},
            h(BrowsePage, {
                show: this.state.page === 'browse',
                palettes: this.state.palettes,
                onItemClick: this.handleItemClick
            }),

            h(DetailsPage, {
                show: this.state.page === 'details',
                palette,

                onBackClick: this.handleDetailsBackClick,
                onChange: this.handlePaletteChange,
                onRemove: this.handlePaletteRemove
            }),

            h(ColorPicker, {
                show: this.state.showColorPicker
            })
        )
    }
}
