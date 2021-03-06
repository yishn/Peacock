import classNames from 'classnames'
import {h} from 'preact'
import Component from '../helper/PureComponent'

export default class Page extends Component {
    constructor(props) {
        super(props)

        this.state = {
            show: props.show
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show) {
            this.setState({show: true})
        } else {
            setTimeout(() => this.setState({show: false}), this.props.showDelay || 500)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return super.shouldComponentUpdate(nextProps, nextState)
            && (nextState.show || nextState.show !== this.state.show)
    }

    render() {
        return h('section',
            {
                id: this.props.id,
                class: classNames('page', {show: this.state.show})
            },

            h('div', {}, this.props.children)
        )
    }
}
