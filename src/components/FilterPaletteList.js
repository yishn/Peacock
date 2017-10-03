import {h} from 'preact'
import comprehend, {from, where, range} from '../renderer/comprehension'

import Component from './PureComponent'
import PaletteList from './PaletteList'

export default class FilterPaletteList extends Component {
    constructor(props) {
        super(props)

        this.handleItemClick = evt => {
            let {onItemClick = () => {}} = this.props
            onItemClick({index: this.filteredPalettes[evt.index].index})
        }
    }

    render() {
        let {palettes, filter} = this.props

        this.filteredPalettes = comprehend(
            i => Object.assign({index: i}, palettes[i]),
            from(range(palettes.length)),
            where(i => palettes[i].name.toLowerCase().includes(filter.text.trim()))
        )

        return h(PaletteList, Object.assign({}, this.props, {
            filter: undefined,
            palettes: this.filteredPalettes,
            onItemClick: this.handleItemClick
        }))
    }
}
