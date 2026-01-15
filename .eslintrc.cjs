module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'node_modules',
    'mobile-app/node_modules',
    'api/**/*.js',
    '*.config.js',
    'setup-*.js',
    'create-admin.js',
    'initialize-firebase-db.js',
    'migrate-to-postgresql.js',
    'deploy-firestore-rules.js',
    'prisma/**/*.js',
    'public/**/*.js'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    react: {
      version: '18.2'
    }
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'no-unused-vars': ['warn', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'warn',
    'no-unreachable': 'warn'
  }
}