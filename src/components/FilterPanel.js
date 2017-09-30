import {h} from 'preact'
import Component from './PureComponent'

export default class FilterPanel extends Component {
    constructor() {
        super()

        this.handleTextInputChange = evt => {
            let {value} = evt.currentTarget
            let {onChange = () => {}} = this.props

            onChange({text: value})
        }
    }

    render() {
        return h('section', {class: 'filter-panel'},
            h('ul', {},
                h('li', {class: 'text'},
                    h('input', {
                        type: 'search',
                        placeholder: 'Filter',
                        value: this.props.text,
                        onInput: this.handleTextInputChange
                    })
                )
            )
        )
    }
}
