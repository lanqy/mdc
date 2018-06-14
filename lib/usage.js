
const { gray, green } = require('chalk')
const fmSchema = require('./schema.js')

function usage () {
    console.log(gray(`
${green('$ mdc *.md -o output --no-index? --no-json?')}

Compiles each markdown file into an HTML file, using an index.json to store the
front matters and paths.

With --no-index, instead of the default index.json file, separate JSON files of
the front matters are created alongside the HTML files (as *-info.json).

With --no-json, JSON and front matter is omitted entirely.

With one input, you can omit -o or --output to use stdout instead.

Every input must have 'title', 'author', 'created', and 'license' properties.

${green('Front matter properties')}
`))

    let longestName = null

    for (let name in fmSchema.properties) {
        if (name.length > longestName) {
            longestName = name.length
        }
    }

    for (let name in fmSchema.properties) {
        let { description } = fmSchema.properties[name]
        name = name + new Array(longestName - name.length + 1).join(' ')
        console.log(green(name) + gray(' - ' + description))
    }

    console.log(gray('\n(see README.md and lib/fm-schema.js for more info)'))
}

module.exports = usage
