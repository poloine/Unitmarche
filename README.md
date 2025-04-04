# Unitmarché

Unitmarché est un projet utilisant **Vite.js** et **JavaScript**, avec une configuration prête pour les tests unitaires et d'intégration à l'aide de **Jest** et **Cypress**.

## 🚀 Installation

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

```sh
# Clonez le dépôt
git clone https://github.com/poloine/unitmarche.git
cd unitmarche

# Installez les dépendances
npm install
```

## 🏗️ Développement

Pour lancer le serveur de développement avec Vite :

```sh
npm run dev
```

Accédez à l'application via `http://localhost:5173/`.

## ✅ Tests

### Tests unitaires avec Jest

```sh
npm run test
```

Les fichiers de test doivent être nommés `*.test.js` ou `*.spec.js` et se trouver dans le même dossier que les fichiers testés ou dans un dossier `__tests__`.

### Tests d'intégration avec Cypress

Lancez Cypress en mode interface graphique :

```sh
npm run cy:open
```

Ou exécutez les tests en mode headless :

```sh
npm run cy:run
```

## 📂 Structure du projet

```
unitmarche/
├── public/
│   └── liste_produits_quotidien.json
├── index.html               ← page des produits disponibles
├── liste.html               ← page de la liste de course
├── src/
│   ├── main.js              ← script pour index.html
│   ├── liste.js             ← script pour liste.html
│   └── common.js            ← script pour fonctions partagées
├── package.json
└── babel.config.js          ← script pour configurer babel (qui va servir à utilsier les import/export pour Jest)
```

## 📜 Licence

Ce projet n'est sous aucune licence.

---

🎯 **Unitmarché** : Simplifiez vos tests avec Jest et Cypress ! 🚀

