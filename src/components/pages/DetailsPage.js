import {h} from 'preact'
import Component from '../PureComponent'

import Page from './Page'
import Palette from '../Palette'
import Toolbar, {ToolbarButton} from '../Toolbar'

export default class DetailsPage extends Component {
    constructor(props) {
        super(props)

        this.handleBackClick = evt => {
            evt.preventDefault()

            let {onBackClick = () => {}} = this.props
            onBackClick()
        }

        this.handleNameInput = evt => {
            let {onChange = () => {}} = this.props
            let {value} = evt.currentTarget

            onChange({name: value})
        }

        this.handlePaletteOrderChange = evt => {
            if (evt.permutation == null) return

            let {palette, onChange = () => {}} = this.props
            onChange({colors: evt.permutation.map(i => palette.colors[i])})
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
                h(Palette, {
                    colors: this.props.palette.colors.map(x => x.hex),
                    onOrderChange: this.handlePaletteOrderChange
                })
            ),

            h(Toolbar, {},
                h(ToolbarButton, {
                    text: 'Add Color…',
                    icon: './img/add.svg'
                })
            )
        )
    }
}
