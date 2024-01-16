/**
 * fetch_gamemaster.ts
 *
 * tldr:
 * - invoke with `bun scripts/fetch_gamemaster.ts`
 * - requires bun, since we use the file writing API
 * - (over)writes JSON to:
 *   - src/content/pokemon.json
 *   - src/content/fast-moves.json
 *   - src/content/charged-moves.json
 *
 * This script fetches the latest GameMaster file from the PVPoke Github repo,
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
    .filter((mon) => mon.released && !mon.speciesId.includes('shadow'));
  const fastMoves = z.array(FastMoveSchema).parse(gamemaster.moves);
  const chargedMoves = z.array(ChargedMoveSchema).parse(gamemaster.moves);
  return { pokemon, fastMoves, chargedMoves };
}

async function writePokemon(pokemon: Pokemon[]) {
  for (const mon of pokemon) {
    const dexnum = mon.dex.toString().padStart(4, '0');
    const filename = `${dexnum}-${mon.speciesName}.json`;
    await Bun.write(
      `src/content/pokemon/${filename}`,
      JSON.stringify(mon, null, 2),
    );
  }
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
  await writeMoves(fastMoves, 'fast-moves');
  await writeMoves(chargedMoves, 'charged-moves');
}

main();
