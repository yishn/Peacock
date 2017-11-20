import {h, Component} from 'preact'
import {screen, nativeImage, remote} from 'electron'
import {take as takeScreenshot} from '../../renderer/screenshot'

export default class Eyedropper extends Component {
    constructor() {
        super()

        this.window = remote.getCurrentWindow()
        this.display = screen.getPrimaryDisplay()

        this.state = {
            screenshot: null,
            mousePosition: null,
            color: null
        }

        this.handleMouseMove = evt => {
            if (this.screenshotData == null) return

            let mousePosition = [evt.clientX, evt.clientY]
            let i = (evt.clientY * this.width + evt.clientX) * 4
            let colorData = this.screenshotData.slice(i, i + 3)

            this.setState({
                mousePosition,
                color: `rgb(${colorData.join(', ')})`
            })
        }
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handleMouseMove)

        this.window.show()

        takeScreenshot().then(canvas => {
            this.width = canvas.width
            this.height = canvas.height
            this.screenshotData = canvas.getContext('2d').getImageData(0, 0, this.width, this.height).data

            this.setState({screenshot: canvas.toDataURL()})
        })
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleMouseMove)
    }

    render() {
        let {screenshot, mousePosition, color} = this.state

        return h('section', 
            {
                id: 'eyedropper',
                style: {
                    cursor: screenshot == null ? 'none' : null,
                    backgroundImage: screenshot != null && `url('${screenshot}')`
                }
            },

            screenshot != null 
            && mousePosition != null 
            && h('section', {
                class: 'color',
                style: {
                    backgroundColor: color,
                    left: mousePosition[0],
                    top: mousePosition[1]
                }
            })
        )
    }
}
