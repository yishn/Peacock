const namer = require('color-namer')

self.addEventListener('message', evt => {
    let result = namer(evt.data, {pick: ['ntc']}).ntc[0]

    self.postMessage(Object.assign({
        hex: evt.data,
        name: result.name,
        distance: result.distance,
        foundHex: result.hex
    }))
})
