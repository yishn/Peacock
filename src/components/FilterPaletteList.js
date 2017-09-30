import {h} from 'preact'
import Component from './PureComponent'

import PaletteList from './PaletteList'

export default class FilterPaletteList extends Component {
    render() {
        return h(PaletteList, Object.assign({}, this.props, {
            filter: undefined,
            palettes: this.props.palettes.filter(palette =>
                palette.name.toLowerCase().includes(this.props.filter.text.trim())
            )
        }))
    }
}
