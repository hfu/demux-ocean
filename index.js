const config = require('config')
const Parser = require('json-text-sequence').parser
const fs = require('fs')

const srcPath = config.get('srcPath')
const mainPath = config.get('mainPath')
const subPath = config.get('subPath')
const subRelations = config.get('subRelations')

const main = fs.createWriteStream(mainPath)
const sub = fs.createWriteStream(subPath)
count = 0

const parser = new Parser()
  .on('data', f => {
    count++
    const rfc8142 = `\x1e${JSON.stringify(f)}\n`
    if (subRelations.includes(f.properties._relation)) {
      sub.write(rfc8142)
    } else {
      main.write(rfc8142)
    }
    if (count % 10000 === 0) console.log(count)
  })
  .on('finish', () => {
    main.close()
    sub.close()
    console.log('finished.')
  })

fs.createReadStream(srcPath).pipe(parser)

