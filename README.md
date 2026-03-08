# 🎮 Rank Bot

Un bot Discord self-bot permettant de gérer les ranks et rôles des membres, avec un Rich Presence personnalisable.

---

## 📋 Prérequis

- [Node.js](https://nodejs.org/) v16 ou supérieur
- Un compte Discord (self-bot)
- Les packages suivants :
  - [`djs-selfbot-v13`](https://github.com/aiko-chan-ai/discord.js-selfbot-v13)
  - [`discord.js`](https://discord.js.org/) v14

---

## ⚙️ Installation & Configuration

**1. Cloner le projet**
```bash
git clone https://github.com/yuniko-dsc/rank-bot.git
cd rank-bot
```

**2. Installer les dépendances**
```bash
npm install
```

**3. Configurer le fichier `config.json`**
```json
{
    "token": "TON_TOKEN_DISCORD",
    "roles": [
        {
            "name": "Perm V",
            "gs_role": "ID_DU_ROLE_REQUIS",
            "roles": [ "ID_ROLE_1", "ID_ROLE_2", "ID_ROLE_3" ]
        }
    ]
}
```

| Champ | Description |
|-------|-------------|
| `token` | Token du compte Discord |
| `roles[].name` | Nom du rank affiché dans le menu |
| `roles[].gs_role` | ID du rôle que le membre doit posséder pour accéder à ce rank |
| `roles[].roles` | Liste des IDs de rôles attribuables dans ce rank |

**4. Lancer le bot**
```bash
node index.js
```

---

## 🛠️ Commandes

### `/rank`
Gère les rôles d'un membre via un menu interactif.

| Option | Description |
|--------|-------------|
| `user` | L'utilisateur dont on veut modifier les rôles |

**Fonctionnement :**
1. Sélectionner un rank dans le menu déroulant
2. Si le membre possède le rôle requis (`gs_role`), la liste des rôles du rank s'affiche
3. Sélectionner un ou plusieurs rôles — les rôles déjà possédés seront **retirés** 🔴, les autres **ajoutés** 🟢
4. Un embed de confirmation affiche les rôles ajoutés et retirés

---

### `/setgame`
Configure le Rich Presence (RPC) du bot.

| Action | Description |
|--------|-------------|
| Menu déroulant | Choisir un jeu depuis la liste prédéfinie |
| Plateforme | Changer la plateforme affichée (desktop, ps4, ps5, xbox, samsung) |
| 🔍 Rechercher | Rechercher un jeu via SteamGridDB et récupérer son icône automatiquement |
| Activer / Désactiver | Toggle ON/OFF du setgame |

> ⚠️ Commande réservée aux utilisateurs **premium**.

---

### `/eval`
Exécute du code JavaScript directement depuis Discord via un modal.

> 🔒 Réservé exclusivement au propriétaire du bot.

- Supporte `await` nativement
- Accès à `client`, `bot`, `interaction` et `require` dans le scope
- Affiche le résultat ou l'erreur avec le temps d'exécution

---

## 👤 Crédits

Développé par **Yuniko**.