# Guide de contribution

Ce document décrit les standards et conventions à respecter lors de la contribution au projet concernant la création de branches et la rédaction de commits.

## Standards de commits

Nous utilisons la Convention des Commits Conventionnels pour maintenir un historique Git cohérent et lisible. Cette convention est validée automatiquement par commitlint.

### Format des messages de commit

```sh
<type>[scope optionnel]: <description>

[corps optionnel]

[footer(s) optionnel(s)]
```

### Types de commits

| Type | Description | Exemple |
|------|-------------|---------|
| `feat` | Nouvelle fonctionnalité | `feat: add user authentication` |
| `fix` | Correction de bug | `fix: resolve login validation error` |
| `docs` | Documentation uniquement | `docs: update API documentation` |
| `style` | Changements de formatage | `style: fix code indentation` |
| `refactor` | Refactorisation du code | `refactor: simplify user service logic` |
| `perf` | Amélioration des performances | `perf: optimize database queries` |
| `test` | Ajout/modification de tests | `test: add unit tests for user service` |
| `build` | Système de build ou dépendances | `build: update webpack configuration` |
| `ci` | Configuration CI/CD | `ci: add GitHub Actions workflow` |
| `chore` | Tâches de maintenance | `chore: update dependencies` |
| `revert` | Annulation d'un commit précédent | `revert: feat: add user authentication` |

### Règles de formatage

#### Description

- **Obligatoire** : décrit brièvement le changement
- **Longueur** : maximum 100 caractères
- **Style** : impératif présent ("add" pas "added" ou "adds")
- **Casse** : minuscule, sans point final
- **Langue** : anglais de préférence

#### Scope (Portée)

- **Optionnel** : indique la partie du code affectée
- **Format** : entre parenthèses après le type
- **Exemples** : `(api)`, `(auth)`, `(ui)`, `(database)`

#### Corps du message

- **Optionnel** : explication détaillée du changement
- **Séparation** : ligne vide entre la description et le corps
- **Format** : lignes de 72 caractères maximum

#### Footer

- **Optionnel** : références aux issues, breaking changes
- **Format** : `BREAKING CHANGE:` ou `Closes #123`

### Exemples de messages valides

```bash
# Fonctionnalité simple
feat: add password reset functionality

# Avec scope
feat(auth): implement OAuth2 integration

# Avec corps et footer
fix(api): handle null values in user profile endpoint

Previously, null values in the user profile would cause
the API to return a 500 error. This fix adds proper
validation and returns appropriate error messages.

Fixes #142
```

## Convention de branches

### Structure des noms de branches

```sh
<type>/<description-courte>
```

### Types de branches

| Type | Usage | Exemple |
|------|-------|---------|
| `feature/` | Nouvelles fonctionnalités | `feature/user-authentication` |
| `bugfix/` | Corrections de bugs | `bugfix/login-validation-error` |
| `hotfix/` | Corrections urgentes | `hotfix/security-vulnerability` |
| `refactor/` | Refactorisation | `refactor/user-service-cleanup` |
| `docs/` | Documentation | `docs/api-documentation-update` |
| `test/` | Tests | `test/unit-tests-user-service` |
| `chore/` | Maintenance | `chore/dependency-updates` |

### Règles de nommage

- **Format** : kebab-case (mots séparés par des tirets)
- **Longueur** : maximum 50 caractères
- **Descriptif** : nom explicite du changement
- **Éviter** : numéros de tickets seuls, noms génériques

### Exemples de noms de branches

**Bons exemples**

```bash
feature/oauth-integration
bugfix/memory-leak-in-parser
hotfix/critical-security-patch
refactor/database-connection-pool
docs/contributing-guidelines
test/api-endpoint-coverage
```

**Mauvais exemples**

```bash
fix
feature-123
john-dev-branch
temp
bugfix
new_feature
```

## Workflow de contribution

### 1. Création de la branche

```bash
# Partir de la branche principale
git switch main
git pull origin main

# Créer une nouvelle branche
git switch -c feature/my-new-feature
```

### 2. Développement

- Faire des commits atomiques et fréquents
- Respecter les conventions de commit
- Tester régulièrement les changements

### 3. Avant le push

```bash
# Vérifier les changements
git status
git diff

# Commit avec message conventionnel
git add .
git commit -m "feat: add user profile management"

# Push de la branche
git push origin feature/my-new-feature
```

### 4. Pull request

- Titre descriptif suivant les conventions
- Description détaillée des changements
- Liens vers les issues concernées
- Tests et documentation mis à jour

## Exemples pratiques

### Scénario 1 : nouvelle fonctionnalité

```bash
# Branche
git switch -c feature/email-notifications
git switch feature/email-notifications

# Commits
git commit -m "feat(notifications): add email service configuration"
git commit -m "feat(notifications): implement email templates"
git commit -m "feat(notifications): add user notification preferences"
git commit -m "test(notifications): add email service unit tests"
git commit -m "docs(notifications): update API documentation"
```

### Scénario 2 : correction de bug

```bash
# Branche
git switch -b bugfix/user-avatar-upload
git switch bugfix/user-avatar-upload

# Commits
git commit -m "fix(upload): handle large file size validation"
git commit -m "fix(upload): improve error messages for invalid formats"
git commit -m "test(upload): add edge case tests for file validation"
```

### Scénario 3 : hotfix critique

```bash
# Branche
git switch -c hotfix/sql-injection-vulnerability
git switch hotfix/sql-injection-vulnerability

# Commit
git commit -m "fix(security): prevent SQL injection in user queries

BREAKING CHANGE: User query parameters now require explicit
whitelisting. Update all calls to user.search() method.

Fixes #SECURITY-001"
```

### Configuration VSCode (optionnel)

Installer l'extension "Conventional Commits" pour l'autocomplétion.

## Erreurs communes à éviter

### Commits

- Messages trop vagues : `fix bug`
- Mauvais type : `update: add new feature`
- Description trop longue : `feat: this is a very long description that exceeds the recommended length`
- Langue mixte : `feat: ajouter authentication`

### Branches

- Noms génériques : `dev`, `fix`, `update`
- CamelCase : `feature/userAuthentication`
- Espaces : `feature/user authentication`
- Caractères spéciaux : `feature/user@auth`

## Ressources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)

---

**Note** : Ce guide peut être mis à jour selon les besoins du projet. N'hésitez pas à proposer des améliorations via une Pull Request.
