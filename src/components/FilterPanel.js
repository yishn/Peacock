import {h} from 'preact'
import Component from './PureComponent'

export default class FilterPanel extends Component {
    render() {
        return h('section', {class: 'filter-panel'},
            h('ul', {},
                h('li', {class: 'text'},
                    h('input', {
                        type: 'search',
                        placeholder: 'Filter',
                        value: this.props.text
                    })
                )
            )
        )
    }
}
