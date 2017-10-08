import chroma from 'chroma-js'
import classNames from 'classnames'
import {h} from 'preact'
import Component from './PureComponent'

import namer from '../renderer/color-namer'
import mutate from '../renderer/mutate'

export class PaletteColor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: null
        }
    }

    componentDidMount() {
        this.componentDidUpdate({})
    }

    componentDidUpdate(prevProps) {
        if (prevProps.color === this.props.color) return

        this.setState({name: null})
        namer(this.props.color).then(name => this.setState({name}))
    }

    render() {
        return h(this.props.tagName,
            mutate({
                title: [this.state.name || '', this.props.color.toUpperCase()].join('\n'),
                style: {background: this.props.color}
            }, this.props.innerProps || {}),

            this.props.children
        )
    }
}

export class MiniPalette extends Component {
    render() {
        return h('ul', {class: 'palette'}, this.props.colors.map(color =>
            h(PaletteColor, {
                key: color,
                color,
                tagName: 'li'
            })
        ))
    }
}

export default class Palette extends Component {
    constructor(props) {
        super(props)

        this.state = {
            permutation: null
        }

        this.handleGrabberMouseDown = evt => {
            evt.preventDefault()

            if (evt.button !== 0) return

            let {clientX, clientY} = evt
            let {dataset} = evt.currentTarget.parentNode
            let index = +dataset.index

            this.grabberMouseDownInfo = {
                index,
                x: clientX,
                y: clientY,
                steps: [...this.element.querySelectorAll('li')].map(li => (({left, top}) =>
                    ({x: left, y: top})
                )(li.getBoundingClientRect()))
            }
        }

        this.handleMouseMove = evt => {
            if (this.grabberMouseDownInfo == null) return

            evt.preventDefault()

            let {index, steps} = this.grabberMouseDownInfo
            let newIndex = steps.findIndex((_, i) => i === steps.length - 1 || steps[i + 1].x > evt.clientX)
            let newPermutation = this.props.colors.map((_, i) => i)

            newPermutation.splice(index, 1)
            newPermutation.splice(newIndex, 0, index)

            this.setState({permutation: newPermutation})
        }

        this.handleMouseUp = evt => {
            if (this.grabberMouseDownInfo != null) {
                if (this.state.permutation != null) {
                    let {onOrderChange = () => {}} = this.props
                    onOrderChange({permutation: this.state.permutation})

                    this.setState({permutation: null})
                }

                this.grabberMouseDownInfo = null
            }

            if (this.colorMouseDownInfo != null) {
                let {index, button, time} = this.colorMouseDownInfo

                if (Date.now() - time < 500) {
                    let {onColorClick = () => {}} = this.props
                    onColorClick({index, button})

                    clearTimeout(this.colorAltClickTimeout)
                }

                this.colorMouseDownInfo = null
            }
        }

        this.handleColorMouseDown = evt => {
            let index = +evt.currentTarget.parentNode.dataset.index

            this.colorMouseDownInfo = {
                index,
                button: evt.button,
                time: Date.now()
            }

            this.colorAltClickTimeout = setTimeout(() => {
                let {onColorAltClick = () => {}} = this.props
                onColorAltClick({index})
            }, 500)
        }
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handleMouseMove)
        document.addEventListener('mouseup', this.handleMouseUp)
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleMouseMove)
        document.removeEventListener('mouseup', this.handleMouseUp)
    }

    render() {
        return h('ul',
            {
                ref: el => this.element = el,
                class: 'palette'
            },

            (this.state.permutation || this.props.colors.map((_, i) => i))
            .map(i => (color => h('li',
                {
                    key: i,
                    class: classNames({selected: this.props.selectedIndex === i}),
                    'data-index': i
                },

                h(PaletteColor, {
                    color,
                    tagName: 'a',
                    innerProps: {
                        href: '#',
                        class: 'color',
                        onMouseDown: this.handleColorMouseDown
                    }
                }),

                h('a',
                    {
                        href: '#',
                        class: classNames('grabber', {
                            invert: chroma.distance(color, 'black') < chroma.distance(color, 'white')
                        }),

                        onMouseDown: this.handleGrabberMouseDown
                    },

                    h('img', {src: './img/grabber.svg'})
                )
            ))(this.props.colors[i]))
        )
    }
}
