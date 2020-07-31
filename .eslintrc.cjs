const fs = require("fs");

const packageDir = __dirname;

module.exports = {
  rules: {
    camelcase: 0,
    "comma-dangle": [2, "only-multiline"],
    "default-case": 0,
    "import/imports-first": 0,
    "import/no-named-as-default": 0,
    "max-len": 0,
    "no-shadow": 0,
    "prettier/prettier": 2,
    "import/first": 0,
    "class-methods-use-this": 0,
    "no-restricted-syntax": 0,
    "no-useless-return": 0,
    "no-return-await": 0,
    "prefer-destructuring": 0,
    "no-plusplus": 0,
    "flowtype/no-types-missing-file-annotation": 0,
    "no-return-assign": 0,
    "no-await-in-loop": 0,
    "no-multi-assign": 0,
    "import/no-named-default": 0,
    "lines-between-class-members": 0,
    "import/no-useless-path-segments": 0,
    "import/order": 0,
    "no-use-before-define": 0,
    "import/no-self-import": 0,
    "import/no-extraneous-dependencies": [2, { packageDir }],
  },
  settings: {
    "import/resolver": "node",
    "import/ignore": ["node_modules"],
  },
  env: {
    browser: true,
    jest: true,
  },
  globals: {
    chrome: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
    sourceType: "module",
  },
  plugins: ["prettier", "import"],
};
