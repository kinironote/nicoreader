module.exports = {
  env: {
    es2020: true,
  },
  extends: ["eslint:recommended", "react-app", "prettier"],
  rules: {
    "import/no-anonymous-default-export": "error",
    "import/no-webpack-loader-syntax": "off",
    "react/react-in-jsx-scope": "off", // React is always in scope with Blitz
  },
}
