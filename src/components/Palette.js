import {h} from 'preact'
import Component from './PureComponent'

import namer from '../renderer/color-namer'
import mutate from '../renderer/mutate'

export default class Palette extends Component {
    constructor(props) {
        super(props)

        this.state = {
            colorNames: []
        }

        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({colorNames: [...nextProps.colors].map(_ => null)})
        this.getColorNames()
    }

    getColorNames() {
        for (let i = 0; i < this.props.colors.length; i++) {
            namer(this.props.colors[i])
            .then(name => {
                this.setState(({colorNames}) => ({
                    colorNames: mutate(colorNames, {[i]: name})
                }))
            })
        }
    }

    render() {
        return h('ul', {class: 'palette'},
            this.props.colors.map((color, i) =>
                h('li', {
                    title: this.state.colorNames[i],
                    style: {background: color}
                })
            )
        )
    }
}
