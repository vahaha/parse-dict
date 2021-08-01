const chars64 =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const codes = {}
for (let i = 0; i < 64; i++) codes[chars64.charAt(i)] = i

module.exports = function (s) {
    let val = 0
    const len = s.length

    for (let i = 0; i < len; i++) {
        const code = codes[s.charAt(i)]
        val += code * Math.pow(64, len - i - 1)
    }

    return val
}
