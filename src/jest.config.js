module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Ensure this matches all JavaScript and JSX files.
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy' // Maps CSS imports for Jest.
    },
    transformIgnorePatterns: [
      'node_modules/(?!(react-leaflet|other-module)/)' // Make sure react-leaflet is not ignored.
    ]
  };
  