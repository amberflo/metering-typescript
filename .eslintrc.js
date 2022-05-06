module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {
        indent: ["error", 4],
        "no-trailing-spaces": "error",
        "no-multiple-empty-lines": [
            "error", {"max": 2, "maxEOF": 0, "maxBOF": 0}
        ],
        "eol-last": ["error", "always"],
    },
    overrides: [
        {
            files: ["tests/**"],
            plugins: ["jest"],
            extends: ["plugin:jest/recommended"],
            env: {
                jest: true,
            },
        },
    ],
};
