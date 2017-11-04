import {clipboard} from 'electron'
import chroma from 'chroma-js'
import classNames from 'classnames'
import {h, Component} from 'preact'
import mutate from '../../renderer/mutate'

import FlashableComponent from '../helper/FlashableComponent'
import ColorWheel from './ColorWheel'

function chroma2hsl(color) {
    let [h, s, l] = color.hsl()
    return {h: isNaN(h) ? 0 : h, s, l}
}

class HexInputItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: props.value
        }

        this.onValueChange = evt => {
            let {value} = evt.currentTarget
            let {onChange = () => {}} = this.props
            let valid = /^#[0-9a-zA-Z]{6}$/.test(value.trim())

            this.setState({value})

            if (!valid) return
            onChange({color: chroma2hsl(chroma(value))})
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value})
    }

    render() {
        return h(FlashableComponent, {}, (flash, handleFlash) => 
            h('li', {class: classNames('hex', {flash})}, 
                h('h3', {
                    title: 'Copy', 
                    onClick: () => {
                        if (!handleFlash()) return

                        clipboard.writeText(this.props.value)
                    }
                }, 'Hex'), ' ',

                h('input', {
                    type: 'text', 
                    value: this.state.value,
                    onInput: this.onValueChange
                })
            )
        )
    }
}

class RgbInputItem extends Component {
    constructor(props) {
        super(props)

        let {r, g, b} = props
        this.state = {r, g, b}

        this.handleValueChange = evt => {
            let {value, dataset} = evt.currentTarget
            let {onChange = () => {}} = this.props

            this.setState({[dataset.prop]: value})

            if (isNaN(value)) return

            let rgb = [...'rgb'].map(x => x === dataset.prop ? +value : this.props[x])
            onChange({color: chroma2hsl(chroma(...rgb))})
        }
    }

    componentWillReceiveProps(nextProps) {
        let {r, g, b} = nextProps
        this.setState({r, g, b})
    }

    render() {
        return h(FlashableComponent, {}, (flash, handleFlash) => 
            h('li', {class: classNames('rgb', {flash})}, 
                h('h3', {
                    title: 'Copy', 
                    onClick: () => {
                        if (!handleFlash()) return

                        clipboard.writeText(`rgb(${
                            [...'rgb'].map(x => this.props[x]).join(', ')
                        })`)
                    }
                }, 'RGB'), ' ',

                [...'rgb'].map(x => 
                    [h('input', {
                        'data-prop': x,
                        type: 'number',
                        min: 0,
                        max: 255,
                        value: this.state[x],
                        onInput: this.handleValueChange
                    }), ' ']
                )
            )
        )
    }
}

class HsvInputItem extends Component {
    constructor(props) {
        super(props)

        let {h, s, l} = props
        this.state = {h, s, l}

        this.handleHueChange = evt => {
            let {value} = evt.currentTarget
            let {onChange = () => {}} = this.props

            this.setState({h: value})

            if (isNaN(value)) return
            onChange({color: {h: +value, s: this.props.s / 100, l: this.props.l / 100}})
        }

        this.handleValueChange = evt => {
            let {value, dataset} = evt.currentTarget
            let {onChange = () => {}} = this.props

            this.setState({[dataset.prop]: value})

            if (isNaN(value)) return

            let sl = [...'sl'].map(x => x === dataset.prop ? +value / 100 : this.props[x] / 100)
            onChange({color: {h: this.props.h, s: sl[0], l: sl[1]}})
        }
    }

    componentWillReceiveProps(nextProps) {
        let {h, s, l} = nextProps
        this.state = {h, s, l}
    }

    render() {
        return h(FlashableComponent, {}, (flash, handleFlash) => 
            h('li', {class: classNames('hsl', {flash})}, 
                h('h3', {
                    title: 'Copy', 
                    onClick: () => {
                        if (!handleFlash()) return

                        clipboard.writeText(`hsl(${this.props.h}, ${this.props.s}%, ${this.props.l}%)`)
                    }
                }, 'HSL'), ' ',
                
                h('input', {
                    type: 'number', 
                    min: 0,
                    max: 359,
                    value: this.state.h,
                    onInput: this.handleHueChange
                }), ' ',

                [...'sl'].map(x =>
                    [h('input', {
                        'data-prop': x,
                        type: 'number',
                        min: 0,
                        max: 100,
                        value: this.state[x],
                        onInput: this.handleValueChange
                    }), ' ']
                )
            )
        )
    }
}

export default class ColorPicker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            color: chroma2hsl(chroma(props.color))
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

                h('div', {class: 'eyedropper'},
                    h('div', {class: 'current-color', style: {background: color.hex()}})
                ),

                h('ul', {class: 'codes'},
                    h(HexInputItem, {
                        value: color.hex().toUpperCase(),
                        onChange: this.handleColorChange
                    }),

                    h(RgbInputItem, [...'rgb'].reduce(
                        (acc, x) => Object.assign(acc, {[x]: color.get(`rgb.${x}`)}), 
                        {onChange: this.handleColorChange}
                    )),

                    h(HsvInputItem, {
                        h: this.state.color.s === 0 ? 0 : (Math.round(this.state.color.h) + 360) % 360,
                        s: Math.round(this.state.color.s * 100),
                        l: Math.round(this.state.color.l * 100),
                        onChange: this.handleColorChange
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
