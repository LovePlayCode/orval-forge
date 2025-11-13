module.exports = {
  orval: {
    simple: {
      input: './swagger.json',
      output: {
        mode: 'split',
        target: './generated/api.ts',
        schemas: './generated/models',
        clean: true,
      },
    },
  },
  httpClient: {
    type: 'MyRequest',
    baseURL: 'https://api.example.com/v1',
    timeout: 5000,
  },
};