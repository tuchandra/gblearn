/**
 * fetch_gamemaster.ts
 *
 * tldr:
 * - invoke with `bun scripts/fetch_gamemaster.ts`
 * - writes to src/content/<dir>/*.json for dir = {pokemon, fast-moves, charged-moves}
 * Usage: `bun scripts/fetch_gamemaster.ts`
 *
 * Fetch the latest GameMaster file from the PVPoke Github repo, which itself
 * is sourced from PokeMiners with some convenient-for-PVP preprocessing.
 *
 *
 */

// fetch_gamemaster.ts
//
// Fetch the latest GameMaster file from the PVPoke Github repo,
// which (afaik) itself fetches from PokeMiners. Create or update
// new files with the data in src/content/pokemon/*.json.
//
// This can be run directly with bun!

import { z } from 'zod';
import {
  PokemonSchema,
  FastMoveSchema,
  ChargedMoveSchema,
} from '../src/models';
import type { Pokemon, Move, FastMove, ChargedMove } from '../src/models';

async function getGamemaster(): Promise<{
  pokemon: Pokemon[];
  fastMoves: FastMove[];
  chargedMoves: ChargedMove[];
}> {
  const url =
    'https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster.json';
  const gamemaster = await fetch(url).then((res) => res.json());

  const pokemon: Pokemon[] = z
    .array(PokemonSchema)
    .parse(gamemaster.pokemon)
    .filter((mon) => mon.released && !mon.speciesId.includes('shadow'));
  const fastMoves: FastMove[] = z.array(FastMoveSchema).parse(gamemaster.moves);
  const chargedMoves: ChargedMove[] = z
    .array(ChargedMoveSchema)
    .parse(gamemaster.moves);
  return { pokemon, fastMoves, chargedMoves };
}

const { pokemon, fastMoves, chargedMoves } = await getGamemaster();

for (const mon of pokemon) {
  // Write to files formatted as 0004-charmander.json
  const dexnum = mon.dex.toString().padStart(4, '0');
  const filename = `${dexnum}-${mon.speciesName}.json`;
  await Bun.write(
    `src/content/pokemon/${filename}`,
    JSON.stringify(mon, null, 2),
  );
}
console.log(`Wrote ${pokemon.length} pokemon files.`);

for (const move of fastMoves) {
  await Bun.write(
    `src/content/fast-moves/${move.moveId}.json`,
    JSON.stringify(move, null, 2),
  );
}
console.log(`Wrote ${fastMoves.length} fast move files.`);

for (const move of chargedMoves) {
  await Bun.write(
    `src/content/charged-moves/${move.moveId}.json`,
    JSON.stringify(move, null, 2),
  );
}
console.log(`Wrote ${chargedMoves.length} charged move files.`);
