import {Component} from 'preact'

export default class PureComponent extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        for (let key in this.props)
            if (this.props[key] !== nextProps[key]) return true
        for (let key in this.state)
            if (this.state[key] !== nextState[key]) return true

        return false
    }
}
