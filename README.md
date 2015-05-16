# cross-json

## How it works

`cross-json` will compare the property keys for *every combination of two files* that gets passed in the arguments. Please note that, in order to function properly, file **A** and file **B** will need to be compared twice: On the first run, we check if each of **A**'s properties is available in **B**. The second time, we'll have to do the opposite. Only if this succeeds do **A** and **B** contain the exact same properties.

## Usage examples

For instance, this can be useful to check whether your JSON-based internationalization files contain each translation key for every language.

```bash
$ ~/dev/awesome-project $ iojs cross-json.js lang/*.json
de_DE.json is missing property "MAIN_MENU" (inferred from fr_FR.json)
en_GB.json is missing property "MAIN_MENU" (inferred from fr_FR.json)
en_US.json is missing property "MAIN_MENU" (inferred from fr_FR.json)
$  ~/dev/awesome-project $
```
## Limitations

Note that currently, the cross-comparison is only done in a shallow manner. If your need a deep check of properties, either flatten your data yourself or create a pull request to support this.
