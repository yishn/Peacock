import classNames from 'classnames'
import {h} from 'preact'
import Component from '../PureComponent'

import HueSlider from './HueSlider'

export default class ColorPicker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            hue: 0,
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

            h(HueSlider, {
                hue: this.state.hue,
                height: 300,
                strokeWidth: 20,
                onChange: ({hue}) => this.setState({hue})
            })
        )
    }
}
