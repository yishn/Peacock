import chroma from 'chroma-js'
import {h} from 'preact'
import Component from '../PureComponent'

const heightScale = Math.sqrt(3) / 2
const margin = 12

let clamp = (min, max, x) => Math.max(min, Math.min(max, x))

export default class SaturationLightnessPicker extends Component {
    constructor(props) {
        super(props)

        this.handleMouseDown = evt => {
            if (evt.button !== 0) return

            this.mouseDownInfo = {
                x: evt.clientX,
                y: evt.clientY,
                measurements: evt.currentTarget.getBoundingClientRect()
            }
        }

        this.handleMouseUp = () => {
            this.mouseDownInfo = null
        }

        this.handleMouseMove = evt => {
            if (this.mouseDownInfo == null) return

            evt.preventDefault()

            let {onChange = () => {}} = this.props
            let {measurements} = this.mouseDownInfo
            let relX = clamp(0, 1, (evt.clientX - measurements.left) / measurements.width)
            let relY = clamp(0, 1, (evt.clientY - measurements.top) / measurements.height)
            let lightness = clamp(relY / 2, (2 - relY) / 2, relX)
            let triangleHeight = Math.round(heightScale * (this.props.size - margin))
            let height = triangleHeight * Math.min(lightness, 1 - lightness) * 2
            let saturation = clamp(0, 1, height === 0 ? 0 : relY * triangleHeight / height)

            onChange({lightness, saturation})
        }
    }

    componentDidMount() {
        document.addEventListener('mouseup', this.handleMouseUp)
        document.addEventListener('mousemove', this.handleMouseMove)
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.handleMouseUp)
        document.removeEventListener('mousemove', this.handleMouseMove)
    }

    render() {
        let {hue, saturation, lightness} = this.props
        let width = this.props.size - margin
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

        return h('section',
            {
                ref: el => this.element = el,
                class: 'saturation-lightness-picker'
            },

            h('svg', {width: width + margin, height: height + margin},
                h('defs', {},
                    ['0, 0, 0', '255, 255, 255'].map((color, i) =>
                        h('linearGradient',
                            {
                                id: `gradient${i}`,
                                x1: 0, y1: 1,
                                x2: 0, y2: 0
                            },

                            h('stop', {'stop-color': `rgb(${color})`}),
                            h('stop', {'stop-color': `rgba(${color}, 0)`, offset: 1})
                        ),
                    ),

                    h('linearGradient',
                        {
                            id: 'colorGradient',
                            x1: 0, y1: 0,
                            x2: 0, y2: 1
                        },

                        h('stop', {'stop-color': `rgb(${
                            chroma.hsv(hue, 0, .5).rgb().join(',')
                        })`}),
                        
                        h('stop', {'stop-color': `rgb(${
                            chroma.hsv(hue, 1, 1).rgb().join(',')
                        })`, offset: 3 / 8})
                    )
                ),

                h('g', {transform: 'translate(6 6)'},
                    h('path', {
                        fill: 'url(#colorGradient)',
                        d: trianglePath,
                        onMouseDown: this.handleMouseDown
                    }),

                    [120, -120].map((angle, i) =>
                        h('path', {
                            fill: `url(#gradient${i})`,
                            transform: `rotate(${angle} ${mx} ${my})`,
                            d: trianglePath,
                            style: {pointerEvents: 'none'}
                        })
                    ),

                    h('g', {style: {pointerEvents: 'none'}},
                        h('circle', {
                            r: margin / 2,
                            cx: lx, cy: sy,
                            fill: '#fafafa'
                        }),

                        h('circle', {
                            r: margin / 2 - 2,
                            cx: lx, cy: sy,
                            fill: chroma.hsl(hue, saturation, lightness).hex(),
                            stroke: '#333',
                            'stroke-width': 2
                        })
                    )
                )
            )
        )
    }
}
