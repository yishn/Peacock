import chroma from 'chroma-js'
import {h, Component} from 'preact'
import mutate from '../../renderer/mutate'

import ColorWheel from './ColorWheel'

export default class ColorPicker extends Component {
    constructor(props) {
        super(props)

        let [h, s, l] = chroma(props.color).hsl()

        this.state = {
            color: {h: isNaN(h) ? 0 : h, s, l}
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
        return h('section', {id: 'root', class: 'color-picker'},
            h('main', {}, 
                h(ColorWheel, {
                    color: this.state.color,
                    size: 300,
                    onChange: this.handleColorChange
                })
            ),

            h('form', {class: 'buttons'},
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
