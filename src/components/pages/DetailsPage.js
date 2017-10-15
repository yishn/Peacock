import chroma from 'chroma-js'
import {h} from 'preact'
import Component from '../PureComponent'
import * as dialog from '../../renderer/dialog'

import Page from './Page'
import Palette from '../Palette'
import VariantsColorList from '../VariantsColorList'
import Toolbar, {ToolbarButton} from '../Toolbar'

export default class DetailsPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedIndex: 0,
            currentColor: '#ecd078'
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

        this.handleMainColorClick = evt => {
            this.setState({
                selectedIndex: evt.index,
                currentColor: this.props.palette.colors[evt.index].hex
            })
        }

        this.handleVariantColorClick = evt => {
            this.setState({
                currentColor: this.props.palette.colors[this.state.selectedIndex].variants[evt.index]
            })
        }

        this.handleRemoveClick = evt => {
            let result = dialog.showMessageBox(
                'Do you really want to remove this palette?',
                'warning', ['Remove Palette', 'Cancel']
            )

            if (result === 0) {
                let {onRemove = () => {}} = this.props
                onRemove(evt)
            }
        }
    }

    render() {
        let selectedColor = this.props.palette.colors[this.state.selectedIndex]

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
                        warning: true,
                        onClick: this.handleRemoveClick
                    })
                ),

                h(Palette, {
                    colors: this.props.palette.colors.map(x => x.hex),
                    selectedIndex: this.state.selectedIndex,
                    currentIndex: this.props.palette.colors
                        .findIndex(x => chroma.distance(x.hex, this.state.currentColor) === 0),

                    onOrderChange: this.handlePaletteOrderChange,
                    onColorClick: this.handleMainColorClick
                }),

                h(VariantsColorList, {
                    colors: selectedColor.variants,
                    currentIndex: selectedColor.variants
                        .findIndex(x => chroma.distance(x, this.state.currentColor) === 0),
                        
                    onColorClick: this.handleVariantColorClick
                })
            ),
        )
    }
}
