import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['.husky/', 'dist/']
  },
  {
    files: ['src/**/*.{ts,mts}'],
    languageOptions: {
      // ecmaVersion: 'latest', default: "latest"
      globals: globals.browser
    }
  },
  {
    files: ['__tests__/*.ts'],
    languageOptions: {
      globals: globals.jest
    }
  },
  {
    files: ['*.{js,cjs}'],
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
      // 'vue/multi-word-component-names': 'off',
      'no-prototype-builtins': 'off',
      'no-debugger': 'off',
      // 'no-unused-vars': [
      //   'error',
      //   {
      //     // vars: 'all',
      //     // args: 'after-used',
      //     caughtErrors: 'none'
      //     // ignoreRestSiblings: false,
      //     // reportUsedIgnorePattern: false
      //   }
      // ],
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  }
);
