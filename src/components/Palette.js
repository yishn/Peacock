import {h} from 'preact'
import Component from './PureComponent'

import namer from '../renderer/color-namer'
import mutate from '../renderer/mutate'

export class PaletteColor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: null
        }
    }

    componentDidMount() {
        this.componentDidUpdate({})
    }

    componentDidUpdate(prevProps) {
        if (prevProps.color === this.props.color) return

        this.setState({name: null})
        namer(this.props.color).then(name => this.setState({name}))
    }

    render() {
        return h('li', {
            title: [this.state.name || '', this.props.color].join('\n').trim(),
            style: {background: this.props.color}
        })
    }
}

export default class Palette extends Component {
    render() {
        return h('ul', {class: 'palette'},
            this.props.colors.map(color =>
                h(PaletteColor, {key: color, color})
            )
        )
    }
}
