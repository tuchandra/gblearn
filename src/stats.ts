import {
  CP_MULTIPLIERS,
  CP_MULTIPLIERS_BY_LEVEL,
  Level,
  MAX_CPM,
} from './levels';
import { Ivs, Pokemon, PokemonSpecies } from './models';

export function cp(pokemon: Pokemon): number {
  const level = pokemon.level;
  const attack = pokemon.species.baseStats.atk + pokemon.ivs.atk;
  const defense = pokemon.species.baseStats.def + pokemon.ivs.def;
  const hp = pokemon.species.baseStats.hp + pokemon.ivs.hp;

  const raw =
    0.1 *
    CP_MULTIPLIERS_BY_LEVEL[level] ** 2 *
    attack *
    Math.sqrt(defense * hp);
  return Math.floor(raw);
}

export function cpMultiplier(pokemon: Pokemon): number {
  return CP_MULTIPLIERS_BY_LEVEL[pokemon.level];
}

export function attackStat(pokemon: Pokemon): number {
  return (
    (pokemon.species.baseStats.atk + pokemon.ivs.atk) * cpMultiplier(pokemon)
  );
}

export function effectiveAttackStat(pokemon: Pokemon): number {
  return attackStat(pokemon) * (pokemon.shadow ? 1.2 : 1);
}

export function defenseStat(pokemon: Pokemon): number {
  return (
    (pokemon.species.baseStats.def + pokemon.ivs.def) * cpMultiplier(pokemon)
  );
}

export function effectiveDefenseStat(pokemon: Pokemon): number {
  return defenseStat(pokemon) / (pokemon.shadow ? 1.2 : 1);
}

export function hpStat(pokemon: Pokemon): number {
  const raw =
    (pokemon.species.baseStats.hp + pokemon.ivs.hp) * cpMultiplier(pokemon);
  return Math.floor(raw);
}

export function maxLevelForLeague(
  species: PokemonSpecies,
  ivs: Ivs,
  cpLimit: 1500 | 2500,
): Pokemon {
  const shadow = false; // doesn't affect IVs, CP, or level

  const atk = species.baseStats.atk + ivs.atk;
  const def = species.baseStats.def + ivs.def;
  const hp = species.baseStats.hp + ivs.hp;
  const statProduct = Math.sqrt(atk * atk * def * hp);

  const cpmSquared = (10 * cpLimit) / statProduct;
  const cpm_limit = Math.sqrt(cpmSquared);

  // edge case: check for level 51
  if (cpm_limit > MAX_CPM) {
    return { species, shadow, ivs, level: 51 };
  }

  // otherwise, find first entry in CP_MULTIPLIERS that _passes_ our target CP multiplier
  const level = CP_MULTIPLIERS.find(([_level, cpm]) => cpm >= cpm_limit)?.[0];

  if (level == null) {
    throw new Error('Could not find level for given IVs and CP limit');
  }

  // Another edge case: the found CP multiplier (which is larger than our max)
  // could still be within the CP threshold, just because of the floor in the CP calculation.
  // Check if this happens (it's rare) - but otherwise decrement the found level by 0.5
  // to get the level that's WITHIN the CP limit.
  const computedCp = 0.1 * CP_MULTIPLIERS_BY_LEVEL[level] ** 2 * statProduct;
  if (Math.floor(computedCp) > cpLimit) {
    return { species, shadow, ivs, level: (level - 0.5) as Level };
  }

  return { species, shadow, ivs, level };
}
