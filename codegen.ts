
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ["http://localhost:3000/shop-api",
    'type Mutation { createStripePaymentIntent: String }',
    'type Query { generateBraintreeClientToken: String }'
  ],
  documents: ["lib/vendure/providers/**/*.{ts,tsx}", "!lib/vendure/generated"],
  generates: {
    "lib/vendure/generated/graphql.ts": {
      plugins: ['typescript', 'typescript-operations', 'typescript-generic-sdk'],
      config: {
        enumsAsConst: true,
        scalars: {
          // This tells codegen that the `Money` scalar is a number
          Money: 'number',
        }
      }
    },
    "lib/vendure/generated/schema.graphql": {
      plugins: ['schema-ast']
    }
  }
};

export default config;
