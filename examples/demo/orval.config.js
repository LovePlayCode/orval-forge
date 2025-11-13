module.exports = {
  blogApi: {
    input: './swagger.json',
    output: {
      mode: 'split',
      target: './generated/api.ts',
      schemas: './generated/models',
      clean: true,
    },
  },
};