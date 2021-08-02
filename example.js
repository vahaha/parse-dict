const parse = require('.')
const fs = require('fs')
const gunzip = require('zlib').createGunzip

const dfile = process.argv[2] || 'data/anhviet109K.dict.dz'
const ifile = process.argv[3] || 'data/anhviet109K.index'

const writeStream = fs.createWriteStream('dict.txt')
const dstream = fs.createReadStream(dfile).pipe(gunzip())
const istream = fs.createReadStream(ifile)

const parsing = parse(dstream, istream)

parsing.on('data', data => {
    writeStream.write(data.from + ' ' + data.to + '\n', 'utf8')
})

parsing.on('end', () => {
    console.log('finished!')
})

const word = 'a'
const base = `@a /ei, ə/
*  danh từ,  số nhiều as,  a's
- (thông tục) loại a, hạng nhất, hạng tốt nhất hạng rất tốt
=his health is a+ sức khoẻ anh ta vào loại a
- (âm nhạc) la
=a sharp+ la thăng
=a flat+ la giáng
- người giả định thứ nhất; trường hợp giả định thứ nhất
=from a to z+ từ đầu đến đuôi, tường tận
=not to know a from b+ không biết tí gì cả; một chữ bẻ đôi cũng không biết
*  mạo từ
- một; một (như kiểu); một (nào đó)
=a very cold day+ một ngày rất lạnh
=a dozen+ một tá
=a few+ một ít
=all of a size+ tất cả cùng một cỡ
=a Shakespeare+ một (văn hào như kiểu) Sếch-xpia
=a Mr Nam+ một ông Nam (nào đó)
- cái, con, chiếc, cuốn, người, đứa...;
=a cup+ cái chén
=a knife+ con dao
=a son of the Party+ người con của Đảng
=a Vietnamese grammar+ cuốn ngữ pháp Việt Nam
*  giới từ
- mỗi, mỗi một
=twice a week+ mỗi tuần hai lần`

console.log('Base\n', base)
console.log('\nDetach\n', JSON.stringify(parse.detach(word, base), null, 2))
const md = parse.toMarkdown(base)
console.log('\nMarkdown\n', md)
console.log('\nHTML\n', parse.toHtml(md))

process.stdout.on('error', process.exit)
