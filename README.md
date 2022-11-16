# Alertes Forfait

Alertes Forfait est un projet qui permet de trouver automatiquement et périodiquement les meilleures offres de forfait mobile disponibles en France selon des critères choisis. Le script a été conçu pour être déployé sous forme de fonction lambda sur AWS Lambda et s'exécute automatiquement tous les 3 jours par défaut (modifiable dans `serverless.yml`) mais il peut facilement être modifié pour être déployé ailleurs.


## Utilisation

1. Installer les dépendances:
```
npm install -g serverless
```

```
npm install
```

2. Créer un bot sur Telegram en suivant [ces instructions](https://core.telegram.org/bots#how-do-i-create-a-bot) (pour les notifications poussées).
3. Créer un fichier `.env` en suivant le modèle `.env.example` et mettez-y le token de votre bot Telegram et votre ID du chat initié avec le bot.
4. Changer les critères de recherche souhaités en suivant ce [TUTO](./HOW-TO.md).

### Déployer la fonction lambda sur AWS
Nécessite un compte AWS et de [créer un utilisateur sur IAM](https://www.youtube.com/watch?v=KngM5bfpttA)

```
# Pour Windows, remplacez 'export' par 'set'
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
serverless deploy
```

### Executer la fonction lambda en local

```
serverless invoke local --function checkOffers
```
