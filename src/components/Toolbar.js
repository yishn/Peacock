import {h} from 'preact'
import Component from './PureComponent'

export default class Toolbar extends Component {
    render() {
        return h('section', {class: 'toolbar'},
            h('ul', {},
                this.props.children
            )
        )
    }
}

export class ToolbarButton extends Component {
    constructor(props) {
        super(props)

        this.handleClick = evt => {
            evt.preventDefault()

            let {onClick = () => {}} = this.props
            onClick()
        }
    }

    render() {
        return h('li', {class: 'button'},
            h('a', {onClick: this.handleClick, title: this.props.text},
                h('img', {src: this.props.icon, alt: this.props.text})
            )
        )
    }
}
