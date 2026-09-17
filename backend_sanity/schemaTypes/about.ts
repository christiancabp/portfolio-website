import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'about',
  title: 'About item',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
  ],
})
