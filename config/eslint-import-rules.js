/**
 * ESLint Import Optimization Rules
 * 
 * Rules to enforce barrel imports and optimize import statements
 */

module.exports = {
  rules: {
    // Prefer barrel imports from @/components
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/components/ui/*', '@/components/layout/*', '@/components/typography/*'],
            message: 'Use barrel imports from @/components instead of direct component paths.',
          },
          {
            group: ['@/lib/types/*', '@/lib/utils/*', '@/lib/hooks/*'],
            message: 'Use barrel imports from @/lib instead of direct utility paths.',
          },
        ],
        paths: [
          {
            name: '@/components/ui/button',
            message: 'Import Button from @/components instead.',
          },
          {
            name: '@/components/ui/card',
            message: 'Import Card components from @/components instead.',
          },
          {
            name: '@/components/typography/Typography',
            message: 'Import typography components from @/components instead.',
          },
          {
            name: '@/components/layout/Spacing',
            message: 'Import layout components from @/components instead.',
          },
        ],
      },
    ],
    
    // Enforce import order
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            pattern: '@/components',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/lib',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/app',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    
    // Prevent unused imports
    'unused-imports/no-unused-imports': 'error',
    
    // Prefer named imports over default imports for barrel exports
    'import/prefer-default-export': 'off',
    'import/no-default-export': [
      'error',
      {
        'allow-as-default': true,
      },
    ],
  },
  
  // Configuration for specific file patterns
  overrides: [
    {
      files: ['**/index.ts', '**/index.tsx'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'off',
      },
    },
    {
      files: ['pages/**/*', 'app/**/*'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};