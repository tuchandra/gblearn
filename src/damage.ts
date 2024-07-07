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
  const power = move.power;

  const atk = attackStat(attacker);
  const def = defenseStat(defender);

  // todo: shadow effects

  const damage = 0.5 * 1.3 * stab * effectiveness * power * (atk / def) + 1;

  if (attacker.species.speciesId !== 'abomasnow') {
    return;
  }

  console.log('Damage calculation', {
    move: move.name,
    attacker: attacker.species.speciesName,
    stab,
    effectiveness,
    atk,
    def,
  });
  return Math.floor(damage);
}
