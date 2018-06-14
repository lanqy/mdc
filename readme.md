
# mdc

Compile directory of markdown into HTML and JSON fragments.

## Install

```shell
npm i -g @jamen/mdc
```

## Usage

### `mdc *.md -o output/ --no-index? --no-json?`

Compiles each markdown file into an HTML file, using an `index.json` to store the front matters and paths:

```shell
$ mdc *.md -o dist
# Results in:
# .
# ├── dist
# │   ├── 2018-06-13-test-article-1.html
# │   ├── 2018-06-13-test-article-2.html
# │   └── index.json
# ├── test-article-1.md
# └── test-article-2.md
```

With `--no-index`, instead of an `index.json` file, separate JSON files of the front matters are created alongside the HTML files (as `*-info.json`):

```shell
$ mdc *.md -o dist --no-index
# Results in:
# .
# ├── dist
# │   ├── 2018-06-13-test-article-1.html
# │   ├── 2018-06-13-test-article-1-info.json
# │   ├── 2018-06-13-test-article-2.html
# │   └── 2018-06-13-test-article-2-info.json
# ├── test-article-1.md
# └── test-article-2.md
```

With `--no-json`, JSON and front matter is omitted entirely:

```shell
$ mdc *.md -o dist --no-json
# Results in:
# .
# ├── dist
# │   ├── 2018-06-13-test-article-1.html
# │   └── 2018-06-13-test-article-2.html
# ├── test-article-1.md
# └── test-article-2.md
```

With one input, you can omit `-o` or `--output` to use stdout instead:

```shell
# Compile to stdout
$ mdc input.md
$ mdc input.md --no-json
```

Every input must have 'title', 'author', 'created', and 'license' properties.

### `mdc(input, output?)`

Function to compile a markdown file into an HTML file, and returns an info object as a promise.  Without `output` the HTML is returned inside the object.

Features of the compiler:

- Made with [markdown-it][1] and [front-matter][2].
- Adds [LaTeX][3], [footnotes][4], and [deflists][5], similar to Pandoc Markdown.
- Adds the [decorate][6] and [imsize][7] plugins for setting classes, attributes, sizes, etc.
- Front matter validated against [a schema][8].

```js
let result = await mdc('./input.md', './dist')
// result.htmlFile

let result = await mdc('./input.md')
// result.htmlBody
```

See [lib/schema.js][8] for more info on the return value.

### License Types

Inspired from [markdown-to-medium][9], the license types are:

- all-rights-reserved
- cc-40-by
- cc-40-by-nd
- cc-40-by-sa
- cc-40-by-nc
- cc-40-by-nc-nd
- cc-40-by-nc-sa
- cc-40-zero
- public-domain

[1]: https://npmjs.com/markdown-it
[2]: https://npmjs.com/front-matter
[3]: https://npmjs.com/markdown-it-katex
[4]: https://npmjs.com/markdown-it-footnotes
[5]: https://npmjs.com/markdown-it-deflist
[6]: https://npmjs.com/markdown-it-decorate
[7]: https://npmjs.com/markdown-it-imsize
[8]: lib/schema.js
[9]: https://www.npmjs.com/package/markdown-to-medium