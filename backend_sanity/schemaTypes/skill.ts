import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'category',
      type: 'string',
      options: {list: ['Frontend', 'Backend', 'Tools', 'Other']},
      initialValue: 'Other',
    }),
    defineField({name: 'icon', type: 'image', options: {hotspot: true}}),
    defineField({name: 'bgColor', title: 'Background color', type: 'string'}),
  ],
  preview: {select: {title: 'name', subtitle: 'category', media: 'icon'}},
})
