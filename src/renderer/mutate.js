export default function mutate(obj, change) {
    let newObj = Array.isArray(obj) ? [...obj] : Object.assign({}, obj)

    if (Array.isArray(obj) && typeof change === 'function') {
        change(newObj)
        return newObj
    }

    for (let key in change) {
        let value = change[key]

        if (Array.isArray(obj) && isNaN(key)) {
            newObj[key](...value)
        } else {
            newObj[key] = isPrimitive(value) || Array.isArray(value) ? value : mutate(newObj[key], value)
        }
    }

    return newObj
}

export function isPrimitive(value) {
    return value == null || typeof value !== 'object'
}
