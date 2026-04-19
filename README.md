# AZ104 Free Practice Test

Ce projet est simplement un examen de pratique pour la certification AZ-104.

Lien vers la page en ligne :
https://julienbouchardit.github.io/AZ104_free_practice_test/

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
