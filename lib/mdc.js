
const { readFile, writeFile } = require('fs')
const { promisify } = require('util')
const mdIt = require('markdown-it')
const mdItKatex = require('markdown-it-katex')
const mdItFootnote = require('markdown-it-footnote')
const mdItImsize = require('markdown-it-imsize')
const mdItDeflist = require('markdown-it-deflist')
const mdItDecorate = require('markdown-it-decorate')
const { highlight } = require('highlight.js')
const frontmatter = require('front-matter')
const getMdTitle = require('get-md-title')
const { inHTMLData } = require('xss-filters')
const { join } = require('path')
const Ajv = require('ajv')
const schema = require('./schema.js')

const ajv = new Ajv({
    allErrors: true,
    jsonPointers: true
})

// muh APIs
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const getTitle = s => ((s = getMdTitle(s)) && s.html)

// md parser & compiler
// TODO: Play with different plugins then lock them in
let md = mdIt({
    linkify: true,
    typographer: true,
    highlight (str, lang) {
        return highlight(lang, str).value
    }
})
.use(mdItKatex)
.use(mdItFootnote)
.use(mdItImsize)
.use(mdItDeflist)
.use(mdItDecorate)

// format 'Hello world!' -> 'hello-world'
// only characters allowed are a-z, 0-9, and '-'
let simpleTitle = title => title
    .toLowerCase()
    .replace(/[\s\.,;:?!\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9\-]/, '')

// format Date -> 'YYYY-MM-DD'
let simpleDateString = d =>
    d.getFullYear() + '-' +
    pad2(d.getMonth() + 1) + '-' +
    pad2(d.getDate())

// format 1 -> '01'
let pad2 = n => (n + '').length >= 2 ? n : '0' + n

async function compile (input, output) {
    let mdContent = await readFileAsync(input, 'utf8')
    let { attributes: info, body } = frontmatter(mdContent)
    let validate = ajv.compile(schema)

    if (info.title == null) {
        info.title = getTitle(mdContent)
    }

    if (info.created) {
        info.created = simpleDateString(info.created)
    }

    if (output) {
        info.htmlFile = join(output, `${info.created}-${simpleTitle(info.title)}.html`)
    }

    validate(info)

    if (validate.errors && validate.errors.length) {
        throw validate.errors.map(err => {
            err.file = input
            return err
        })
    }

    if (output) {
        await writeFileAsync(info.htmlFile, md.render(body))
    } else {
        info.htmlBody = md.render(body)
    }

    return info
}

module.exports = {
    compile,
    schema
}
