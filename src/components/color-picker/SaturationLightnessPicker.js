import chroma from 'chroma-js'
import {h} from 'preact'
import Component from '../PureComponent'

const heightScale = Math.sqrt(3) / 2
const padding = 12

let clamp = (min, max, x) => Math.max(min, Math.min(max, x))

export class SaturationLightnessTriangle extends Component {
    render() {
        let {hue, width, height} = this.props
        let triangleHeight = x => x <= 0.5 ? 2 * x * height : 2 * (1 - x) * height

        return h('g', {},
            h('defs', {}, [...Array(width)].map((_, i) => 
                h('linearGradient',
                    {
                        id: `gradient-${i}`,
                        x1: 0, y1: 0,
                        x2: 0, y2: 1
                    },

                    h('stop', {'stop-color': chroma.hsl(hue, 0, i / width).hex()}),
                    h('stop', {'stop-color': chroma.hsl(hue, 1, i / width).hex(), offset: 1})
                )
            )),

            [...Array(width)].map((_, i) => 
                h('path', {
                    fill: `url(#gradient-${i})`,
                    d: [
                        'M', i, 0,
                        'L', i + 1, 0,
                        'L', i + 1, triangleHeight((i + 1) / width),
                        'L', i, triangleHeight(i / width),
                        'Z'
                    ].join(' ')
                })
            )
        )    
    }
}

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

            this.handleMouseMove(evt)
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
            
            let triangleHeight = Math.round(heightScale * (this.props.size - padding))
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

        let width = Math.round(this.props.size - padding)
        let height = Math.round(heightScale * width)
        let [mx, my] = [width / 2, (Math.pow(height, 2) - Math.pow(width / 2, 2)) / (2 * height)]
        let lx = lightness * width
        let sy = height * saturation * Math.min(lightness, 1 - lightness) * 2

        return h('section',
            {
                ref: el => this.element = el,
                class: 'saturation-lightness-picker',
                style: {marginTop: this.props.marginTop}
            },

            h('svg', {width: width + padding, height: height + padding},
                h('g', {transform: `translate(${padding / 2} ${padding / 2})`},
                    h(SaturationLightnessTriangle, {hue, width, height}),

                    h('path', {
                        fill: 'none',
                        stroke: '#999',
                        'stroke-width': 2,
                        d: [
                            'M', 0, 0,
                            'L', width, 0,
                            'L', width / 2, height,
                            'Z'
                        ].join(' '),
                        style: {pointerEvents: 'all'},

                        onMouseDown: this.handleMouseDown
                    }),

                    h('g', {style: {pointerEvents: 'none'}},
                        h('circle', {
                            r: 6,
                            cx: lx, cy: sy,
                            fill: '#fafafa'
                        }),

                        h('circle', {
                            r: 4,
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
