# Front dev



## Utilisation

Pour installer :

```bash
npm i
```

---

Pour compiler les fichiers scss en css :

```bash
npm run css
```

:warning: Si un nouveau fichier scss est ajouté, il faut ajouter sa ligne de commande pour le compiler dans package.json. Cette commande est executée lors de l'installation du projet

---

Pour lancer uniquement le serveur web :

```bash
npm run web
```

Le serveur tente de démarrer sur le port 8000. Au démarrage il ouvre la page dans le navigateur. Le cache n'est pas activé sur le serveur

---

Pour lancer le serveur web avec compilation à la volé des fichiers scss :

```bash
npm start
```

Tout fichier scss ajouté ou modifié est compilé, si le fichier ne doit pas être compilé (exemple fichier de variable) son nom doit commencer par un `_`. Tout les fichiers scss sont compilé au lancement du serveur. Pour le reste le serveur web fonctionne de la même façon que la commande précédente.

---

Pour zipper les sources :

```bash
npm run zip
```

Créer un fichier zip nommé norauto-maintenance.zip qui contient toutes les sources.