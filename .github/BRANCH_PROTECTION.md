# Configuration des Protections de Branche GitHub

## Instructions pour configurer les protections de branche

### 1. Aller dans les paramètres du repository

- Repository → Settings → Branches

### 2. Ajouter une règle pour la branche `main`

#### Paramètres à activer :

- ✅ **Require a pull request before merging**
  - ✅ Require approvals: 1
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Status checks à sélectionner :
    - `lint-and-format`
    - `security`

- ✅ **Require conversation resolution before merging**

- ✅ **Require signed commits**

- ✅ **Require linear history**

- ✅ **Restrict pushes that create files**
  - Taille maximale : 100 MB

- ✅ **Restrict pushes that create files over 100 MB**

#### Restrictions de push :

- ✅ **Restrict pushes to matching branches**
  - Exclure les administrateurs : ❌ (décocher pour empêcher même les admins)

### 3. Ajouter une règle pour la branche `develop` (optionnel)

- ✅ **Require a pull request before merging**
- ✅ **Require status checks to pass before merging**
- ✅ **Require conversation resolution before merging**

### 4. Configuration des administrateurs

Pour permettre aux administrateurs de pusher directement vers `main` en cas d'urgence :

1. Aller dans Settings → Manage access
2. Ajouter les utilisateurs administrateurs
3. Leur donner les permissions "Admin" ou "Maintain"

### 5. Configuration des Code Owners

Créer un fichier `.github/CODEOWNERS` :

```
# Code owners
* @username1 @username2

# Spécifique aux fichiers de configuration
/.github/ @username1
/package.json @username1
/eslint.config.js @username1
/.prettierrc @username1
```

## Vérification de la Configuration

Après configuration, testez que :

1. ❌ Un push direct vers `main` est bloqué
2. ❌ Un push force est bloqué
3. ✅ Une Pull Request peut être créée
4. ✅ Les tests CI passent avant le merge
5. ✅ Une approbation est requise pour merger

## Commandes de Test

```bash
# Tester le push direct (doit échouer)
git push origin main

# Tester le push force (doit échouer)
git push --force origin main

# Tester le format de commit (doit échouer)
git commit -m "bad commit message"

# Tester le formatage (doit passer)
pnpm format
git add .
git commit -m "feat: add new feature"
```
