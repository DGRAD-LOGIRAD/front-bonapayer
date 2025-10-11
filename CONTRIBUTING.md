# Guide de Contribution

## Architecture du Projet

### 📁 Structure des Dossiers

```
src/
├── components/
│   ├── forms/          # Formulaires (login, forgot-password, etc.)
│   ├── shared/         # Composants partagés entre les pages
│   └── ui/             # Composants Shadcn/UI (button, input, card, etc.)
├── layout/             # Layouts (auth-layout, private-route, etc.)
├── pages/              # Pages de l'application
│   ├── auth/           # Pages d'authentification
│   ├── dashboard/      # Pages du tableau de bord
│   └── [feature]/      # Autres fonctionnalités avec sous-dossiers
├── stores/             # Gestion d'état (Zustand, Redux, etc.)
├── providers/          # Providers React (Query, Theme, etc.)
├── lib/                # Utilitaires et configurations
└── assets/             # Images, icônes, etc.
```

### 🎯 Conventions de Nommage

#### Pages

- **Structure** : `src/pages/[feature]/[page-name].tsx`
- **Exemples** :
  - `src/pages/auth/login.tsx`
  - `src/pages/dashboard/profile.tsx`
  - `src/pages/bons-a-payer/list.tsx`
  - `src/pages/bons-a-payer/create.tsx`

#### Composants

- **Shared** : `src/components/shared/[ComponentName].tsx`
- **Forms** : `src/components/forms/[form-name].tsx`
- **UI** : `src/components/ui/[component-name].tsx`

#### Stores

- **Structure** : `src/stores/use[StoreName]Store.ts`
- **Exemples** :
  - `src/stores/useAuthStore.ts`
  - `src/stores/useBonsStore.ts`
  - `src/stores/useAppStore.ts`

### 📋 Règles de Développement

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

**Gestionnaire de paquets :** Yarn

```bash
# Développement
yarn dev

# Build
yarn build

# Linting
yarn lint          # Vérifier le code
yarn lint:fix      # Corriger automatiquement les erreurs de lint

# Formatage
yarn format        # Formater tout le code
yarn format:check  # Vérifier le formatage

# Commit interactif
yarn commit        # Utiliser commitizen pour des commits conventionnels
```

### 🚀 Workflow de Développement

1. **Créer une branche** depuis `main` ou `develop`
2. **Développer** votre fonctionnalité en respectant l'architecture
3. **Tester** localement avec `yarn dev`
4. **Formater** le code avec `yarn format`
5. **Vérifier** le linting avec `yarn lint`
6. **Commiter** avec un message conventionnel
7. **Pusher** vers votre branche
8. **Créer une Pull Request** vers `main` ou `develop`

### 🏗️ Bonnes Pratiques

#### Création de Pages

- **Toujours** créer un sous-dossier pour les fonctionnalités
- **Exemple** : Pour "bons à payer" → `src/pages/bons-a-payer/`
- **Pages liées** : `list.tsx`, `create.tsx`, `edit.tsx`, `details.tsx`

#### Gestion des Stores

- **Un store par domaine** : `useAuthStore`, `useBonsStore`
- **Actions claires** : `login`, `logout`, `createBon`, `updateBon`
- **Types TypeScript** : Toujours typer les états et actions

#### Composants

- **Shared** : Composants réutilisables dans toute l'app
- **Forms** : Uniquement les formulaires
- **UI** : Composants Shadcn/UI uniquement

#### Installation de Composants Shadcn/UI

```bash
# Installer un nouveau composant
yarn dlx shadcn@latest add [component-name]

# Exemples
yarn dlx shadcn@latest add button
yarn dlx shadcn@latest add input
yarn dlx shadcn@latest add card
yarn dlx shadcn@latest add dialog
yarn dlx shadcn@latest add table

# Lister les composants disponibles
yarn dlx shadcn@latest add
```

#### Imports

```typescript
// ✅ Bon
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/forms/login';
import { Header } from '@/components/shared/header';

// ❌ Éviter
import { Button } from '../../components/ui/button';
```

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
2. Réinstallez les dépendances : `yarn install`
3. Formatez manuellement : `yarn format`
4. Vérifiez le linting : `yarn lint:fix`
