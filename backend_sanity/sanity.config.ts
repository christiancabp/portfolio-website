import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'chris-portfolio-website',
  projectId: '0bxjr1em',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Profile')
              .child(S.document().schemaType('profile').documentId('profile')),
            S.divider(),
            ...S.documentTypeListItems().filter((li) => li.getId() !== 'profile'),
          ]),
    }),
    visionTool(),
  ],
  schema: {types: schemaTypes},
})
