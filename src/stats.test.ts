import { describe, expect, test } from 'bun:test';
import { Pokemon } from './models';
import {
  attackStat,
  cp,
  defenseStat,
  hpStat,
  maxLevelForLeague,
} from './stats';

describe('carbink', async () => {
  const pokemon: Pokemon = {
    species: await Bun.file('src/content/pokemon/0703-carbink.json').json(),
    shadow: false,
    ivs: { atk: 4, def: 14, hp: 15 },
    level: 50,
  };

  test('cp', async () => {
    expect(cp(pokemon)).toEqual(1490);
  });

  test('attack', async () => {
    expect(attackStat(pokemon)).toBeCloseTo(83.2, 1);
  });

  test('defense', async () => {
    expect(defenseStat(pokemon)).toBeCloseTo(251.2, 1);
  });

  test('hp', async () => {
    expect(hpStat(pokemon)).toEqual(127);
  });

  test('maxLevelForLeague - great', async () => {
    const level = maxLevelForLeague(pokemon.species, pokemon.ivs, 1500).level;
    expect(level).toEqual(50.5);
  });

  test('maxLevelForLeague - ultra', async () => {
    const level = maxLevelForLeague(pokemon.species, pokemon.ivs, 2500).level;
    expect(level).toEqual(51);
  });
});

describe('feraligatr', async () => {
  const pokemon: Pokemon = {
    species: await Bun.file('src/content/pokemon/0160-feraligatr.json').json(),
    shadow: false,
    ivs: { atk: 0, def: 11, hp: 13 },
    level: 20,
  };

  test('cp', async () => {
    expect(cp(pokemon)).toEqual(1499);
  });

  test('attack', async () => {
    expect(attackStat(pokemon)).toBeCloseTo(122.4, 0.5);
  });

  test('defense', async () => {
    expect(defenseStat(pokemon)).toBeCloseTo(118.8, 0.5);
  });

  test('hp', async () => {
    expect(hpStat(pokemon)).toEqual(126);
  });

  test('maxLevelForLeague - great', async () => {
    const level = maxLevelForLeague(pokemon.species, pokemon.ivs, 1500).level;
    expect(level).toEqual(20);
  });

  test('maxLevelForLeague - ultra', async () => {
    const level = maxLevelForLeague(pokemon.species, pokemon.ivs, 2500).level;
    expect(level).toEqual(36.5);
  });
});
