export default {
  root: './client/src',
  build: {
    outDir: '../dist'
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
}
