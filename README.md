# cross-json

## How it works

`cross-json` will deeply compare the property keys for *every combination of two files* that gets passed in the arguments. Please note that, in order to function properly, file **A** and file **B** will need to be compared twice: On the first run, we check if each of **A**'s properties is available in **B**. The second time, we'll have to do the opposite. Only if this succeeds do **A** and **B** contain the exact same properties.

## Usage example

For instance, this can be useful to check whether your JSON-based internationalization files contain each translation key for every language.

Suppose you have the following JSON files:

#### lang/en_US.json
```json
{
	"TIME_DIFFERENCE": "{{ value }} {{ unit }} ago",
	"I18N": "internationalization"
}
```

#### lang/en_GB.json
```json
{
	"TIME_DIFFERENCE": "{{ value }} {{ unit }} ago",
	"I18N": "internationalisation"
}
```

#### lang/de_DE.json
```json
{
	"TIME_DIFFERENCE": "vor {{ value }} {{ unit }}",
	"I18N": "Internationalisierung"
}
```

#### lang/fr_FR.json
```json
{
	"TIME_DIFFERENCE": "il y a {{ value }} {{ unit }}",
	"I18N": "internationalisation",
	"MAIN_MENU": "menu principal"
}
```

We can now deduce which property keys are missing in which file using `cross-json` and easily fix our translation issue:

<p align="center">
    <img src="https://kdex.de/pub/cross-json.png">
</p>

## API

The same can also be achieved using the `cross-json` API like so:

```js
import { crossCompare } from "cross-json";
let directory = "~/dev/awesome-project/lang/";
let files = [
	`${directory}/de_DE.json`,
	`${directory}/en_GB.json`,
	`${directory}/en_US.json`,
	`${directory}/fr_FR.json`
];
(async () => {
	await crossCompare(...files);
})();
```
## Documentation

At the moment, this project has an [inline documentation](https://github.com/kdex/cross-json/blob/master/src/cross-json.js) using YUIDoc syntax.
