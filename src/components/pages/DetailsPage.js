import {h} from 'preact'
import Component from '../PureComponent'

import Page from './Page'
import Palette from '../Palette'
import VariantsColorList from '../VariantsColorList'
import Toolbar, {ToolbarButton} from '../Toolbar'

export default class DetailsPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedIndex: null
        }

        this.handleBackClick = evt => {
            evt.preventDefault()

            let {onBackClick = () => {}} = this.props
            onBackClick(evt)
        }

        this.handleNameInput = evt => {
            let {onChange = () => {}} = this.props
            let {value} = evt.currentTarget

            onChange({name: value})
        }

        this.handlePaletteOrderChange = evt => {
            if (evt.permutation == null) return

            let {palette, onChange = () => {}} = this.props

            this.setState(({selectedIndex}) => ({
                selectedIndex: selectedIndex == null ? null : evt.permutation.indexOf(selectedIndex)
            }))

            onChange({colors: evt.permutation.map(i => palette.colors[i])})
        }

        this.handleColorAltClick = evt => {
            this.setState(({selectedIndex}) => ({
                selectedIndex: selectedIndex === evt.index ? null : evt.index
            }))
        }
    }

    render() {
        return h(Page, {id: 'details', show: this.props.show},
            h('section', {class: 'title'},
                h('a',
                    {
                        href: '#',
                        class: 'back',
                        title: 'Go Back',
                        onClick: this.handleBackClick
                    },

                    h('img', {
                        src: './img/back.svg',
                        alt: 'Go Back'
                    })
                ),

                h('input', {
                    class: 'name',
                    type: 'text',
                    value: this.props.palette.name,
                    onInput: this.handleNameInput
                })
            ),

            h('main', {},
                h(Toolbar, {},
                    h(ToolbarButton, {
                        text: 'Add Color…',
                        icon: './img/add.svg'
                    }),

                    h(ToolbarButton, {
                        text: 'Extract Colors from Image…',
                        icon: './img/image.svg'
                    }),

                    h(ToolbarButton, {
                        text: 'Remove Palette',
                        icon: './img/trash.svg',
                        warning: true
                    })
                ),

                h(Palette, {
                    colors: this.props.palette.colors.map(x => x.hex),
                    selectedIndex: this.state.selectedIndex,
                    onOrderChange: this.handlePaletteOrderChange,
                    onColorAltClick: this.handleColorAltClick
                }),

                h(VariantsColorList, {
                    show: this.state.selectedIndex != null
                })
            ),
        )
    }
}
