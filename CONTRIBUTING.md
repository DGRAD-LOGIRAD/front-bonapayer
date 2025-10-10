# Guide de Contribution

## Règles de Développement

### 🚫 Restrictions de Push

- **Aucun push direct vers `main`** : Tous les changements doivent passer par une Pull Request
- **Aucun push force** : Les push force sont interdits sur toutes les branches
- **Seuls les administrateurs** peuvent pusher directement vers `main` (en cas d'urgence uniquement)

### 📝 Format des Messages de Commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/). Format requis :

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Types autorisés :

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, point-virgules manquants, etc.
- `refactor`: Refactoring du code
- `perf`: Amélioration des performances
- `test`: Ajout ou modification de tests
- `chore`: Tâches de maintenance
- `ci`: Configuration CI/CD
- `build`: Build system
- `revert`: Annulation d'un commit

#### Exemples :

```bash
feat(auth): add user login functionality
fix(ui): resolve button alignment issue
docs: update API documentation
chore(deps): update dependencies
```

### 🎨 Formatage du Code

- **Prettier** est configuré pour formater automatiquement le code
- **ESLint** vérifie la qualité du code
- Le formatage et le linting sont exécutés automatiquement avant chaque commit

### 🔧 Scripts Disponibles

```bash
# Développement
pnpm dev

# Build
pnpm build

# Linting
pnpm lint          # Vérifier le code
pnpm lint:fix      # Corriger automatiquement les erreurs de lint

# Formatage
pnpm format        # Formater tout le code
pnpm format:check  # Vérifier le formatage

# Commit interactif
pnpm commit        # Utiliser commitizen pour des commits conventionnels
```

### 🚀 Workflow de Développement

1. **Créer une branche** depuis `main` ou `develop`
2. **Développer** votre fonctionnalité
3. **Tester** localement avec `pnpm dev`
4. **Formater** le code avec `pnpm format`
5. **Vérifier** le linting avec `pnpm lint`
6. **Commiter** avec un message conventionnel
7. **Pusher** vers votre branche
8. **Créer une Pull Request** vers `main` ou `develop`

### ⚠️ Hooks Git

Les hooks suivants sont configurés automatiquement :

- **pre-commit** : Formate et linte le code avant le commit
- **commit-msg** : Vérifie le format du message de commit
- **pre-push** : Empêche les push force et les push directs vers `main`

### 🛡️ Protection des Branches

- La branche `main` est protégée contre les push directs
- Tous les changements doivent passer par une Pull Request
- Les tests CI doivent passer avant le merge
- Au moins une approbation est requise pour merger vers `main`

### 🆘 En cas de Problème

Si vous rencontrez des problèmes avec les hooks ou le formatage :

1. Vérifiez que tous les hooks sont exécutables : `chmod +x .husky/*`
2. Réinstallez les dépendances : `pnpm install`
3. Formatez manuellement : `pnpm format`
4. Vérifiez le linting : `pnpm lint:fix`
