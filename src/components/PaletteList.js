import classNames from 'classnames'
import {h} from 'preact'
import Component from './PureComponent'
import Palette from './Palette'

export class PaletteListItem extends Component {
    constructor(props) {
        super(props)

        this.handleClick = evt => {
            evt.preventDefault()

            let {onClick = () => {}} = this.props
            onClick({index: this.props.index})
        }
    }

    render() {
        return h('li',
            {
                ref: el => this.element = el,
                class: 'item',
                style: this.props.style,
                'data-index': this.props.index
            },

            h(Palette, {
                colors: this.props.colors
            }),

            h('h3', {class: 'name'},
                h('a', {onClick: this.handleClick}, this.props.name)
            )
        )
    }
}

export default class PaletteList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            listHeight: null,
            itemHeight: null,
            scrollTop: 0
        }

        this.handleScroll = () => {
            this.setState({scrollTop: this.element.querySelector('ul').scrollTop})
        }
    }

    componentDidMount() {
        this.measureItemHeight()
        this.measureListHeight()

        window.addEventListener('resize', () => {
            this.measureListHeight()
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.palettes !== this.props.palettes) {
            this.listElement.scrollTop = 0
        }
    }

    measureItemHeight() {
        let measureElement = this.listElement.querySelector('.item')
        let {height} = measureElement.getBoundingClientRect()

        this.setState({itemHeight: Math.round(height)})
    }

    measureListHeight() {
        let {height} = this.listElement.getBoundingClientRect()

        this.setState({listHeight: Math.round(height)})
    }

    render() {
        let needMeasure = this.state.itemHeight == null

        return h('section',
            {
                ref: el => this.element = el,
                class: classNames('palette-list', {
                    measure: needMeasure
                })
            },

            h('ul',
                {
                    ref: el => this.listElement = el,
                    onScroll: this.handleScroll
                },

                needMeasure

                ? h(PaletteListItem, {
                    name: 'Measure Item',
                    colors: ['#222222']
                })

                : [
                    h('li', {
                        key: 'placeholder',
                        class: 'placeholder',
                        style: {
                            height: this.state.itemHeight * this.props.palettes.length
                        }
                    }),

                    (() => {
                        let list = []
                        let scrollBottom = this.state.scrollTop + this.state.listHeight
                        let start = Math.ceil(this.state.scrollTop / this.state.itemHeight) - 1
                        let end = Math.floor(scrollBottom / this.state.itemHeight) + 1

                        for (let i = Math.max(start, 0); i < Math.min(end, this.props.palettes.length); i++) {
                            let palette = this.props.palettes[i]
                            let top = i * this.state.itemHeight

                            list.push(h(PaletteListItem, {
                                key: i,
                                index: i,
                                name: palette.name,
                                colors: palette.colors.map(x => x.hex),
                                style: {top},
                                onClick: this.props.onItemClick
                            }))
                        }

                        return list
                    })()
                ]
            ),

            h('div', {class: 'shadow top'}),
            h('div', {class: 'shadow bottom'})
        )
    }
}
