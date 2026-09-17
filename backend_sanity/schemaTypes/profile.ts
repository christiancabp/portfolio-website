import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'title', title: 'Job title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'tagline', type: 'string'}),
    defineField({name: 'bio', type: 'text', rows: 4}),
    defineField({name: 'email', type: 'string'}),
    defineField({name: 'avatar', type: 'image', options: {hotspot: true}}),
    defineField({name: 'resumePdf', title: 'Resume PDF', type: 'file'}),
    defineField({
      name: 'socials',
      type: 'array',
      of: [
        defineField({
          name: 'social',
          type: 'object',
          fields: [
            {name: 'platform', type: 'string'},
            {name: 'url', type: 'url'},
          ],
        }),
      ],
    }),
  ],
})
