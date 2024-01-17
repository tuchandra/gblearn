/**
 * fetchGamemaster.ts
 *
 * tldr:
 * - invoke with `bun scripts/fetchGamemaster.ts`
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
import {
  PokemonSchema,
  FastMoveSchema,
  ChargedMoveSchema,
} from '../src/models';
import type { Pokemon, FastMove, ChargedMove, Move } from '../src/models';

async function getGamemaster(): Promise<{
  pokemon: Pokemon[];
  fastMoves: FastMove[];
  chargedMoves: ChargedMove[];
}> {
  const url =
    'https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster.json';
  const gamemaster = await fetch(url).then((res) => res.json());

  const pokemon = z
    .array(PokemonSchema)
    .parse(gamemaster.pokemon)
    .map((mon) => ({
      ...mon,
      types: mon.types.filter((t) => t !== 'none'),
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
  const fastMoves = z
    .array(FastMoveSchema)
    .parse(gamemaster.moves)
    .map((m) => ({ ...m, turns: m.cooldown / 500 }))
    .filter((m) => m.energyGain > 0 || m.moveId == 'STRUGGLE');
  const chargedMoves = z
    .array(ChargedMoveSchema)
    .parse(gamemaster.moves)
    .filter((m) => m.energy > 0);
  return { pokemon, fastMoves, chargedMoves };
}

async function writePokemon(pokemon: Pokemon[]) {
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

  console.log(`Wrote ${pokemon.length} pokemon files.`);
}

async function writeMoves(moves: Move[], dir: string) {
  for (const move of moves) {
    await Bun.write(
      `src/content/${dir}/${move.moveId}.json`,
      JSON.stringify(move, null, 2),
    );
  }
  console.log(`Wrote ${moves.length} files to ${dir}.`);
}

async function main() {
  const { pokemon, fastMoves, chargedMoves } = await getGamemaster();
  await writePokemon(pokemon);
  await writeMoves(fastMoves, 'fastMoves');
  await writeMoves(chargedMoves, 'chargedMoves');
}

main();
