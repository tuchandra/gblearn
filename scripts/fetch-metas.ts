/**
 * fetchMetas.ts
 *
 * tldr:
 * - invoke with `bun scripts/fetch-metas.ts`
 * - requires bun, since we use the file writing API
 * - (over)writes JSON to src/content/metas/<name>.json
 *
 * From the PVPoke repo, fetch the file describing the meta for a handful
 * of different cups (great, ultra, master, whatever themed cups exist).
 */

import PokemonIndex from '../src/content/_pokemon.json';
import { cupConfig } from '../src/cup-utils';
import { CupMetaSchema, CupName, type PokemonSpecies } from '../src/models';

const PVPOKE_DATA =
  'https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data';

function cupUrl(name: CupName) {
  const url = `${PVPOKE_DATA}/groups/${name}.json`;
  return url;
}
function rankingsUrl(name: CupName) {
  const cupCp = cupConfig(name).maxCp ?? 10000;

  // Rankings files are stored in different locations.
  if ([CupName.great, CupName.ultra, CupName.master].includes(name)) {
    return `${PVPOKE_DATA}/rankings/gobattleleague/overall/rankings-${cupCp}.json`;
  }

  if ([CupName.premiermaster, CupName.premierultra].includes(name)) {
    return `${PVPOKE_DATA}/rankings/premier/overall/rankings-${cupCp}.json`;
  }

  return `${PVPOKE_DATA}/rankings/${name}/overall/rankings-${cupCp}.json`;
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
 *
 * Lanturn is also special-cased; PVPoke ranks the Spark & Water Gun movesets
 * separately because they are so different.
 */
function getPokemonFromSpeciesId(speciesId: string): string {
  const pokemon = Object.keys(PokemonIndex).find(
    (key) =>
      PokemonIndex[key] ===
      speciesId.replace('_shadow', '').replace('lanturnw', 'lanturn'),
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

  const topSpecies: string[] = await fetch(rankingsUrl(cup))
    .then((res) => res.json())
    .then((species) => species.slice(0, 40));

  const meta = CupMetaSchema.parse(
    [...data, ...topSpecies]
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
