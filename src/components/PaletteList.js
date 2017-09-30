import {h} from 'preact'
import Component from './PureComponent'
import Palette from './Palette'

export default class PaletteList extends Component {
    render() {
        return h('section', {class: 'palette-list'},
            h('ul', {}, this.props.palettes.map(palette =>
                h('li', {},
                    h(Palette, {
                        colors: palette.colors.map(x => x.hex)
                    }),
                    h('h3', {}, palette.name)
                )
            )),

            h('div', {class: 'shadow top'}),
            h('div', {class: 'shadow bottom'})
        )
    }
}
