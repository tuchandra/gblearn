// import type { ChargedMove, FastMove, PokemonSpecies } from './models';

import type { ChargedMove, FastMove, Pokemon, PokemonSpecies } from './models';
import { getMoveEffectiveness } from './pokemon-types';
import { attackStat, defenseStat } from './stats';

export function isStab(pokemon: PokemonSpecies, move: FastMove | ChargedMove) {
  return pokemon.types.includes(move.type);
}

export function calculateDamage(
  move: FastMove | ChargedMove,
  attacker: Pokemon,
  defender: Pokemon,
) {
  const stab = isStab(attacker.species, move) ? 1.2 : 1;
  const effectiveness = getMoveEffectiveness(move.type, attacker.species.types);
  const modifier = stab * effectiveness;

  const power = move.power;

  const atk = attackStat(attacker);
  const def = defenseStat(defender);

  const damage = Math.floor(
    (0.5 * power * (atk / def) * modifier + 1) * (Math.random() * 0.15 + 0.85),
  );

  return damage;
}
