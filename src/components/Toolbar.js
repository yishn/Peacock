import classNames from 'classnames'
import {h} from 'preact'
import Component from './helper/PureComponent'

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
            onClick(evt)
        }
    }

    render() {
        return h('li',
            {
                class: classNames('button', {
                    warning: this.props.warning
                })
            },

            h('a', {href: '#', title: this.props.text, onClick: this.handleClick},
                h('img', {src: this.props.icon, alt: this.props.text})
            )
        )
    }
}
