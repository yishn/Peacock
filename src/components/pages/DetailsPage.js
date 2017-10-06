import {h} from 'preact'
import Component from '../PureComponent'

import Page from './Page'
import Palette from '../Palette'

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
    }

    render() {
        return h(Page, {id: 'details', show: this.props.show},
            h('section', {class: 'title'},
                h('a', {
                    class: 'back',
                    onClick: this.handleBackClick
                }, 'Go Back'),

                h('input', {
                    class: 'name',
                    type: 'text',
                    value: this.props.palette.name,
                    onInput: this.handleNameInput
                })
            ),

            h(Palette, {
                colors: this.props.palette.colors.map(x => x.hex)
            })
        )
    }
}
