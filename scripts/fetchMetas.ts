/**
 * fetchMetas.ts
 *
 * tldr:
 * - invoke with `bun scripts/fetchMetass.ts`
 * - requires bun, since we use the file writing API
 * - (over)writes JSON to:
 *   - src/ ... tbd
 *
 * From the PVPoke repo, fetch the file describing the meta for a handful
 * of different cups (great, ultra, master, whatever themed cups exist).
 */

import { CupMetaSchema, type PokemonSpecies } from '../src/models';
import PokemonIndex from '../src/content/_pokemon.json';

const GITHUB_BASE =
  'https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/groups/';

export enum CupName {
  great = 'great',
  ultra = 'ultra',
  master = 'master',
  fantasy = 'fantasy',
  hisui = 'hisui',
  evolution = 'evolution',
}

function cupUrl(cup: CupName) {
  return `${GITHUB_BASE}${cup}.json`;
}

/**
 * Map data.speciesId to the file name of the Pokemon that it references.
 * We stored an index mapping filenames to species IDs in _pokemon.json.
 *
 * e.g., `venusaur_shadow` -> `0003-venusaur`
 * e.g., `golisopod` -> `0768-golisopod`
 *
 * Why? Astro uses the file name (in `src/content/pokemon/xxx.json`) as the ID,
 * and being able to have Astro map the meta entries to the Pokemon objects is
 * convenient.
 *
 * Note that we have to remove the `_shadow` suffix, since PVPoke treats
 * shadow Pokemon as their own entries but we don't need to.
 */
function getPokemonFromSpeciesId(speciesId: string): string {
  const pokemon = Object.keys(PokemonIndex).find(
    (key) => PokemonIndex[key] === speciesId.replace('_shadow', ''),
  );
  if (!pokemon) {
    throw new Error(`Unknown speciesId: ${speciesId}`);
  }
  return pokemon;
}

// todo: rename this ...
type PokemonWithBase = PokemonSpecies & { pokemon: string };

/**
 * Download the meta for a given league/cup from PVPoke's Github,
 * find the species IDs, then write the whole thing to disk.
 */
async function getOrUpdateMeta(cup: CupName) {
  const data = await fetch(cupUrl(cup)).then((res) => res.json());

  const meta = CupMetaSchema.parse(
    data
      .map((mon) => ({
        ...mon,
        pokemon: getPokemonFromSpeciesId(mon.speciesId),
      }))
      // Deduplicate based on the base name / slug; different movesets
      // and normal/shadow both count to the same Pokemon.
      .filter(
        (entry: PokemonWithBase, index: number, self: PokemonWithBase[]) =>
          self.map((x) => x.pokemon).indexOf(entry.pokemon) === index,
      ),
  );

  await Bun.write(
    `src/content/metas/${cup}.json`,
    JSON.stringify(meta, null, 2),
  );
  console.log(`Wrote or updated src/content/metas/${cup}.json`);
  return meta;
}

async function main() {
  Promise.all(Object.values(CupName).map(getOrUpdateMeta));
}

main();
