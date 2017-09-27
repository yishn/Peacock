import {h} from 'preact'
import Component from './PureComponent'

export default class Palette extends Component {
    render() {
        return h('ul', {class: 'palette'},
            this.props.colors.map(color =>
                h('li', {
                    style: {
                        background: color
                    }
                })
            )
        )
    }
}
