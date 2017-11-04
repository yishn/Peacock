import {h, Component} from 'preact'

export default class FlashableComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            flash: false
        }

        this.handleFlash = () => {
            if (this.state.flash) return false

            this.setState({flash: true})
            setTimeout(() => this.setState({flash: false}), 500)

            return true
        }
    }

    render() {
        return this.props.children[0](this.state.flash, this.handleFlash)
    }
}
