import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { lexicalEditor, HTMLConverterFeature } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'

import { s3Storage } from '@payloadcms/storage-s3'

import { resendAdapter } from '@payloadcms/email-resend'

import { Users } from '@/payload/collections/Users'
import { Images } from '@/payload/collections/Images'
import { Files } from '@/payload/collections/Files'
import { Songs } from '@/payload/collections/Songs'
import { Shows } from '@/payload/collections/Shows'
import { Submissions } from '@/payload/collections/Submissions'
import { Corrections } from '@/payload/collections/Corrections'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Logo: "@/payload/components/LogoImage.jsx",
        Icon: "@/payload/components/IconImage.jsx"
      }
    },
    timezones: {
      supportedTimezones: [ { label: 'UTC', value: 'Africa/Abidjan'} ],
      defaultTimezone: 'Africa/Abidjan'
    }
  },
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // The HTMLConverter Feature is the feature which manages the HTML serializers.
      // If you do not pass any arguments to it, it will use the default serializers.
      HTMLConverterFeature({}),
    ],
  }),

  // Define and configure your collections in this array
  collections: [Users, Images, Files, Songs, Shows, Submissions, Corrections],

  globals: [],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY || '',
    defaultFromName: 'Router CMS',
    defaultFromAddress: 'cms@mail.router.is',
  }),
  plugins: [
    s3Storage({
      collections: {
        [Images.slug]: {
          generateFileURL: (file: any) => {
            return `${process.env.SPACES_CDN_URI}${file.filename}`;     // This is the sub.domain or domain you added on Digital Ocean to host your bucket     
          },
        },
        [Files.slug]: {
          generateFileURL: (file: any) => {
            return `${process.env.SPACES_CDN_URI}${file.filename}`;     // This is the sub.domain or domain you added on Digital Ocean to host your bucket     
          },
        },
      },
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.SPACES_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY || '',
        },
        region: "us-east-1",
        endpoint: "https://nyc3.digitaloceanspaces.com",
        // ... Other S3 configuration
      },
      acl: 'public-read',
      bucket: process.env.SPACES_BUCKET || "",
    }),
  ],
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
})