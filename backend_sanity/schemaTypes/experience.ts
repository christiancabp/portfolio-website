import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({name: 'role', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'company', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'companyUrl', type: 'url'}),
    defineField({name: 'location', type: 'string'}),
    defineField({name: 'startDate', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'endDate', type: 'date'}),
    defineField({name: 'current', title: 'Currently here', type: 'boolean', initialValue: false}),
    defineField({name: 'highlights', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'logo', type: 'image', options: {hotspot: true}}),
  ],
  orderings: [
    {title: 'Start date (newest)', name: 'startDesc', by: [{field: 'startDate', direction: 'desc'}]},
  ],
  preview: {select: {title: 'role', subtitle: 'company'}},
})
