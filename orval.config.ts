import { defineConfig } from 'orval'
import { config } from 'dotenv'

config()

const backend = process.env.VITE_API_URL ?? 'http://localhost:3000'

export default defineConfig({
  api: {
    input: `${backend}/docs/json`, // OpenAPI spec do backend (@fastify/swagger)
    output: {
      baseUrl: backend,
      clean: true,
      target: './src/http/generated/api.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      override: {
        mutator: {
          path: 'src/lib/api.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
