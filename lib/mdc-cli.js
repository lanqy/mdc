#!/usr/bin/env node

const { writeFile } = require('fs')
const { promisify } = require('util')
const { resolve, relative, dirname, basename } = require('path')
const minimist = require('minimist')
const glob = require('tiny-glob')
const mkdirp = require('mkdirp')
const { gray, green, red, yellow } = require('chalk')
const usage = require('./usage.js')
const { compile } = require('./mdc.js')

const writeFileAsync = promisify(writeFile)
const mkdirpAsync = promisify(mkdirp)

let {
    _: inputs,
    output,
    index,
    json,
    help
} = minimist(process.argv.slice(2), {
    alias: { output: 'o' },
    boolean: [ 'index', 'json', 'help' ],
    default: { index: true, json: true }
})

let cwd = process.cwd()

async function main () {
    if (help) {
        usage()
        process.exit(0)
    }

    let inputFiles = []

    for (let input of inputs) {
        for (let inputFile of await glob(input)) {
            inputFiles.push(inputFile)
        }
    }

    if (!output) {
        if (inputFiles.length === 1) {
            try {
                let result = await compile(inputFiles[0])
                if (json) {
                    return console.log(JSON.stringify(result, null, 4))
                } else {
                    return console.log(result.htmlBody)
                }
            } catch (err) {
                return logError(err)
            }
        } else if (inputFiles.length > 1) {
            throw new Error('More than one input with no output directory.')
        } else {
            throw new Error('Must have at least one input file.')
        }
    }

    await mkdirp(output)

    console.log(
        gray(
            inputFiles.length !== 1
            ? `Found ${green(inputFiles.length)} markdown files.`
            : `Found ${green(1)} markdown file.`
        )
    )

    if (index) {
        let index = []

        for (let input of inputFiles) {
            try {
                let info = await compile(input, output)
                index.push(info)
                logResult(input, info.htmlFile)
            } catch (err) {
                logError(err)
            }
        }

        if (json) {
            let indexFile = resolve(output, 'index.json')

            await writeFileAsync(indexFile, JSON.stringify(index, null, 4))

            console.log(gray(`Created ${green(relative(cwd, indexFile))}.`))
        }
    } else {
        for (let input of inputFiles) {
            try {
                let info = await compile(input, output)

                if (json) {
                    let infoFile = resolve(
                        dirname(info.htmlFile),
                        basename(info.htmlFile, '.html') + '-info.json'
                    )

                    info.infoFile = infoFile

                    await writeFileAsync(infoFile, JSON.stringify(info, null, 4))
                }

                logResult(input, info.htmlFile, json)
            } catch (err) {
                return logError(err)
            }

        }
    }
}

function logResult (input, output, andJson) {
    console.log(
        gray(
            `Compiled ${green(relative(cwd, input))} ` +
            `to ${green(relative(cwd, output))}` +
            (andJson ? ` and its ${green('info.json')}.` : '.')
        )
    )
}

function logError (err) {
    if (Array.isArray(err)) {
        return err.forEach(logError)
    } else if (err) {
        if (err.file) {
            console.log(
                red('Error: ') +
                green(relative(cwd, err.file)) +
                gray(err.dataPath.replace('/', '\'s ') + ' ' + err.message + '.')
            )
        } else {
            console.log(red('Error: ') + gray(err.message + '.'))
        }
    }
}

function logField (benchmark) {
    let name = benchmark.name || ordinal(benchmark.id)
    name = name + new Array(longestName - name.length).join(' ')
    process.stdout.write(`${name} - `)
}

main().catch(err => {
    console.error(red(err.name + ': ') + gray(err.message))
    process.exit(1)
})
