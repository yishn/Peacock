import {h} from 'preact'
import Component from './PureComponent'
import Palette from './Palette'

export default class PaletteList extends Component {
    render() {
        return h('ul', {class: 'palette-list'},
            this.props.palettes.map(palette =>
                h('li', {},
                    h(Palette, {
                        colors: palette.colors.map(x => x.hex)
                    }),
                    h('h3', {}, palette.name)
                )
            )
        )
    }
}
