import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'work',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'projectLink', title: 'Live link', type: 'url'}),
    defineField({name: 'codeLink', title: 'Code link', type: 'url'}),
    defineField({name: 'tags', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}}),
  ],
  preview: {select: {title: 'title', media: 'image'}},
})
