import { CP_MULTIPLIERS, Level, MAX_CPM } from './levels';
import { Pokemon, PokemonSpecies } from './models';
import { entries } from './type-utils';

export function cp(pokemon: Pokemon): number {
  const level = pokemon.level;
  const attack = pokemon.species.baseStats.atk + pokemon.ivs.atk;
  const defense = pokemon.species.baseStats.def + pokemon.ivs.def;
  const hp = pokemon.species.baseStats.hp + pokemon.ivs.hp;

  return 0.1 * CP_MULTIPLIERS[level] ** 2 * attack * Math.sqrt(defense * hp);
}

export function cpMultiplier(pokemon: Pokemon): number {
  return CP_MULTIPLIERS[pokemon.level];
}

export function attackStat(pokemon: Pokemon): number {
  return (
    (pokemon.species.baseStats.atk + pokemon.ivs.atk) * cpMultiplier(pokemon)
  );
}

export function defenseStat(pokemon: Pokemon): number {
  return (
    (pokemon.species.baseStats.def + pokemon.ivs.def) * cpMultiplier(pokemon)
  );
}

export function hpStat(pokemon: Pokemon): number {
  return (
    (pokemon.species.baseStats.hp + pokemon.ivs.hp) * cpMultiplier(pokemon)
  );
}

export function maxLevelForLeague(
  species: PokemonSpecies,
  ivs: [number, number, number],
  cpLimit: 1500 | 2500,
): Level {
  const atk = species.baseStats.atk + ivs[0];
  const def = species.baseStats.def + ivs[1];
  const hp = species.baseStats.hp + ivs[2];
  const statProduct = Math.sqrt(atk * atk * def * hp);

  const cpmSquared = (10 * cpLimit) / statProduct;
  const cpm_limit = Math.sqrt(cpmSquared);

  // edge case: check for level 51
  if (cpm_limit > MAX_CPM) {
    return 51;
  }

  // otherwise, find first entry in CP_MULTIPLIERS that _passes_ our target CP multiplier
  const level = entries(CP_MULTIPLIERS).find(
    ([_level, cpm]) => cpm >= cpm_limit,
  )?.[0];

  if (level == null) {
    throw new Error('Could not find level for given IVs and CP limit');
  }

  // Another edge case: the found CP multiplier (which is larger than our max)
  // could still be within the CP threshold, just because of the floor in the CP calculation.
  // Check if this happens (it's rare) - but otherwise decrement the found level by 0.5
  // to get the level that's WITHIN the CP limit.
  const computedCp = 0.1 * CP_MULTIPLIERS[level] ** 2 * statProduct;
  if (Math.floor(computedCp) > cpLimit) {
    return (level - 0.5) as Level;
  }

  return level;
}
