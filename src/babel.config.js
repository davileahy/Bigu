module.exports = {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' }}], // Compiles to the current version of Node
      '@context(babel/preset-react' // Adds JSX support
    ]
  };
  