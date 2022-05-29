module.exports = {
   plugins: [
      require('postcss-import-ext-glob'),
      require('postcss-import'),
      require('autoprefixer'),
      require('postcss-preset-env')({stage: 1}),
      require("tailwindcss/nesting"),
      require('tailwindcss'),
      require('cssnano')
   ]
}