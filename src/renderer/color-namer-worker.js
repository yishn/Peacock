const namer = require('color-namer')

self.addEventListener('message', evt => {
    self.postMessage({
        hex: evt.data,
        name: namer(evt.data, {pick: ['ntc']}).ntc[0].name
    })
})
