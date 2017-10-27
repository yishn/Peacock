import {clipboard} from 'electron'
import chroma from 'chroma-js'
import {h} from 'preact'
import Component from '../PureComponent'
import * as dialog from '../../renderer/dialog'

import Page from './Page'
import Palette from '../Palette'
import VariantsColorList from '../VariantsColorList'
import Toolbar, {ToolbarButton} from '../Toolbar'

class CopyItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            confirmCopy: false
        }

        this.handleCopyClick = evt => {
            evt.preventDefault()

            if (this.state.confirmCopy) return

            let value = this.codeElement.innerText
            clipboard.writeText(value)

            this.setState({confirmCopy: true})
            setTimeout(() => this.setState({confirmCopy: false}), 500)
        }
    }

    render() {
        return h('li', {class: this.props.type}, 
            h('code', {
                ref: el => this.codeElement = el
            }, this.props.value),
            
            h('a', {
                class: 'copy', 
                href: '#', 
                title: 'Copy',
                style: {
                    backgroundImage: `url(${
                        this.state.confirmCopy ? './img/tick.svg' : './img/copy.svg'
                    })`
                },

                onClick: this.handleCopyClick
            })
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

    componentWillReceiveProps(nextProps) {
        if (this.props.palette !== nextProps.palette 
        && !nextProps.palette.colors.some(color => 
            chroma.distance(color.hex, this.state.currentColor) === 0
        )) {
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
                    colors: selectedColor.variants,
                    currentIndex: selectedColor.variants
                        .findIndex(x => chroma.distance(x, this.state.currentColor) === 0),
                        
                    onColorClick: this.handleVariantColorClick
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
