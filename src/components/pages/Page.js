import classNames from 'classnames'
import {h} from 'preact'
import Component from '../PureComponent'

export default class Page extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return super.shouldComponentUpdate(nextProps, nextState)
            && (nextProps.show || nextProps.show !== this.props.show)
    }

    render() {
        return h('section',
            {
                id: this.props.id,
                class: classNames('page', {show: this.props.show})
            },

            this.props.children
        )
    }
}
