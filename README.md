# AZ104 Free Practice Test

Questionnaire statique compatible GitHub Pages.

## Contenu

- `index.html` : structure de la page
- `styles.css` : design responsive
- `script.js` : chargement du questionnaire et correction
- `questions.json` : base de questions, choix, explications et liens officiels

## Personnaliser les questions

Editez `questions.json` avec ce schema :

```json
[
	{
		"question": "Votre question",
		"choices": ["Choix A", "Choix B", "Choix C", "Choix D"],
		"correctIndex": 1,
		"explanation": "Explication de la bonne reponse.",
		"docUrl": "https://learn.microsoft.com/..."
	}
]
```

## Publier sur GitHub Pages

1. Poussez ce dossier sur un repository GitHub.
2. Ouvrez Settings > Pages.
3. Dans Build and deployment, choisissez Deploy from a branch.
4. Selectionnez la branche principale (`main`) et le dossier racine (`/root`).
5. Enregistrez puis ouvrez l'URL GitHub Pages fournie.
