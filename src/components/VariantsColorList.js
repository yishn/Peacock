import chroma from 'chroma-js'
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
            if (index === this.props.colors.length) index = -1
            let color = this.props.colors[index] || this.props.mainColor

            let {onColorClick = () => {}} = this.props
            onColorClick({index, color})
        }
    }

    render() {
        return h('section',
            {
                class: 'variants-color-list'
            },

            h('ul', {class: 'color-list'},
                [...this.props.colors, this.props.mainColor]
                .map((color, i) => [color, i, chroma.distance(color, 'black')])
                .sort(([, , d1], [, , d2]) => d1 - d2)
                .map(([color, i]) =>
                    h('li', 
                        {
                            class: classNames({
                                current: chroma.distance(color, this.props.currentColor) === 0
                            })
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
