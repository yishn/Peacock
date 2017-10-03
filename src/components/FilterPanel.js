import classNames from 'classnames'
import colorNamer from 'color-namer'
import {h} from 'preact'
import Component from './PureComponent'

export default class FilterPanel extends Component {
    constructor() {
        super()

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

                h('li', {class: 'hue'}, h('ul', {},
                    h('li', {
                        class: classNames('none', {current: this.props.hue == null}),
                        style: {backgroundColor: '#444'},
                        title: 'None',
                        'data-hue': 'null',
                        onClick: this.handleHueClick
                    }),

                    colorNamer.lists.roygbiv.map(x => h('li', {
                        class: classNames({
                            current: this.props.hue != null
                                && this.props.hue.toLowerCase() === x.hex.toLowerCase()
                        }),
                        style: {backgroundColor: x.hex},
                        title: x.name[0].toUpperCase() + x.name.slice(1).toLowerCase(),
                        'data-hue': x.hex,
                        onClick: this.handleHueClick
                    }))
                ))
            )
        )
    }
}
