// import type { ChargedMove, FastMove, PokemonSpecies } from './models';

import {
  IvsToKey,
  type ChargedMove,
  type FastMove,
  type IvKey,
  type Ivs,
  type Pokemon,
  type PokemonSpecies,
} from './models';
import { getMoveEffectiveness } from './pokemon-types';
import { attackStat, defenseStat, hpStat, maxLevelForLeague } from './stats';
import { entries } from './type-utils';

export function isStab(pokemon: PokemonSpecies, move: FastMove | ChargedMove) {
  return pokemon.types.includes(move.type);
}

/**
 * Given a Pokemon species and a league (CP limit), compute the max level
 * that the Pokemon can reach for every IV combination.
 *
 * todo: this might be way to slow.
 */
export function computeLevelsForIvs(
  pokemon: PokemonSpecies,
  cpLimit: 1500 | 2500,
): Record<IvKey, Pokemon> {
  const ivCombinations: Ivs[] = [...Array(16).keys()].flatMap((atk) =>
    [...Array(16).keys()].flatMap((def) =>
      [...Array(16).keys()].map((hp) => ({ hp, atk, def })),
    ),
  );

  const out = Object.fromEntries(
    ivCombinations.map((ivs) => [
      IvsToKey(ivs),
      maxLevelForLeague(pokemon, ivs, cpLimit),
    ]),
  );

  return out;
}

export function computeStatRanges(
  pokemon: PokemonSpecies,
  cpLimit: 1500 | 2500,
): Record<keyof Ivs, [string, string]> {
  const ivCombinations = computeLevelsForIvs(pokemon, cpLimit);
  const byAttack = entries(ivCombinations).sort(
    (a, b) => attackStat(a[1]) - attackStat(b[1]),
  );
  const byDefense = entries(ivCombinations).sort(
    (a, b) => defenseStat(a[1]) - defenseStat(b[1]),
  );
  const byHp = entries(ivCombinations).sort(
    (a, b) => hpStat(a[1]) - hpStat(b[1]),
  );

  return {
    atk: [
      attackStat(byAttack[0][1]).toFixed(2),
      attackStat(byAttack[byAttack.length - 1][1]).toFixed(2),
    ],
    def: [
      defenseStat(byDefense[0][1]).toFixed(2),
      defenseStat(byDefense[byDefense.length - 1][1]).toFixed(2),
    ],
    hp: [
      hpStat(byHp[0][1]).toFixed(0),
      hpStat(byHp[byHp.length - 1][1]).toFixed(0),
    ],
  };
}

export function calculateDamage(
  move: FastMove | ChargedMove,
  attacker: Pokemon,
  defender: Pokemon,
) {
  const stab = isStab(attacker.species, move) ? 1.2 : 1;
  const effectiveness = getMoveEffectiveness(move.type, defender.species.types);
  const power = move.power;

  const atk = attackStat(attacker);
  const def = defenseStat(defender);

  // todo: shadow effects

  const damage = 0.5 * 1.3 * stab * effectiveness * power * (atk / def) + 1;
  return Math.floor(damage);
}
