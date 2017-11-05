import {h} from 'preact'
import mutate from '../../renderer/mutate'

import Component from '../helper/PureComponent'
import SaturationLightnessPicker from './SaturationLightnessPicker'
import HueSlider from './HueSlider'

export default class ColorWheel extends Component {
    constructor(props) {
        super(props)

        this.handleHueChange = evt => {
            let {onChange = () => {}} = this.props
            
            onChange({color: mutate(this.props.color, {
                h: evt.hue
            })})
        }

        this.handleSaturationLightnessChange = evt => {
            let {onChange = () => {}} = this.props

            onChange({color: mutate(this.props.color, {
                s: evt.saturation,
                l: evt.lightness
            })})
        }
    }

    render() {
        let strokeWidth = 20
        let innerRadius = this.props.size / 2 - strokeWidth - 10

        return h('section', {class: 'color-wheel'},
            h(SaturationLightnessPicker, {
                hue: this.props.color.h,
                saturation: this.props.color.s,
                lightness: this.props.color.l,
                size: innerRadius * Math.sqrt(3),
                marginTop: -innerRadius / 2 - 3,
                onChange: this.handleSaturationLightnessChange
            }),

            h(HueSlider, {
                hue: this.props.color.h,
                size: this.props.size,
                strokeWidth,
                onChange: this.handleHueChange
            })
        )
    }
}
