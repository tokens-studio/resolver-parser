import type { Resolver, Volume } from './types.js';

// cartesian permutations: [[1,2], [3,4]] -> [[1,3], [1,4], [2,3], [2,4]]
function cartesian(a: Array<unknown[]>) {
  return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
}

function createOutputs(resolver: Resolver) {
  let count = 0;
  // index resolver props with Map so they're easier to access & iterate
  // since set name prop is optional, fallback -> using a numbered index for unnamed sets
  const setsMap = new Map(resolver.sets.map(set => [set.name ?? count++, set.values]));
  const modifiersMap = new Map(
    resolver.modifiers.map(mod => [
      mod.name,
      new Map(mod.values.map(val => [val.name, val.values])),
    ]),
  );

  const cartesianInput = [...modifiersMap.entries()].reduce(
    (acc, curr) => {
      const items = [...curr[1].keys()].map(modKey => ({
        [curr[0]]: modKey,
      }));

      return [...acc, [...items]];
    },
    [] as Record<string, string>[][],
  );
  const cartesianOutput = cartesian(cartesianInput) as Record<string, string>[][];
  const permutations = cartesianOutput.map(perm =>
    perm.reduce((acc, curr) => ({ ...curr, ...acc }), {} as Record<string, string>),
  );

  const permutationsData = permutations.map(perm => {
    return {
      modifiers: perm,
      // Grab the sets from the modifiers, dedupe where needed
      sets: [
        ...new Set(
          Object.entries(perm)
            .flatMap(([modKey, modValue]) => {
              return modifiersMap.get(modKey)!.get(modValue)!;
            })
            // check if there is a set collection with that key, otherwise use as set itself
            .flatMap(set => setsMap.get(set) ?? set),
        ),
      ],
    };
  });
  return permutationsData;
}

export async function parser(resolverPathOrData: string | Resolver, fs?: Volume) {
  let resolver: Resolver;
  if (typeof resolverPathOrData === 'string') {
    // Support browser env by using path-unified and allowing to pass an in-memory FS shim like memfs
    if (!fs) {
      fs = await import('node:fs');
    }
    const contents = (await fs.promises.readFile(resolverPathOrData, 'utf-8')) as string;
    resolver = JSON.parse(contents);
  } else {
    resolver = resolverPathOrData;
  }

  const outputs = createOutputs(resolver);
  return outputs;
}
