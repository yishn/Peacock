import {h, Component} from 'preact'

export default class Eyedropper extends Component {
    constructor() {
        super()

        this.state = {
            mousePosition: null
        }

        this.handleMouseMove = evt => {
            this.setState({
                mousePosition: [evt.clientX, evt.clientY]
            })
        }
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handleMouseMove)
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleMouseMove)
    }

    render() {
        return h('section', {id: 'eyedropper'},
            this.state.mousePosition && h('section', {
                class: 'crosshair',
                style: {
                    left: this.state.mousePosition[0],
                    top: this.state.mousePosition[1]
                }
            })
        )
    }
}
