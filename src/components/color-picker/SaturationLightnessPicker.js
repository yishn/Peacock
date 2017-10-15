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
        let lx = lightness * width
        let sy = height * saturation * Math.min(lightness, 1 - lightness) * 2

        let trianglePath = [
            'M', 0, 0,
            'L', width, 0,
            'L', width / 2, height,
            'Z'
        ].join(' ')

        return h('section',
            {
                ref: el => this.element = el,
                class: 'saturation-lightness-picker',
                style: {marginTop: this.props.marginTop}
            },

            h('svg', {width: width + margin, height: height + margin},
                h('defs', {},
                    h('linearGradient',
                        {
                            id: 'shadeGradient',
                            x1: 0, y1: 0,
                            x2: 1, y2: 0
                        },

                        h('stop', {'stop-color': 'black'}),
                        h('stop', {'stop-color': 'white', offset: 1})
                    ),

                    h('linearGradient', 
                        {
                            id: 'transparentGradient',
                            x1: 0, y1: 0,
                            x2: 0, y2: 1
                        },

                        h('stop', {'stop-color': 'white'}),
                        h('stop', {'stop-color': 'rgb(128, 128, 128)', offset: 5 / 8}),
                        h('stop', {'stop-color': 'black', offset: 1})
                    ),

                    h('mask', {id: 'shadeMask'},
                        h('rect', {
                            fill: 'url(#transparentGradient)',
                            x: 0, y: 0,
                            width, height
                        })
                    )
                ),

                h('g', {transform: 'translate(6 6)'},
                    h('path', {
                        fill: chroma.hsv(hue, 1, 1).hex(),
                        stroke: '#999',
                        'stroke-width': 2,
                        d: trianglePath,
                        onMouseDown: this.handleMouseDown
                    }),

                    h('path', {
                        mask: 'url(#shadeMask)',
                        fill: 'url(#shadeGradient)',
                        stroke: '#999',
                        'stroke-width': 2,
                        d: trianglePath,
                        style: {pointerEvents: 'none'}
                    }),

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
