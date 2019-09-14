module.exports = {
  extends: 'plugin:mocha/recommended',
  plugins: ['mocha'],
  env: {
    mocha: true
  },
  rules: {
    // https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/no-setup-in-describe.md
    // we are dynamically generating tests
    'mocha/no-setup-in-describe': 0,
    'mocha/no-mocha-arrows': 0,
    'import/no-extraneous-dependencies': [2, {'devDependencies': true}],
  },
};
