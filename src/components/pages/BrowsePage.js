import {h} from 'preact'
import mutate from '../../renderer/mutate'

import Component from '../helper/PureComponent'
import Page from './Page'
import FilterPanel from '../FilterPanel'
import FilterPaletteList from '../FilterPaletteList'
import Toolbar, {ToolbarButton} from '../Toolbar'

export default class BrowsePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            filter: {text: '', hue: null}
        }

        this.handleFilterChange = evt => {
            this.setState(({filter}) => ({filter: mutate(filter, evt)}))
        }
    }

    render() {
        return h(Page, {id: 'browse', show: this.props.show},
            h(FilterPanel, {
                text: this.state.filter.text,
                hue: this.state.filter.hue,
                onChange: this.handleFilterChange
            }),

            h(FilterPaletteList, {
                palettes: this.props.palettes,
                filter: this.state.filter,
                onItemClick: this.props.onItemClick
            }),

            h(Toolbar, {},
                h(ToolbarButton, {
                    text: 'Add Palette…',
                    icon: './img/add.svg'
                })
            )
        )
    }
}
