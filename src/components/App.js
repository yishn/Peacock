import {remote} from 'electron'
import {h, Component} from 'preact'

export default class App extends Component {
    constructor() {
        super()

        this.window = remote.getCurrentWindow()
    }

    render() {
        return h('div', {id: 'root'},
            h('h1', {}, 'Hello World!')
        )
    }
}
