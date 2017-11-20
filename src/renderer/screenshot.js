import {desktopCapturer, screen} from 'electron'

export function take() {
    let display = screen.getPrimaryDisplay()
    let displayIndex = screen.getAllDisplays().findIndex(item => item.id === display.id)
    let {width, height} = display.size

    return new Promise((resolve, reject) => {
        desktopCapturer.getSources({types: ['screen']}, (err, sources) => {
            if (err) return reject(err)

            navigator.webkitGetUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sources[displayIndex].id,
                        minWidth: width,
                        maxWidth: width,
                        minHeight: height,
                        maxHeight: height
                    }
                }
            }, resolve, reject)
        })
    }).then(stream => new Promise(resolve =>{
        let video = document.createElement('video')

        video.autoplay = true
        video.src = URL.createObjectURL(stream)

        video.addEventListener('playing', () => resolve(video))
    })).then(video => {
        let canvas = document.createElement('canvas')

        canvas.width = width
        canvas.height = height

        let context = canvas.getContext('2d')
        context.drawImage(video, 0, 0)

        return canvas
    })
}
