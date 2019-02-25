export default {
    getItem: (key) => {
        let local = window.localStorage
        let result = local.getItem(key)
        return result ? JSON.parse(result) : null
    },
    setItem: (key, value) => {
        if (!value) {
            return
        }
        value = JSON.stringify(value)
        let local = window.localStorage
        try {
            local.setItem(key, value)
        } catch (e) {

        }
    }
}