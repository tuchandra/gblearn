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
  PokemonSpeciesSchema,
  FastMoveSchema,
  ChargedMoveSchema,
} from '../src/models';
import type {
  PokemonSpecies,
  FastMove,
  ChargedMove,
  Move,
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

  const pokemon = z
    .array(PokemonSpeciesSchema)
    .parse(gamemaster.pokemon)
    // Fix monotype Pokemon who have a "second" type of 'none'
    .map((mon) => ({
      ...mon,
      types: mon.types.filter((t) => t !== 'none'),
    }))
    // Remove HIDDEN_POWER variants from fast moves
    .map((mon) => ({
      ...mon,
      fastMoves: removeHiddenPowerTypes(mon.fastMoves),
    }))
    // Add Return to Sableye
    .map((mon) => ({
      ...mon,
      chargedMoves: ['sableye', 'metang'].includes(mon.speciesId)
        ? [...mon.chargedMoves, 'RETURN']
        : mon.chargedMoves,
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
  const pokemonIndex = moves.reduce((acc, move) => {
    const filename = `${move.moveId}`;
    return { ...acc, [filename]: move.name };
  }, {});
  await Bun.write(
    `src/content/_${dir}.json`,
    JSON.stringify(pokemonIndex, null, 2),
  );

  console.log(`Wrote ${moves.length} files to ${dir}.`);
}

async function main() {
  const { pokemon, fastMoves, chargedMoves } = await getGamemaster();
  await writePokemon(pokemon);
  await writeMoves(fastMoves, 'fastMoves');
  await writeMoves(chargedMoves, 'chargedMoves');
}

main();
