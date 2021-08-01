const through = require('through2')
const readonly = require('read-only-stream')
const { Converter } = require('showdown')
const decode64 = require('./libs/decode64.js')
const split = require('split')

const converter = new Converter()

exports = module.exports = function (dstream, istream) {
    const offsets = {}
    istream.pipe(split('\n')).pipe(through.obj(iwrite, iend))

    const pos = 0
    let pool = Buffer.from('')

    const arrOffers = []
    let indexOffer = 0
    let maxIndexOffer = 0

    const output = through.obj(dwrite)
    return readonly(output)

    function iwrite(buf, enc, next) {
        const fields = buf.toString('utf8').split('\t')
        if (fields.length !== 3) return next()

        const word = fields[0]
        const offset = decode64(fields[1])
        const size = decode64(fields[2])
        offsets[offset] = { word: word, size }
        arrOffers.push(offset)
        next()
    }
    function iend() {
        maxIndexOffer = arrOffers.length - 1
        arrOffers.sort((a, b) => a - b)
        dstream.pipe(output)
    }

    function dwrite(buf, enc, next) {
        pool = Buffer.concat([pool, buf])
        let offset = arrOffers[indexOffer]
        let { size } = offsets[offset]

        while (pool.length >= size) {
            const buffTo = pool.slice(0, size)
            pool = pool.slice(size)

            process(buffTo)

            indexOffer += 1
            if (indexOffer > maxIndexOffer) {
                return
            }

            offset = arrOffers[indexOffer]
            size = offsets[offset].size
        }
        next()
    }

    function process(buf) {
        const offset = arrOffers[indexOffer]
        const { word } = offsets[offset]

        const to = buf.toString('utf8')
        if (offsets[pos]) {
            output.push({ from: word, to })
        }
    }
}

exports.detach = (word, mean) => {
    const lines = mean.split('\n')
    let pronunciation = ''

    let firstLine = lines[0]
    if (firstLine.indexOf(`@${word}`) === 0) {
        firstLine = firstLine.replace(`@${word}`, '').trim()
        if (firstLine) {
            pronunciation = firstLine
        }
    }

    lines.shift()

    return { word, mean: lines.join('\n'), pronunciation }
}

exports.toMarkdown = mean => {
    const lines = mean.split('\n')

    lines.forEach((line, idx) => {
        let lineMD = line
        if (/^\*\s\s/.test(line)) {
            lineMD = lineMD.replace('*  ', '### ')
        } else if (/^=/.test(lineMD)) {
            lineMD = lineMD.replace('=', '    - ')
        }

        if (/.+\+\s.+/.test(lineMD)) {
            lineMD = lineMD.replace(/\+\s*/, ': *').replace(/\s*$/, '')
            lineMD = lineMD + '*'
        }

        lines[idx] = lineMD
    })

    return lines.join('\n')
}

exports.toHtml = meanMD => {
    return converter.makeHtml(meanMD)
}
