/**
 * fetchGamemaster.ts
 *
 * tldr:
 * - invoke with `bun scripts/fetch-gamemaster.ts`
 * - requires bun, since we use the file writing API
 * - (over)writes JSON to:
 *   - src/content/pokemon.json
 *   - src/content/fastMoves.json
 *   - src/content/chargedMoves.json
 *
 * This script fetches the latest data file from the PVPoke Github repo,
 * which itself is sourced from PokeMiners with some convenient-for-PVP preprocessing.
 */

import { z } from 'zod';
import { Level } from '../src/levels';
import type {
  ChargedMove,
  FastMove,
  LevelIvs,
  Move,
  PokemonSpecies,
} from '../src/models';
import {
  ChargedMoveSchema,
  FastMoveSchema,
  PokemonSpeciesSchema,
} from '../src/models';

const HIDDEN_POWER_UNKNOWN = FastMoveSchema.parse({
  moveId: 'HIDDEN_POWER',
  name: 'Hidden Power',
  type: 'unknown',
  power: 9,
  energyGain: 8,
  turns: 3,
});

/**
 * Remove all HIDDEN_POWER_ variants from a list of move names and replace with
 * one instance of HIDDEN_POWER_UNKNOWN. If the Pokemon does not know Hidden
 * Power, do nothing.
 */
function removeHiddenPowerTypes(moves: string[]): string[] {
  const movesWithoutHiddenPower = moves.filter(
    (m) => !m.includes('HIDDEN_POWER_'),
  );
  if (movesWithoutHiddenPower.length === moves.length) return moves;

  return [...movesWithoutHiddenPower, HIDDEN_POWER_UNKNOWN.moveId];
}

async function getGamemaster(): Promise<{
  pokemon: PokemonSpecies[];
  fastMoves: FastMove[];
  chargedMoves: ChargedMove[];
}> {
  const url =
    'https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster.json';
  const gamemaster = await fetch(url).then((res) => res.json());

  /**
   * Example entry from the gamemaster.json file:
   * 
    {
      "dex": 440,
      "speciesName": "Happiny",
      "speciesId": "happiny",
      "baseStats": {
          "atk": 25,
          "def": 77,
          "hp": 225
      },
      "types": ["normal", "none"],
      "fastMoves": ["POUND", "ZEN_HEADBUTT"],
      "chargedMoves": ["PSYCHIC"],
      "defaultIVs": {
          "cp500": [50, 15, 15, 15],
          "cp1500": [50, 15, 15, 15],
          "cp2500": [50, 15, 15, 15]
      },
      "buddyDistance": 5,
      "thirdMoveCost": 10000,
      "released": true,
      "family": <irrelevant>
    }
   *
   * This mostly resembles the PokemonSpeciesSchema, but we need to
   * transform the default IVs and apply some other filters.
   */

  const transformIvs = ([level, ...ivs]: number[]): LevelIvs => ({
    level: level as Level,
    ivs: {
      atk: ivs[0],
      def: ivs[1],
      hp: ivs[2],
    },
  });

  const gmPokemon = gamemaster.pokemon
    .map((mon) => ({
      ...mon,
      // Fix monotype Pokemon who have a "second" type of 'none'
      types: mon.types.filter((t) => t !== 'none'),
      // Remove HIDDEN_POWER variants from fast moves
      fastMoves: removeHiddenPowerTypes(mon.fastMoves),
      // Transform default IVs
      defaultIvs: {
        1500: transformIvs(mon.defaultIVs.cp1500),
        2500: transformIvs(mon.defaultIVs.cp2500),
      },
    }))
    .filter(
      (mon) =>
        // Ditto is banned in PVP
        mon.speciesId !== 'ditto' &&
        // We don't need 20 forms of an unreleased Pokemon, so remove
        // Arceus and Silvally
        !mon.speciesId.includes('arceus_') &&
        !mon.speciesId.includes('silvally_') &&
        // Shadows contain no new information (for our purposes)
        !mon.speciesId.includes('_shadow') &&
        // The 'duplicate' tag is just Lanturn, which is double-counted in GL with both fast moves
        !mon.tags?.includes('duplicate'),
    );
  const pokemon = PokemonSpeciesSchema.array().parse(gmPokemon);

  const fastMoves = z
    .array(FastMoveSchema)
    .parse(
      gamemaster.moves
        // Convert cooldown to turns, which is more usable
        .map((m) => ({ ...m, turns: m.cooldown / 500 })),
    )
    .concat([HIDDEN_POWER_UNKNOWN])
    .filter((m) => !m.moveId.includes('HIDDEN_POWER_'))
    .filter((m) => m.energyGain > 0 || m.moveId === 'STRUGGLE');
  const chargedMoves = z
    .array(ChargedMoveSchema)
    .parse(gamemaster.moves)
    .filter((m) => m.energy > 0);
  return { pokemon, fastMoves, chargedMoves };
}

async function writePokemon(pokemon: PokemonSpecies[]) {
  for (const mon of pokemon) {
    const dexnum = mon.dex.toString().padStart(4, '0');
    const filename = `${dexnum}-${mon.speciesId}.json`;
    await Bun.write(
      `src/content/pokemon/${filename}`,
      JSON.stringify(mon, null, 2),
    );
  }

  // Write src/content/_pokemon.json, which indexes {filename: speciesId}
  const pokemonIndex = pokemon.reduce((acc, mon) => {
    const dexnum = mon.dex.toString().padStart(4, '0');
    const filename = `${dexnum}-${mon.speciesId}`;
    return { ...acc, [filename]: mon.speciesId };
  }, {});
  await Bun.write(
    `src/content/_pokemon.json`,
    JSON.stringify(pokemonIndex, null, 2),
  );

  // EXPERIMENTAL: write a <dir>.ts file with a lookup table
  const header = '// GENERATED FILE; DO NOT EDIT\n\n';
  await Bun.write(
    `src/content/pokemon.ts`,
    `${header}export default ${JSON.stringify(pokemonIndex, null, 2)} as const;`,
  );

  console.log(`Wrote ${pokemon.length} pokemon files.`);
}

async function writeMoves(moves: Move[], dir: string) {
  for (const move of moves) {
    await Bun.write(
      `src/content/${dir}/${move.moveId}.json`,
      JSON.stringify(move, null, 2),
    );
  }

  // Write src/content/_<dir>.json, which indexes {moveId: name}
  const movesIndex = moves.reduce((acc, move) => {
    const filename = `${move.moveId}`;
    return { ...acc, [filename]: move.name };
  }, {});
  await Bun.write(
    `src/content/_${dir}.json`,
    JSON.stringify(movesIndex, null, 2),
  );

  // EXPERIMENTAL: write a <dir>.ts file with a lookup table
  const header = '// GENERATED FILE; DO NOT EDIT\n\n';
  await Bun.write(
    `src/content/${dir}.ts`,
    `${header}export default ${JSON.stringify(movesIndex, null, 2)} as const;`,
  );

  console.log(`Wrote ${moves.length} files to ${dir}.`);
}

async function main() {
  const { pokemon, fastMoves, chargedMoves } = await getGamemaster();

  await writePokemon(pokemon);
  await writeMoves(fastMoves, 'fastMoves');
  await writeMoves(chargedMoves, 'chargedMoves');

  Bun.spawn({ cmd: ['bun', 'format', 'src/content/*.ts'] });
}

main();
