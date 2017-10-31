import chroma from 'chroma-js'
import {h, Component} from 'preact'
import mutate from '../../renderer/mutate'

import ColorWheel from './ColorWheel'

export default class ColorPicker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            color: (([h, s, l]) => 
                ({h: isNaN(h) ? 0 : h, s, l})
            )(chroma(props.color).hsl()),
        }

        this.handleColorChange = evt => {
            this.setState({color: evt.color})
        }
    }

    render() {
        return h('section', {id: 'root', class: 'color-picker'},
            h(ColorWheel, {
                color: this.state.color,
                size: 300,
                onChange: this.handleColorChange
            })
        )
    }
}
