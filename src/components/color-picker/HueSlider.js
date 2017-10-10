import chroma from 'chroma-js'
import {h} from 'preact'
import Component from '../PureComponent'

const hueSteps = 12
const tau = 2 * Math.PI

export default class HueSlider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            width: null
        }

        this.measure = () => {
            let {width} = this.element.getBoundingClientRect()
            this.setState({width})
        }

        this.handleMouseDown = evt => {
            let {top, left} = this.element.querySelector('svg').getBoundingClientRect()
            let halfSize = Math.min(this.state.width, this.props.height) / 2
            let {clientX, clientY} = evt
            let [mx, my] = [left + halfSize, top + halfSize]
            let distance = Math.sqrt(Math.pow(mx - clientX, 2) + Math.pow(my - clientY, 2))

            if (distance > halfSize - this.props.strokeWidth - 8 && distance < halfSize) {
                this.mouseDownInfo = {
                    mx, my,
                    x: clientX,
                    y: clientY
                }

                this.handleMouseMove(evt)
            }
        }

        this.handleMouseUp = evt => {
            this.mouseDownInfo = null
        }

        this.handleMouseMove = evt => {
            if (this.mouseDownInfo == null) return

            let {clientX, clientY} = evt
            let {mx, my} = this.mouseDownInfo
            let [dx, dy] = [clientX - mx, clientY - my]
            let angle = Math.atan2(dy, dx) * 360 / tau
            let {onChange = () => {}} = this.props

            onChange({hue: angle})
        }
    }

    componentDidMount() {
        this.measure()
        
        window.addEventListener('resize', this.measure)
        document.addEventListener('mouseup', this.handleMouseUp)
        document.addEventListener('mousemove', this.handleMouseMove)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.measure)
        document.removeEventListener('mouseup', this.handleMouseUp)
        document.removeEventListener('mousemove', this.handleMouseMove)
    }

    render() {
        let size = Math.min(this.state.width, this.props.height)
        let halfSize = size / 2
        let radius = (size - this.props.strokeWidth) / 2 - 10
        let indicatorA = [halfSize + radius - this.props.strokeWidth / 2 - 4, halfSize]
        let indicatorB = [halfSize + radius + this.props.strokeWidth / 2 + 4, halfSize]

        return h('div',
            {
                ref: el => this.element = el,
                class: 'hue-slider',
                style: {height: this.props.height}
            },

            this.state.width == null ? null : [
                h('svg',
                    {
                        width: size,
                        height: size,
                        style: {
                            marginTop: -halfSize,
                            marginLeft: -halfSize
                        },
                        onMouseDown: this.handleMouseDown
                    },

                    h('defs', {}, [...Array(hueSteps)].map((_, i) => {
                        let [dx, dy] = [Math.cos, Math.sin].map((f, j) =>
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

                    h('g', {'stroke-width': this.props.strokeWidth, fill: 'none'},
                        [...Array(hueSteps)].map((_, i) =>
                            h('path', {
                                stroke: `url(#gradient${i})`,
                                d: [
                                    'M',
                                    halfSize + Math.cos(i * tau / hueSteps) * radius,
                                    halfSize + Math.sin(i * tau / hueSteps) * radius,
                                    'A',
                                    radius, radius, 0, 0, 1,
                                    halfSize + Math.cos((i + 1) * tau / hueSteps) * radius,
                                    halfSize + Math.sin((i + 1) * tau / hueSteps) * radius
                                ].join(' ')
                            })
                        )
                    ),

                    h('g', {transform: `rotate(${this.props.hue} ${halfSize} ${halfSize})`},
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
            ]
        )
    }
}
