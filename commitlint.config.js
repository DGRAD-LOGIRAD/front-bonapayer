export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nouvelle fonctionnalité
        'fix', // Correction de bug
        'docs', // Documentation
        'style', // Formatage, point-virgules manquants, etc.
        'refactor', // Refactoring du code
        'perf', // Amélioration des performances
        'test', // Ajout ou modification de tests
        'chore', // Tâches de maintenance
        'ci', // Configuration CI/CD
        'build', // Build system
        'revert', // Annulation d'un commit
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
  },
};
