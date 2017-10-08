import classNames from 'classnames'
import {h} from 'preact'
import Component from './PureComponent'

export default class VariantsColorList extends Component {
    constructor(props) {
        super(props)

        this.handleAddButtonClick = evt => {
            evt.preventDefault()

            let {onAddButtonClick = () => {}} = this.props
            onAddButtonClick(evt)
        }
    }

    render() {
        return h('section',
            {
                class: classNames('variants-color-list', {show: this.props.show})
            },

            h('ul', {class: 'color-list'},
                h('li', {class: 'add'},
                    h('a', {
                        href: '#',
                        title: 'Add Color Variant…',
                        onClick: this.handleAddButtonClick
                    })
                )
            )
        )
    }
}
