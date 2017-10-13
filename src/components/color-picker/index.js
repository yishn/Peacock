import chroma from 'chroma-js'
import classNames from 'classnames'
import {h} from 'preact'
import Component from '../PureComponent'
import mutate from '../../renderer/mutate'

import ColorWheel from './ColorWheel'

export default class ColorPicker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            hide: false
        }
    }

    render() {
        return h('section',
            {
                class: classNames('color-picker', {
                    show: this.props.show,
                    hide: this.state.hide
                })
            },

            h(ColorWheel, {
                color: this.props.color,
                size: 300,
                onChange: this.props.onChange
            })
        )
    }
}
