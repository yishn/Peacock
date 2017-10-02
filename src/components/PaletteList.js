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
        let {list, count} = this.props.palettes.reduce(({list, count}, palette, i) => {
            if (palette == null)
                return {list, count}

            let top = count * this.state.itemHeight
            let bottom = top + this.state.itemHeight
            let scrollBottom = this.state.scrollTop + this.state.listHeight

            if (bottom < this.state.scrollTop || top > scrollBottom)
                return {list, count: count + 1}

            list.push(h(PaletteListItem, {
                key: i,
                index: i,
                name: palette.name,
                colors: palette.colors.map(x => x.hex),
                style: {top},
                onClick: this.props.onItemClick
            }))

            return {list, count: count + 1}
        }, {list: [], count: 0})

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
                            height: this.state.itemHeight * count
                        }
                    }),

                    list
                ]
            ),

            h('div', {class: 'shadow top'}),
            h('div', {class: 'shadow bottom'})
        )
    }
}
