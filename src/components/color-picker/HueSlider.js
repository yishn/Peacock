import chroma from 'chroma-js'
import {h} from 'preact'
import Component from '../PureComponent'

const hueSteps = 12
const tau = 2 * Math.PI

export default class HueSlider extends Component {
    constructor(props) {
        super(props)

        this.handleMouseDown = evt => {
            if (evt.button !== 0) return

            let {top, left} = this.element.querySelector('svg').getBoundingClientRect()
            let halfSize = this.props.size / 2
            let {clientX, clientY} = evt
            let [mx, my] = [left + halfSize, top + halfSize]

            this.mouseDownInfo = {
                mx, my,
                x: clientX,
                y: clientY
            }

            this.handleMouseMove(evt)
        }

        this.handleMouseUp = evt => {
            this.mouseDownInfo = null
        }

        this.handleMouseMove = evt => {
            if (this.mouseDownInfo == null) return

            evt.preventDefault()

            let {clientX, clientY} = evt
            let {mx, my} = this.mouseDownInfo
            let [dx, dy] = [clientX - mx, clientY - my]
            let angle = Math.atan2(dy, dx) * 360 / tau
            let {onChange = () => {}} = this.props

            onChange({hue: angle})
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
        let {size, strokeWidth} = this.props
        let halfSize = size / 2
        let radius = (size - strokeWidth) / 2 - 10
        let indicatorA = [halfSize + radius - strokeWidth / 2 - 4, halfSize]
        let indicatorB = [halfSize + radius + strokeWidth / 2 + 4, halfSize]

        return h('section',
            {
                ref: el => this.element = el,
                class: 'hue-slider'
            },

            h('svg',
                {
                    width: size,
                    height: size
                },

                h('defs', {}, [...Array(hueSteps)].map((_, i) => {
                    let [dx, dy] = [Math.cos, Math.sin].map(f =>
                        (f((i + 1) * tau / hueSteps) - f(i * tau / hueSteps)) * radius
                    )

                    let length = Math.sqrt(dx * dx + dy * dy)
                    ;[dx, dy] = [dx, dy].map(x => x / length)

                    return h('linearGradient',
                        {
                            id: `gradient${i}`,
                            x1: 0.5 - dx / 2, y1: 0.5 - dy / 2,
                            x2: 0.5 + dx / 2, y2: 0.5 + dy / 2
                        },

                        h('stop', {
                            'stop-color': chroma.hsv(i * 360 / hueSteps, 1, 1).hex()
                        }),

                        h('stop', {
                            'stop-color': chroma.hsv((i + 1) * 360 / hueSteps, 1, 1).hex(),
                            offset: 1.1
                        })
                    )
                })),

                h('g', {'stroke-width': strokeWidth, fill: 'none'},
                    h('circle', {
                        stroke: '#999',
                        'stroke-width': strokeWidth,
                        r: radius,
                        cx: halfSize,
                        cy: halfSize + 3
                    }),

                    [...Array(hueSteps)].map((_, i) =>
                        h('path', {
                            stroke: `url(#gradient${i})`,
                            d: [
                                'M',
                                halfSize + Math.cos(i * tau / hueSteps) * radius,
                                halfSize + Math.sin(i * tau / hueSteps) * radius,
                                'A',
                                radius, radius, 0, 0, 1,
                                halfSize + Math.cos((i + 1) * tau / hueSteps + 0.01 * tau) * radius,
                                halfSize + Math.sin((i + 1) * tau / hueSteps + 0.01 * tau) * radius
                            ].join(' '),
                            onMouseDown: this.handleMouseDown
                        })
                    )
                ),

                h('g',
                    {
                        transform: `rotate(${this.props.hue} ${halfSize} ${halfSize})`,
                        style: {pointerEvents: 'none'}
                    },

                    h('line', {
                        x1: indicatorA[0], y1: indicatorA[1],
                        x2: indicatorB[0], y2: indicatorB[1],
                        stroke: '#fafafa', 'stroke-width': 4
                    }),

                    h('line', {
                        x1: indicatorA[0], y1: indicatorA[1],
                        x2: indicatorB[0], y2: indicatorB[1],
                        stroke: '#333', 'stroke-width': 2
                    }),

                    h('circle', {
                        r: 3, fill: '#333',
                        cx: indicatorA[0], cy: indicatorA[1]
                    }),

                    h('circle', {
                        r: 3, fill: '#333',
                        cx: indicatorB[0], cy: indicatorB[1]
                    })
                )
            )
        )
    }
}
