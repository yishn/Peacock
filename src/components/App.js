import {remote} from 'electron'
import {h, Component} from 'preact'

import mutate from '../renderer/mutate'

import FilterPanel from './FilterPanel'
import FilterPaletteList from './FilterPaletteList'
import Toolbar, {ToolbarButton} from './Toolbar'

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
                },
                {
                    name: 'Ocean Five',
                    colors: [
                        {
                            hex: '#00a0b0',
                            variants: []
                        },
                        {
                            hex: '#6a4a3c',
                            variants: []
                        },
                        {
                            hex: '#cc333f',
                            variants: []
                        },
                        {
                            hex: '#eb6841',
                            variants: []
                        },
                        {
                            hex: '#edc951',
                            variants: []
                        }
                    ]
                },
                {
                    name: 'Giant Goldfish',
                    colors: [
                        {
                            hex: '#69d2e7',
                            variants: []
                        },
                        {
                            hex: '#a7dbd8',
                            variants: []
                        },
                        {
                            hex: '#e0e4cc',
                            variants: []
                        },
                        {
                            hex: '#f38630',
                            variants: []
                        },
                        {
                            hex: '#fa6900',
                            variants: []
                        }
                    ]
                },
                {
                    name: 'Adrift in Dreams',
                    colors: [
                        {
                            hex: '#cff09e',
                            variants: []
                        },
                        {
                            hex: '#a8dba8',
                            variants: []
                        },
                        {
                            hex: '#79bd9a',
                            variants: []
                        },
                        {
                            hex: '#3b8686',
                            variants: []
                        },
                        {
                            hex: '#0b486b',
                            variants: []
                        }
                    ]
                },
                {
                    name: 'Mellon Ball Surprise',
                    colors: [
                        {
                            hex: '#d1f2a5',
                            variants: []
                        },
                        {
                            hex: '#ffc48c',
                            variants: []
                        },
                        {
                            hex: '#ff9f80',
                            variants: []
                        },
                        {
                            hex: '#f56991',
                            variants: []
                        }
                    ].reverse()
                },
                {
                    name: 'Sunset Sails',
                    colors: [
                        {
                            hex: '#fff0ab',
                            variants: []
                        },
                        {
                            hex: '#ecd64c',
                            variants: []
                        },
                        {
                            hex: '#ff8544',
                            variants: []
                        },
                        {
                            hex: '#7d5f43',
                            variants: []
                        },
                        {
                            hex: '#26171e',
                            variants: []
                        }
                    ]
                }
            ],
            filter: {
                text: '',
                hue: null
            }
        }

        this.handleFilterChange = this.handleFilterChange.bind(this)
    }

    handleFilterChange(evt) {
        this.setState(({filter}) => ({filter: mutate(filter, evt)}))
    }

    render() {
        return h('div', {id: 'root'},
            h('section', {id: 'browse', class: 'page'},
                h(FilterPanel, {
                    text: this.state.filter.text,
                    hue: this.state.filter.hue,
                    onChange: this.handleFilterChange
                }),

                h(FilterPaletteList, {
                    palettes: this.state.palettes,
                    filter: this.state.filter,
                    onItemClick: console.log
                }),

                h(Toolbar, {},
                    h(ToolbarButton, {
                        text: 'Add Palette…',
                        icon: './img/add.svg'
                    })
                )
            )
        )
    }
}
