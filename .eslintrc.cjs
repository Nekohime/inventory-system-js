module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'google',
  ],
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    'vue',
    'simple-import-sort',
    'jsdoc',
  ],
  'rules': {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  "extends": [
    'plugin:jsdoc/recommended',
  ],
};
