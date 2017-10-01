let worker = new Worker('./src/workers/color-namer-worker.js')
let cache = {}

export default function colorNamer(color) {
    color = color.toLowerCase()

    return new Promise(resolve => {
        if (color in cache && cache[color] != null) {
            return resolve(cache[color])
        }

        let handleMessage = evt => {
            if (color !== evt.data.hex) return

            cache[color] = evt.data.name
            worker.removeEventListener('message', handleMessage)
            resolve(evt.data.name)
        }

        if (!(color in cache)) {
            cache[color] = null
            worker.postMessage(color)
        }

        worker.addEventListener('message', handleMessage)
    })
}
