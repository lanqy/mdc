
module.exports = {
    description: 'Front-matter of an article.',
    type: 'object',
    required: [
        'title',
        'author',
        'created',
        'license'
    ],
    properties: {
        title: {
            description: 'The title of an article.',
            type: 'string'
        },
        author: {
            description: 'The author of an article.',
            type: 'string'
        },
        created: {
            description: 'When an article was created.',
            type: 'string'
        },
        license: {
            description: 'The license of an article.',
            type: 'string',
            enum: [
                'all-rights-reserved',
                'cc-40-by',
                'cc-40-by-nd',
                'cc-40-by-sa',
                'cc-40-by-nc',
                'cc-40-by-nc-nd',
                'cc-40-by-nc-sa',
                'cc-40-zero',
                'public-domain'
            ]
        },
        tags: {
            description: 'Tags for categorizing articles.',
            type: 'array',
            items: {
                type: 'string'
            }
        },
        htmlFile: {
            description: 'The path to the article compiled as an HTML fragment.',
            type: 'string'
        },
        htmlBody: {
            description: 'The contents of the article compiled as an HTML fragment.',
            type: 'string'
        }
    }
}
