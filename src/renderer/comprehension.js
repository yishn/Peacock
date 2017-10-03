function* iterate(arrays) {
    if (arrays.length === 0) return

    if (arrays.length === 1) {
        for (let x of arrays[0]) {
            yield [x]
        }

        return
    }

    let [array, ] = arrays

    for (let x of array) {
        for (let el of iterate(arrays.slice(1))) {
            el.unshift(x)
            yield el
        }
    }
}

export function* range(...args) {
    let [start, end, step] = [0, 0, 1]

    if (args.length >= 2) {
        [start, end, step = 1, ] = args
    } else if (args.length === 1) {
        end = args[0]
    }

    for (let i = start; i < end; i += step) {
        yield i
    }
}

export function where(condition) {
    return {type: 'where', condition}
}

export function from(array) {
    return {type: 'from', array}
}

export default function comprehend(selector, ...args) {
    let conditions = []
    let arrays = []
    let result = []

    for (let arg of args) {
        if (arg.type === 'where') conditions.push(arg.condition)
        else if (arg.type === 'from') arrays.push(arg.array)
    }

    for (let el of iterate(arrays)) {
        if (conditions.some(f => !f(...el))) continue
        result.push(selector(...el))
    }

    return result
}
