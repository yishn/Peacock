import classNames from 'classnames'
import chroma from 'chroma-js'
import {h} from 'preact'
import Component from './PureComponent'

export default class FilterPanel extends Component {
    constructor(props) {
        super(props)

        this.handleTextInputChange = evt => {
            let {value} = evt.currentTarget
            let {onChange = () => {}} = this.props

            onChange({text: value})
        }

        this.handleHueClick = evt => {
            let {hue} = evt.currentTarget.dataset
            let {onChange = () => {}} = this.props

            onChange({hue: hue === 'null' ? null : hue})
        }
    }

    render() {
        return h('section', {class: 'filter-panel'},
            h('ul', {},
                h('li', {class: 'text'},
                    h('input', {
                        type: 'search',
                        placeholder: 'Filter',
                        value: this.props.text,
                        onInput: this.handleTextInputChange
                    })
                ),

                h('li', {class: 'hue'}, h('ul', {class: 'color-list'},
                    h('li',
                        {
                            class: classNames('none', {
                                current: this.props.hue == null
                            })
                        },

                        h('a', {
                            style: {backgroundColor: '#444'},
                            title: 'None',
                            'data-hue': 'null',
                            onClick: this.handleHueClick
                        })
                    ),

                    ['Red', 'Yellow', 'Green', 'Teal', 'Blue', 'Indigo', 'Violet']
                    .map((x, i) => [chroma.hsv(i * 360 / 7, 1, 1).hex(), x])
                    .map(([color, title]) => h('li',
                        {
                            class: classNames({
                                current: this.props.hue != null
                                    && this.props.hue.toLowerCase() === color.toLowerCase()
                            })
                        },

                        h('a', {
                            title,
                            style: {backgroundColor: color},
                            'data-hue': color,
                            onClick: this.handleHueClick
                        })
                    ))
                ))
            )
        )
    }
}
