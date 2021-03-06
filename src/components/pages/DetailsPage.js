import {clipboard, remote} from 'electron'
import chroma from 'chroma-js'
import {h} from 'preact'
import * as dialog from '../../renderer/dialog'

import Component from '../helper/PureComponent'
import FlashableComponent from '../helper/FlashableComponent'
import Page from './Page'
import Palette from '../Palette'
import VariantsColorList from '../VariantsColorList'
import Toolbar, {ToolbarButton} from '../Toolbar'

const colorPicker = remote.require('./color-picker')

class CopyItem extends Component {
    render() {
        return h(FlashableComponent, {}, (flash, handleFlash) => 
            h('li', {class: this.props.type}, 
                h('code', {
                    ref: el => this.codeElement = el
                }, this.props.value),
                
                h('a', {
                    class: 'copy', 
                    href: '#', 
                    title: 'Copy',
                    style: {
                        backgroundImage: `url(${
                            flash ? './img/tick.svg' : './img/copy.svg'
                        })`
                    },

                    onClick: evt => {
                        evt.preventDefault()

                        if (handleFlash()) return

                        let value = this.codeElement.innerText
                        clipboard.writeText(value)
                    }
                })
            )
        )
    }
}

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
                currentColor: evt.color
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

        this.handleAddVariantButtonClick = evt => {
            colorPicker.show(this.state.currentColor, evt => console.log(evt.color))
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState({
                selectedIndex: 0,
                currentColor: nextProps.palette.colors[0].hex
            })
        }
    }

    render() {
        let chromaColor = chroma(this.state.currentColor)
        let selectedColor = this.props.palette.colors[this.state.selectedIndex]

        return h(Page, {id: 'details', show: this.props.show},
            h('main', {},
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

                h(Toolbar, {},
                    h(ToolbarButton, {
                        text: 'Add Color…',
                        icon: './img/add.svg'
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
                    mainColor: selectedColor.hex,
                    colors: selectedColor.variants,
                    currentColor: this.state.currentColor,
                        
                    onColorClick: this.handleVariantColorClick,
                    onAddButtonClick: this.handleAddVariantButtonClick
                })
            ),

            h('section', {class: 'codes'}, 
                h('ul', {},
                    h(CopyItem, {
                        type: 'hex',
                        value: [
                            '#',
                            h('em', {}, chromaColor.hex().slice(1).toUpperCase())
                        ]
                    }),

                    h(CopyItem, {
                        type: 'rgb',
                        value: ['rgb(', chromaColor.rgb().map((x, i) => 
                            i === 0 ? h('em', {}, x)
                            : [', ', h('em', {}, x)]
                        ), ')'] 
                    }),

                    h(CopyItem, {
                        type: 'hsl',
                        value: ['hsl(', chromaColor.hsl().map((x, i) => 
                            i > 0 ? [', ', h('em', {}, Math.round(x * 100) + '%')]
                            : h('em', {}, isNaN(x) ? 0 : Math.round(x))
                        ), ')']
                    })
                )
            )
        )
    }
}
