import classNames from 'classnames'
import {h} from 'preact'
import Component from './PureComponent'

import {PaletteColor} from './Palette'

export default class VariantsColorList extends Component {
    constructor(props) {
        super(props)

        this.handleAddButtonClick = evt => {
            evt.preventDefault()

            let {onAddButtonClick = () => {}} = this.props
            onAddButtonClick()
        }

        this.handleColorClick = evt => {
            evt.preventDefault()

            let index = +evt.currentTarget.dataset.index
            let {onColorClick = () => {}} = this.props

            onColorClick({index})
        }
    }

    render() {
        return h('section',
            {
                class: 'variants-color-list'
            },

            h('ul', {class: 'color-list'},
                this.props.colors.map((color, i) =>
                    h('li', 
                        {
                            class: classNames({current: this.props.currentIndex === i})
                        }, 

                        h(PaletteColor, {
                            color,
                            tagName: 'a',
                            innerProps: {
                                'data-index': i,
                                href: '#',
                                onClick: this.handleColorClick
                            }
                        })
                    )
                ),

                h('li', {class: 'add'},
                    h('a', {
                        href: '#',
                        title: 'Add Color Variant…',
                        onClick: this.handleAddButtonClick
                    })
                )
            )
        )
    }
}
