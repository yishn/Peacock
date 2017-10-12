import chroma from 'chroma-js'
import {h} from 'preact'
import Component from '../PureComponent'

const heightScale = Math.sqrt(3) / 2

export default class SaturationLightnessPicker extends Component {
    render() {
        let width = this.props.size - 12
        let height = Math.round(heightScale * width)
        let [mx, my] = [width / 2, (Math.pow(height, 2) - Math.pow(width / 2, 2)) / (2 * height)]
        let lx = this.props.lightness * width
        let sy = height * this.props.saturation * Math.min(this.props.lightness, 1 - this.props.lightness) * 2
        let trianglePath = [
            'M', 0, 0,
            'L', width, 0,
            'L', width / 2, height,
            'Z'
        ].join(' ')

        return h('section', {class: 'saturation-lightness-picker'},
            h('svg', {width: width + 12, height: height + 12},
                h('defs', {}, ['0, 0, 0', '255, 255, 255'].map((color, i) =>
                    h('linearGradient',
                        {
                            id: `gradient${i}`,
                            x1: 0, y1: 1,
                            x2: 0, y2: 0
                        },

                        h('stop', {'stop-color': `rgb(${color})`}),
                        h('stop', {'stop-color': `rgba(${color}, 0)`, offset: 1})
                    ),
                )),

                h('g', {transform: 'translate(6 6)'},
                    h('path', {
                        fill: chroma.hsv(this.props.hue, 1, 1).hex(),
                        d: trianglePath
                    }),

                    [120, -120].map((angle, i) =>
                        h('path', {
                            fill: `url(#gradient${i})`,
                            transform: `rotate(${angle} ${mx} ${my})`,
                            d: trianglePath
                        })
                    ),

                    h('circle', {
                        r: 6,
                        cx: lx, cy: sy,
                        fill: '#fafafa'
                    }),

                    h('circle', {
                        r: 4,
                        cx: lx, cy: sy,
                        fill: chroma.hsl(this.props.hue, this.props.saturation, this.props.lightness).hex(),
                        stroke: 'black',
                        'stroke-width': 2
                    })
                )
            )
        )
    }
}
