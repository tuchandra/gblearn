import { describe, expect, test } from 'bun:test';
import {
  Effectiveness,
  getMoveEffectiveness,
  getTypeEffectiveness,
  PokemonType,
} from './pokemon-types';

describe('getTypeEffectiveness', () => {
  test.each([
    [PokemonType.normal, PokemonType.ghost, Effectiveness.immune],
    [PokemonType.normal, PokemonType.rock, Effectiveness.not_very_effective],
    [PokemonType.normal, PokemonType.steel, Effectiveness.not_very_effective],
    [PokemonType.normal, PokemonType.fighting, Effectiveness.default],
    [PokemonType.normal, PokemonType.grass, Effectiveness.default],
    [PokemonType.normal, PokemonType.electric, Effectiveness.default],
    [PokemonType.normal, PokemonType.normal, Effectiveness.default],
    [PokemonType.normal, PokemonType.fire, Effectiveness.default],
    [PokemonType.normal, PokemonType.dark, Effectiveness.default],
    [PokemonType.normal, PokemonType.bug, Effectiveness.default],
    [PokemonType.grass, PokemonType.rock, Effectiveness.super_effective],
    [PokemonType.grass, PokemonType.water, Effectiveness.super_effective],
    [PokemonType.grass, PokemonType.ground, Effectiveness.super_effective],
    [PokemonType.grass, PokemonType.flying, Effectiveness.not_very_effective],
    [PokemonType.grass, PokemonType.bug, Effectiveness.not_very_effective],
    [PokemonType.grass, PokemonType.grass, Effectiveness.not_very_effective],
    [PokemonType.fire, PokemonType.water, Effectiveness.not_very_effective],
    [PokemonType.fire, PokemonType.rock, Effectiveness.not_very_effective],
    [PokemonType.fire, PokemonType.steel, Effectiveness.super_effective],
    [PokemonType.fire, PokemonType.grass, Effectiveness.super_effective],
    [PokemonType.electric, PokemonType.bug, Effectiveness.default],
    [PokemonType.electric, PokemonType.dark, Effectiveness.default],
    [PokemonType.electric, PokemonType.ghost, Effectiveness.default],
    [PokemonType.electric, PokemonType.fighting, Effectiveness.default],
    [
      PokemonType.electric,
      PokemonType.electric,
      Effectiveness.not_very_effective,
    ],
    [PokemonType.electric, PokemonType.grass, Effectiveness.not_very_effective],
    [PokemonType.electric, PokemonType.water, Effectiveness.super_effective],
    [PokemonType.electric, PokemonType.flying, Effectiveness.super_effective],
    [PokemonType.electric, PokemonType.ground, Effectiveness.immune],
    [PokemonType.dragon, PokemonType.fairy, Effectiveness.immune],
    [PokemonType.dragon, PokemonType.dragon, Effectiveness.super_effective],
    [PokemonType.dragon, PokemonType.normal, Effectiveness.default],
    [PokemonType.dragon, PokemonType.ghost, Effectiveness.default],
  ])('%s attacks %s: %f', (attacker, defender, output) => {
    expect(getTypeEffectiveness(attacker, defender)).toEqual(output);
  });
});

describe('getMoveEffectiveness', () => {
  test.each([
    [
      PokemonType.electric,
      [PokemonType.dragon, PokemonType.ground],
      0.625 ** 3,
    ],
    [PokemonType.electric, [PokemonType.ground, PokemonType.grass], 0.625 ** 3],
    [PokemonType.water, [PokemonType.ground, PokemonType.grass], 1],
    [PokemonType.water, [PokemonType.ice, PokemonType.grass], 0.625],
    [PokemonType.dragon, [PokemonType.fairy, PokemonType.normal], 0.625 ** 2],
    [PokemonType.dragon, [PokemonType.fairy, PokemonType.ghost], 0.625 ** 2],
    [PokemonType.dark, [PokemonType.ghost, PokemonType.dark], 1],
    [PokemonType.dark, [PokemonType.ghost], 1.6],
    [PokemonType.fire, [PokemonType.grass, PokemonType.ice], 1.6 ** 2],
  ])('%s attacks %p: %f', (attacker, defender, output) => {
    expect(getMoveEffectiveness(attacker, defender)).toEqual(output);
  });
});
