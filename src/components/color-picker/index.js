import chroma from 'chroma-js'
import {h, Component} from 'preact'
import mutate from '../../renderer/mutate'

import ColorWheel from './ColorWheel'

class HexInputItem extends Component {
    render() {
        return h('li', {class: 'hex'}, 
            h('h3', {title: 'Copy'}, 'Hex'), ' ',

            h('input', {
                type: 'text', 
                value: this.props.value
            })
        )
    }
}

class RgbInputItem extends Component {
    render() {
        return h('li', {class: 'rgb'}, 
            h('h3', {title: 'Copy'}, 'RGB'), ' ',

            [...'rgb'].map(x => 
                [h('input', {
                    type: 'number',
                    min: 0,
                    max: 255,
                    value: this.props[x]
                }), ' ']
            )
        )
    }
}

class HsvInputItem extends Component {
    render() {
        return h('li', {class: 'hsl'}, 
            h('h3', {title: 'Copy'}, 'HSL'), ' ',
            
            h('input', {
                type: 'number', 
                min: 0,
                max: 359,
                value: (this.props.h + 360) % 360
            }), ' ',

            [...'sl'].map(x =>
                [h('input', {
                    type: 'number',
                    min: 0,
                    max: 100,
                    value: this.props[x]
                }), ' ']
            )
        )
    }
}

export default class ColorPicker extends Component {
    constructor(props) {
        super(props)

        let [h, s, l] = chroma(props.color).hsl()

        this.state = {
            color: {h: isNaN(h) ? 0 : Math.round(h), s, l}
        }

        this.handleColorChange = evt => {
            this.setState({color: evt.color})
        }

        this.handleSubmitClick = evt => {
            evt.preventDefault()

            let {onSubmit = () => {}} = this.props
            onSubmit({
                color: chroma.hsl(...[...'hsl'].map(x => this.state.color[x])).hex()
            })
        }

        this.handleCancelClick = evt => {
            evt.preventDefault()

            let {onSubmit = () => {}} = this.props
            onSubmit({color: null})
        }

        this.handleKeyDown = evt => {
            if (evt.keyCode === 13) {
                // Enter
                this.handleSubmitClick(evt)
            } else if (evt.keyCode === 27) {
                // Escape
                this.handleCancelClick(evt)
            }
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown)
    }

    render() {
        let color = chroma.hsl(...[...'hsl'].map(x => this.state.color[x]))

        return h('section', {id: 'root', class: 'color-picker'},
            h('main', {}, 
                h(ColorWheel, {
                    color: this.state.color,
                    size: 300,
                    onChange: this.handleColorChange
                }),

                h('ul', {class: 'codes'},
                    h(HexInputItem, {value: color.hex().toUpperCase()}),
                    h(RgbInputItem, [...'rgb'].reduce(
                        (acc, x) => Object.assign(acc, {[x]: color.get(`rgb.${x}`)}), {})
                    ),
                    h(HsvInputItem, {
                        h: this.state.color.s === 0 ? 0 : this.state.color.h,
                        s: Math.round(this.state.color.s * 100),
                        l: Math.round(this.state.color.l * 100)
                    })
                )
            ),

            h('section', {class: 'buttons'},
                h('button', {
                    type: 'submit',
                    onClick: this.handleSubmitClick
                }, 'Submit'), ' ',

                h('button', {
                    type: 'reset',
                    onClick: this.handleCancelClick
                }, 'Cancel')
            )
        )
    }
}
