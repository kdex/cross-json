# cross-json

## How it works

`cross-json` will compare the property keys for *every combination of two files* that gets passed in the arguments. Please note that, in order to function properly, file **A** and file **B** will need to be compared twice: On the first run, we check if each of **A**'s properties is available in **B**. The second time, we'll have to do the opposite. Only if this succeeds do **A** and **B** contain the exact same properties.

## Usage example

For instance, this can be useful to check whether your JSON-based internationalization files contain each translation key for every language.

Suppose you have the following JSON files:

### en_US.json
```json
{
	"TIME_DIFFERENCE": "{{ value }} {{ unit }} ago",
	"I18N": "internationalization"
}
```

### en_GB.json
```json
{
	"TIME_DIFFERENCE": "{{ value }} {{ unit }} ago",
	"I18N": "internationalisation"
}
```

### de_DE.json
```json
{
	"TIME_DIFFERENCE": "vor {{ value }} {{ unit }}",
	"I18N": "Internationalisierung"
}
```

### fr_FR.json
```json
{
	"TIME_DIFFERENCE": "il y a {{ value }} {{ unit }}",
	"I18N": "internationalisation",
	"MAIN_MENU": "menu principal"
}
```

We can now deduce which property keys are missing in which file using `cross-json` and easily fix our translation issue: 

```bash
$ ~/dev/awesome-project $ ./cross-json.js lang/*.json
de_DE.json is missing property "MAIN_MENU" (inferred from fr_FR.json)
en_GB.json is missing property "MAIN_MENU" (inferred from fr_FR.json)
en_US.json is missing property "MAIN_MENU" (inferred from fr_FR.json)
$ ~/dev/awesome-project $
```
## Limitations

Note that currently, the cross-comparison is only done in a shallow manner. If you need a deep check of properties, either flatten your data yourself or create a pull request to support this.
