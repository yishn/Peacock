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

        let color = this.props.color
        this.setState({name: null})

        namer(color, this.props.cache).then(name => {
            if (this.props.color === color) {
                this.setState({name})
            }
        })
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
                elementMeasurements: this.element.getBoundingClientRect(),
                stepMeasurements: [...this.element.querySelectorAll('li')].map(li =>
                    li.getBoundingClientRect()
                )
            }
        }

        this.handleMouseMove = evt => {
            if (this.grabberMouseDownInfo == null) return

            evt.preventDefault()

            let {index, stepMeasurements, elementMeasurements} = this.grabberMouseDownInfo
            let {top, bottom, left, right} = elementMeasurements

            let newIndex = evt.clientX < left || evt.clientX > right
                || evt.clientY < top || evt.clientY > bottom
                ? null
                : stepMeasurements.findIndex((_, i) =>
                    i === stepMeasurements.length - 1
                    || stepMeasurements[i + 1].left > evt.clientX
                )
            let newPermutation = this.props.colors.map((_, i) => i)

            newPermutation.splice(index, 1)
            if (newIndex != null) newPermutation.splice(newIndex, 0, index)

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
        }

        this.handleColorClick = evt => {
            evt.preventDefault()

            let index = +evt.currentTarget.parentNode.dataset.index
            let {onColorClick = () => {}} = this.props
            
            onColorClick({index})
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
                    key: color,
                    'data-index': i,
                    class: classNames({
                        selected: this.props.selectedIndex === i,
                        current: this.props.currentIndex === i
                    })
                },

                h(PaletteColor, {
                    color,
                    tagName: 'a',
                    innerProps: {
                        href: '#',
                        class: 'color',
                        
                        onClick: this.handleColorClick
                    }
                }),

                h('a',
                    {
                        href: '#',
                        class: classNames('grabber', {
                            invert: chroma.distance(color, 'black') < chroma.distance(color, 'white')
                        }),
                        title: 'Drag to Reorder or Remove',

                        onMouseDown: this.handleGrabberMouseDown
                    },

                    h('img', {src: './img/grabber.svg'})
                )
            ))(this.props.colors[i]))
        )
    }
}
