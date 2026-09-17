import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({name: 'school', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'degree', type: 'string'}),
    defineField({name: 'field', title: 'Field of study', type: 'string'}),
    defineField({name: 'location', type: 'string'}),
    defineField({name: 'startDate', type: 'date'}),
    defineField({name: 'endDate', type: 'date'}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({name: 'logo', type: 'image', options: {hotspot: true}}),
  ],
  orderings: [
    {title: 'End date (newest)', name: 'endDesc', by: [{field: 'endDate', direction: 'desc'}]},
  ],
  preview: {select: {title: 'school', subtitle: 'degree'}},
})
