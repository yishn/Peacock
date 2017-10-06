import {h} from 'preact'
import Component from '../PureComponent'

import Palette from '../Palette'

export default class DetailsPage extends Component {
    render() {
        return h('section', {id: 'details', class: 'page'},
            h('section', {class: 'title'},
                h('a', {class: 'back'}, 'Go Back'),

                h('input', {
                    class: 'name',
                    type: 'text',
                    value: this.props.palette.name
                })
            ),

            h(Palette, {
                colors: this.props.palette.colors.map(x => x.hex)
            })
        )
    }
}
