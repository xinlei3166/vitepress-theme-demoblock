module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      tsx: true,
      jsx: true
    }
  },
  env: {
    node: true,
    browser: true
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // js
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-tabs': 2, // 禁止使用tabs
    'no-useless-escape': 0,
    'no-var': 2, // 使用let和const代替var
    'no-mixed-spaces-and-tabs': 2, // 不允许混用tab和空格
    'no-useless-return': 0,
    'arrow-parens': 0,
    'prefer-const': 2, // 优先使用const
    eqeqeq: 2, // 必须使用全等
    camelcase: 0, // 禁用驼峰命名检测
    // ts
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-var-requires': 0
  }
}
