module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
  ],
  parser: 'vue-eslint-parser',
  overrides: [
    {
      env: { node: true },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: { sourceType: 'script' },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    indent: ['error', 2],
    semi: [2, 'always'],
    quotes: ['error', 'single'],
    'vue/multi-word-component-names': [0, { ignores: ['index'] }],
    'vue/no-deprecated-v-bind-sync': 0,
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/no-explicit-any': 0, // 是否有any
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/no-empty-interface': [2, { 'allowSingleExtends': true }], // 禁止申明空接口
    'vue/no-v-for-template-key-on-child': 0,
    'no-multiple-empty-lines': [2, { max: 1 }],
    'object-curly-spacing': [2, 'always'],
    'use-isnan': 2, //禁止比较时使用NaN，只能用isNaN()
  },
  globals: {
    uni: true,
    wx: true,
    UniApp: true,
    getApp: true,
  }
};
