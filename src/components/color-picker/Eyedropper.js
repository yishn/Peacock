import {h, Component} from 'preact'
import {screen, remote} from 'electron'
import * as screenshot from '../../renderer/screenshot'

export default class Eyedropper extends Component {
    constructor() {
        super()

        this.window = remote.getCurrentWindow()
        this.display = screen.getPrimaryDisplay()

        this.state = {
            screenshot: null,
            mousePosition: null,
            magnifiedImage: null
        }

        this.handleMouseMove = evt => {
            let mousePosition = [evt.clientX, evt.clientY]

            this.setState({mousePosition})
        }

        screenshot.take().then(res => {
            this.setState({screenshot: res})
            this.window.show()
        })
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handleMouseMove)
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleMouseMove)
    }

    render() {
        return h('section', 
            {
                id: 'eyedropper',
                style: {
                    backgroundImage: `url(${this.state.screenshot})`
                }
            },

            this.state.mousePosition && h('section', {
                class: 'crosshair',
                style: {
                    backgroundImage: `url(${this.state.magnifiedImage})`,
                    left: this.state.mousePosition[0] + 8,
                    top: this.state.mousePosition[1] + 8
                }
            })
        )
    }
}
