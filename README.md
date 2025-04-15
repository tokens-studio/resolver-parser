# Resolver Parser

Experimental package to parse Theme Resolver compliant JSON file (or Object).
Returns all permutations with the associated set files.

Allows you to pass a file-path to the `resolver.json` file which will read and parse it from the filesystem (or custom in-memory Volume or fs shim), or pass the Resolver object manually.

## Usage

```sh
npm install @tokens-studio/resolver-parser
```

```js
import { parser } from '@tokens-studio/resolver-parser';

const result = await parser('tokens/resolver.json');

// or alternatively, when already read and JSON parsed to a JS Object
const result = await parser(resolver);
```

Passing a custom volume, to make it usable in browser out of the box:

```js
// out of the box browser compatible fork of memfs, see memfs for docs
import { Volume } from '@bundled-es-modules/memfs';
import { parser } from '@tokens-studio/resolver-parser';

const vol = Volume.fromJSON({
  './tokens/resolver.json': '{...}', // contents here
});

// can be memfs' default volume, or a custom volume that you create
const result = await parser('tokens/resolver.json', vol);
```

## Example

Resolver:

```json
{
  "sets": [
    {
      "name": "foundation",
      "values": ["core/colors.json", "core/dimensions"]
    },
    {
      "name": "theme_light",
      "values": ["themes/light.json"]
    },
    {
      "name": "theme_dark",
      "values": ["themes/dark.json"]
    },
    {
      "name": "density_low",
      "values": ["density/low.json"]
    },
    {
      "name": "density_high",
      "values": ["density/high.json"]
    },
    {
      "name": "component",
      "values": ["components/accordion.json", "components/button.json"]
    }
  ],
  "modifiers": [
    {
      "name": "theme",
      "values": [
        {
          "name": "light",
          "values": ["theme_light"]
        },
        {
          "name": "dark",
          "values": ["theme_dark"]
        }
      ]
    },
    {
      "name": "density",
      "values": [
        {
          "name": "high",
          "values": ["density_high"]
        },
        {
          "name": "low",
          "values": ["density_low"]
        }
      ]
    },
    {
      "name": "_",
      "values": [
        {
          "name": "_",
          "values": ["foundation", "component"]
        }
      ]
    }
  ]
}
```

Which will output:

```json
[
  {
    "modifiers": { "_": "_", "density": "high", "theme": "light" },
    "sets": [
      "core/colors.json",
      "core/dimensions",
      "components/accordion.json",
      "components/button.json",
      "density/high.json",
      "themes/light.json"
    ]
  },
  {
    "modifiers": { "_": "_", "density": "low", "theme": "light" },
    "sets": [
      "core/colors.json",
      "core/dimensions",
      "components/accordion.json",
      "components/button.json",
      "density/low.json",
      "themes/light.json"
    ]
  },
  {
    "modifiers": { "_": "_", "density": "high", "theme": "dark" },
    "sets": [
      "core/colors.json",
      "core/dimensions",
      "components/accordion.json",
      "components/button.json",
      "density/high.json",
      "themes/dark.json"
    ]
  },
  {
    "modifiers": { "_": "_", "density": "low", "theme": "dark" },
    "sets": [
      "core/colors.json",
      "core/dimensions",
      "components/accordion.json",
      "components/button.json",
      "density/low.json",
      "themes/dark.json"
    ]
  }
]
```

Which means you can query the sets that are associated with a certain combination of modifiers:

```js
const permutation = permutations.find(
  perm => perm.modifiers.density === 'low' && perm.modifiers.theme === 'dark',
);
const { sets } = permutation; // pass it into Style Dictionary for example.
```
