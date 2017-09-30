import {remote} from 'electron'
import {h, Component} from 'preact'

import FilterPanel from './FilterPanel'
import PaletteList from './PaletteList'

const setting = remote.require('./setting')

export default class App extends Component {
    constructor() {
        super()

        this.window = remote.getCurrentWindow()

        this.state = {
            palettes: [
                {
                    name: 'Thought Provoking',
                    colors: [
                        {
                            hex: '#ECD078',
                            variants: []
                        },
                        {
                            hex: '#D95B43',
                            variants: []
                        },
                        {
                            hex: '#C02942',
                            variants: []
                        },
                        {
                            hex: '#542437',
                            variants: []
                        },
                        {
                            hex: '#53777A',
                            variants: []
                        }
                    ]
                },
                {
                    name: 'Odd Flavor Combos',
                    colors: [
                        {
                            hex: '#B85323',
                            variants: []
                        },
                        {
                            hex: '#ED6E35',
                            variants: []
                        },
                        {
                            hex: '#FCA75A',
                            variants: []
                        },
                        {
                            hex: '#FCB778',
                            variants: []
                        },
                        {
                            hex: '#F1F2D4',
                            variants: []
                        }
                    ]
                },
                {
                    name: 'Red Poppy Fabric',
                    colors: [
                        {
                            hex: '#F3DDC6',
                            variants: []
                        },
                        {
                            hex: '#FE7356',
                            variants: []
                        },
                        {
                            hex: '#E13F3C',
                            variants: []
                        },
                        {
                            hex: '#8A4F41',
                            variants: []
                        }
                    ]
                }
            ],
            filter: {
                text: ''
            }
        }
    }

    render() {
        return h('div', {id: 'root'},
            h('section', {id: 'browse', class: 'page'},
                h(FilterPanel, {
                    text: this.state.filter.text
                }),

                h(PaletteList, {
                    palettes: this.state.palettes
                })
            )
        )
    }
}
