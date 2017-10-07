import {remote} from 'electron'
import {h, Component} from 'preact'

import mutate from '../renderer/mutate'

import BrowsePage from './pages/BrowsePage'
import DetailsPage from './pages/DetailsPage'

const setting = remote.require('./setting')

export default class App extends Component {
    constructor() {
        super()

        this.window = remote.getCurrentWindow()

        this.state = {
            page: 'browse',
            detailIndex: 0,
            palettes: setting.loadPalettes()
        }

        this.handleItemClick = this.handleItemClick.bind(this)
        this.handlePaletteChange = this.handlePaletteChange.bind(this)
        this.handleDetailsBackClick = this.handleDetailsBackClick.bind(this)
    }

    handleItemClick(evt) {
        this.setState({page: 'details', detailIndex: evt.index})
    }

    handleDetailsBackClick() {
        this.setState({page: 'browse'})
    }

    handlePaletteChange(evt) {
        this.setState(({detailIndex, palettes}) => ({
            palettes: mutate(palettes, {[detailIndex]: evt})
        }))
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
                onChange: this.handlePaletteChange
            })
        )
    }
}
