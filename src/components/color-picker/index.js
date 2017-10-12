import chroma from 'chroma-js'
import classNames from 'classnames'
import {h} from 'preact'
import Component from '../PureComponent'
import mutate from '../../renderer/mutate'

import HueSlider from './HueSlider'
import SaturationLightnessPicker from './SaturationLightnessPicker'

export default class ColorPicker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            hide: false
        }

        this.handleHueChange = evt => {
            let {onChange = () => {}} = this.props
            onChange({color: mutate(this.props.color, {h: evt.hue})})
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
                hue: this.props.color.h,
                height: 300,
                strokeWidth: 20,
                onChange: this.handleHueChange
            }),

            h(SaturationLightnessPicker, {
                hue: this.props.color.h,
                saturation: this.props.color.s,
                lightness: this.props.color.l,
                size: 200,
            })
        )
    }
}
