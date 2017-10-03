import chroma from 'chroma-js'
import {h} from 'preact'
import comprehend, {from, where, range} from '../renderer/comprehension'

import Component from './PureComponent'
import PaletteList from './PaletteList'

function getHueDistance(color1, color2) {
    let [hue1, hue2] = [color1, color2].map(c => chroma(c).get('hsl.h'))

    return Math.min(
        Math.abs(hue1 - hue2),
        Math.abs(hue1 - hue2 + 360),
        Math.abs(hue1 - hue2 - 360)
    )
}

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
            i => Object.assign({
                index: i,
                distance: filter.hue == null ? 0 : palettes[i].colors
                    .map(color => chroma.distance(color.hex, filter.hue))
                    .reduce((min, x) => Math.min(min, x))
            }, palettes[i]),

            from(range(palettes.length)),
            where(i =>
                palettes[i].name.toLowerCase().includes(filter.text.trim())
                && (filter.hue == null || palettes[i].colors
                    .map(color => getHueDistance(color.hex, filter.hue))
                    .reduce((min, x) => Math.min(min, x)) < 60)
            )
        )

        if (filter.hue != null) {
            this.filteredPalettes.sort((p1, p2) => p1.distance - p2.distance)
        }

        return h(PaletteList, Object.assign({}, this.props, {
            filter: undefined,
            palettes: this.filteredPalettes,
            onItemClick: this.handleItemClick
        }))
    }
}
