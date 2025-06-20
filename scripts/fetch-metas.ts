/**
 * fetchMetas.ts
 *
 * tldr:
 * - invoke with `bun scripts/fetch-metas.ts`
 * - requires bun, since we use the file writing API
 * - (over)writes JSON to src/data/metas/<name>.json
 *
 * From the PVPoke repo, fetch the file describing the meta for a handful
 * of different cups (great, ultra, master, whatever themed cups exist).
 */

import { readdir } from 'node:fs/promises';
import { cupConfig } from '../src/cup-utils';
import PokemonIndex from '../src/data/_pokemon.json';
import { CupMetaSchema, CupName, type PokemonSpecies } from '../src/models';

const PVPOKE_DATA =
  'https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data';

const FORMATS_URL = `${PVPOKE_DATA}/gamemaster/formats.json`;

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

  if ([CupName.summer, CupName.summerultra].includes(name)) {
    return `${PVPOKE_DATA}/rankings/summer/overall/rankings-${cupCp}.json`;
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
 * Why? Astro uses the file name (in `src/data/pokemon/xxx.json`) as the ID,
 * and being able to have Astro map the meta entries to the Pokemon objects is
 * convenient.
 *
 * Note that we have to remove the `_shadow` suffix, since PVPoke treats
 * shadow Pokemon as their own entries but we don't need to.
 *
 * Lanturn (previously) and Clodsire (now) are special-cased; PVPoke ranks
 * their movesets differently.
 */
function getPokemonFromSpeciesId(speciesId: string): string {
  const pokemon = Object.keys(PokemonIndex).find(
    (key) =>
      PokemonIndex[key] ===
      speciesId
        .replace('_shadow', '')
        .replace('lanturnw', 'lanturn')
        .replace('clodsiresb', 'clodsire'),
  );
  if (!pokemon) {
    throw new Error(`Unknown speciesId: ${speciesId}`);
  }
  return pokemon;
}

// todo: rename this ...
type PokemonWithBase = PokemonSpecies & { pokemon: string };

/**
 * Using the PVPoke gamemaster > formats.json, discover the active
 * cups and the cups that are stale that we need.
 *
 * The formats are a combination of the one- or two-week cups in GBL
 * and grassroots formats like Devon or Battle Frontier. They can
 * also include cups like Halloween or Premier cups that aren't active
 * in the current season, but might eventually return.
 *
 * Usually, the GBL cups are listed first; the first non-GBL cup is
 * identified by `meta: championshipseries`.
 */
async function discoverCups(): Promise<{
  gblCups: CupName[];
  staleCups: string[];
}> {
  const formats = await fetch(FORMATS_URL).then((res) => res.json());

  const gblCups: CupName[] = [];
  for (const format of formats) {
    if (format.meta === 'championshipseries') break;

    if (!format.hideRankings) {
      gblCups.push(format.meta);
    }
  }

  console.log(`Discovered GBL cups from gamemaster: ${gblCups.join(', ')}`);

  // Find stale cups.
  const staleCups: string[] = [];
  for (const cup of await readdir('src/data/metas/')) {
    const cupName = cup.replace('.json', '');

    // Always keep these.
    if (cup === 'gamemaster.json') continue;
    if (['great', 'ultra', 'master', 'remix'].includes(cupName)) continue;
    if ((gblCups as string[]).includes(cupName)) continue;

    staleCups.push(cupName);
  }

  console.log(`Found stale cups: ${staleCups.join(', ')}`);
  return { gblCups, staleCups };
}

/**
 * Download the meta for a given league/cup from PVPoke's Github,
 * find the species IDs, then write the whole thing to disk.
 */
async function getOrUpdateMeta(cup: CupName) {
  console.debug(`Looking for ${cup} ...`);

  let data: any; // unclear
  try {
    data = await fetch(cupUrl(cup)).then((res) => res.json());
  } catch (err) {
    console.error(`Skipping ${cup} due to error: ${err}`);
    return;
  }

  let topSpecies: string[];
  try {
    topSpecies = await fetch(rankingsUrl(cup))
      .then((res) => res.json())
      .then((species) => species.slice(0, 40));
  } catch (err) {
    console.error(`Error loading ${cup} rankings: ${err}`);
    topSpecies = [];
  }

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

  await Bun.write(`src/data/metas/${cup}.json`, JSON.stringify(meta, null, 2));
  console.log(`Wrote or updated src/data/metas/${cup}.json`);
  return meta;
}

async function main() {
  const { gblCups, staleCups } = await discoverCups();

  await Promise.all(
    [
      CupName.great,
      CupName.ultra,
      CupName.master,
      CupName.remix,
      ...gblCups,
    ].map(getOrUpdateMeta),
  );

  console.log(`\nCleaning up stale cups ...`);
  for (const cup of staleCups) {
    await Bun.file(`src/data/metas/${cup}.json`).delete();
    console.log(`- Deleted src/data/metas/${cup}.json`);
  }
}

main();
