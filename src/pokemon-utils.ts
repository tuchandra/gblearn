import { getEntry } from 'astro:content';
import PokemonIndex from './content/pokemon.ts';
import {
  ChargedMoveSchema,
  PokemonSpecies,
  SpeciesId,
  ZPokemonId,
  type ChargedMove,
  type ChargedMoveId,
  type FastMove,
  type FastMoveId,
  type SpeciesSlug,
} from './models';
import { entries } from './type-utils.ts';

export async function getFastMove(name: FastMoveId): Promise<FastMove> {
  const move = await getEntry('fastMoves', name);
  return move.data;
}

export async function getChargedMove(
  name: ChargedMoveId,
): Promise<ChargedMove> {
  const move = await getEntry('chargedMoves', name);
  return move.data;
}

export async function getPokemonIdByName(name: string): Promise<SpeciesSlug> {
  const speciesId = entries(PokemonIndex).find(
    (idNamePair) => idNamePair[1] === name,
  )?.[0];

  // safeParse would avoid an error if needed
  return ZPokemonId.parse(speciesId);
}

export const RETURN = ChargedMoveSchema.parse({
  moveId: 'RETURN',
  name: 'Return',
  type: 'normal',
  power: 130,
  energy: 70,
});

type KeepOrRemove<T> =
  | {
      keep?: T[];
      remove?: never;
    }
  | {
      keep?: never;
      remove?: T[];
    };

export interface MovesetChanges {
  fast?: KeepOrRemove<FastMoveId>;
  charged?: KeepOrRemove<ChargedMoveId>;
}

// Please keep alphabetized!
const MOVESET_OVERRIDES: Partial<Record<SpeciesId, MovesetChanges>> = {
  abomasnow: { charged: { remove: ['BLIZZARD'] } },
  altaria: { charged: { remove: ['DRAGON_PULSE', 'DAZZLING_GLEAM'] } },
  ampharos: { fast: { remove: ['CHARGE_BEAM'] } },
  arctibax: {
    fast: { remove: ['ICE_FANG'] },
    charged: { remove: ['OUTRAGE'] },
  },
  carbink: { charged: { remove: ['POWER_GEM'] } },
  charizard: {
    fast: { remove: ['EMBER', 'AIR_SLASH'] },
    charged: { remove: ['FLAMETHROWER', 'OVERHEAT', 'FIRE_BLAST'] },
  },
  charjabug: { fast: { remove: ['SPARK'] } },
  clefable: { charged: { remove: ['DAZZLING_GLEAM'] } },
  clodsire: { charged: { remove: ['WATER_PULSE'] } },
  cobalion: { fast: { keep: ['DOUBLE_KICK'] } },
  cradily: {
    fast: { remove: ['INFESTATION'] },
    charged: { remove: ['STONE_EDGE'] },
  },
  crocalor: { fast: { remove: ['BITE'] } },
  dewgong: { charged: { remove: ['AURORA_BEAM', 'AQUA_JET', 'BLIZZARD'] } },
  dialga: { fast: { keep: ['DRAGON_BREATH'] } },
  dragonair: { charged: { remove: ['WRAP'] } },
  dragonite: {
    charged: { remove: ['DRAGON_PULSE', 'HYPER_BEAM', 'DRACO_METEOR'] },
    fast: { remove: ['STEEL_WING'] },
  },
  drapion: { fast: { remove: ['ICE_FANG', 'INFESTATION'] } },
  drifblim: { charged: { remove: ['OMINOUS_WIND'] } },
  empoleon: {
    fast: { remove: ['METAL_CLAW', 'WATERFALL'] },
    charged: { remove: ['HYDRO_PUMP'] },
  },
  escavalier: { fast: { remove: ['BUG_BITE'] } },
  excadrill: {
    fast: { remove: ['METAL_CLAW'] },
    charged: { remove: ['EARTHQUAKE'] },
  },
  ferrothorn: { fast: { remove: ['METAL_CLAW'] } },
  flygon: { charged: { remove: ['EARTH_POWER', 'BOOMBURST'] } },
  gallade: { charged: { remove: ['SYNCHRONOISE'] } },
  garchomp: { charged: { remove: ['EARTHQUAKE'] } },
  gastrodon: { fast: { remove: ['HIDDEN_POWER'] } },
  gligar: { fast: { remove: ['FURY_CUTTER'] } },
  golisopod: {
    fast: { remove: ['FURY_CUTTER', 'METAL_CLAW'] },
    charged: { remove: ['AQUA_JET'] },
  },
  goodra: {
    fast: { remove: ['WATER_GUN'] },
    charged: { remove: ['MUDDY_WATER'] },
  },
  granbull: { fast: { remove: ['BITE'] } },
  greedent: { fast: { remove: ['BITE'] } },
  greninja: { charged: { keep: ['NIGHT_SLASH', 'HYDRO_CANNON'] } },
  groudon: { charged: { remove: ['FIRE_BLAST'] } },
  gyarados: {
    fast: { remove: ['BITE'] },
    charged: { remove: ['TWISTER', 'DRAGON_PULSE'] },
  },
  haunter: { fast: { remove: ['LICK'] }, charged: { remove: ['DARK_PULSE'] } },
  haxorus: { charged: { remove: ['DRAGON_CLAW'] } },
  ho_oh: {
    fast: { keep: ['INCINERATE'] },
    charged: { remove: ['FIRE_BLAST'] },
  },
  ivysaur: { charged: { remove: ['SOLAR_BEAM'] } },
  kartana: { fast: { remove: ['AIR_SLASH'] } },
  kyogre: { charged: { remove: ['HYDRO_PUMP'] } },
  landorus_therian: {
    fast: { remove: ['EXTRASENSORY'] },
    charged: { remove: ['BULLDOZE'] },
  },
  lickitung: { charged: { remove: ['STOMP', 'HYPER_BEAM'] } },
  lucario: {
    fast: { remove: ['BULLET_PUNCH'] },
    charged: { remove: ['CLOSE_COMBAT'] },
  },
  lugia: {
    fast: { remove: ['EXTRASENSORY'] },
    charged: { remove: ['FUTURE_SIGHT'] },
  },
  magneton: { fast: { remove: ['SPARK'] } },
  magnezone: { fast: { remove: ['SPARK'] } },
  mamoswine: { charged: { remove: ['ANCIENT_POWER'] } },
  marshtomp: { fast: { remove: ['WATER_GUN'] } },
  mawile: {
    fast: { remove: ['BITE', 'ICE_FANG'] },
    charged: { remove: ['VICE_GRIP'] },
  },
  melmetal: { charged: { remove: ['HYPER_BEAM', 'FLASH_CANNON'] } },
  metagross: { charged: { remove: ['PSYCHIC', 'FLASH_CANNON'] } },
  metang: { charged: { keep: ['RETURN', 'GYRO_BALL', 'PSYSHOCK'] } },
  mewtwo: { charged: { remove: ['PSYCHIC', 'HYPER_BEAM'] } },
  muk_alolan: { fast: { remove: ['BITE'] } },
  necrozma_dawn_wings: { fast: { remove: ['METAL_CLAW'] } },
  necrozma_dusk_mane: { fast: { remove: ['METAL_CLAW'] } },
  nidorina: { fast: { remove: ['BITE'] } },
  nidorino: { charged: { remove: ['HORN_ATTACK'] } },
  ninetales_alolan: {
    fast: { remove: ['FEINT_ATTACK'] },
    charged: { remove: ['BLIZZARD', 'ICE_BEAM'] },
  },
  noctowl: { charged: { remove: ['NIGHT_SHADE', 'PSYCHIC'] } },
  obstagoon: { fast: { remove: ['LICK'] } },
  pelipper: {
    fast: { remove: ['WATER_GUN'] },
    charged: { remove: ['HYDRO_PUMP'] },
  },
  pidgeot: {
    fast: { remove: ['AIR_SLASH'] },
    charged: { remove: ['AIR_CUTTER', 'HURRICANE'] },
  },
  piloswine: {
    fast: { remove: ['ICE_SHARD'] },
    charged: { remove: ['BULLDOZE'] },
  },
  poliwrath: {
    fast: { remove: ['ROCK_SMASH', 'BUBBLE'] },
    charged: { remove: ['HYDRO_PUMP', 'SUBMISSION'] },
  },
  primeape: { fast: { remove: ['KARATE_CHOP'] } },
  quagsire: { charged: { remove: ['SLUDGE_BOMB'] } },
  quaquaval: { charged: { remove: ['AQUA_JET'] } },
  registeel: {
    fast: { keep: ['LOCK_ON'] },
    charged: { remove: ['HYPER_BEAM'] },
  },
  rhyperior: { charged: { remove: ['SKULL_BASH', 'STONE_EDGE'] } },
  sableye: { charged: { keep: ['FOUL_PLAY', 'POWER_GEM', 'RETURN'] } },
  sandslash_alolan: {
    fast: { remove: ['METAL_CLAW'] },
    charged: { remove: ['BULLDOZE', 'GYRO_BALL', 'BLIZZARD'] },
  },
  sealeo: {
    fast: { remove: ['WATER_GUN'] },
    charged: { keep: ['RETURN', 'AURORA_BEAM', 'WATER_PULSE', 'BODY_SLAM'] },
  },
  serperior: { charged: { remove: ['GRASS_KNOT'] } },
  skeledirge: { fast: { remove: ['BITE'] } },
  snorlax: { charged: { remove: ['HYPER_BEAM', 'HEAVY_SLAM', 'EARTHQUAKE'] } },
  steelix: {
    fast: { keep: ['DRAGON_TAIL'] },
    charged: { remove: ['HEAVY_SLAM'] },
  },
  stunfisk_galarian: { fast: { remove: ['METAL_CLAW'] } },
  swampert: {
    fast: { keep: ['MUD_SHOT'] },
    charged: { remove: ['MUDDY_WATER', 'SURF'] },
  },
  sylveon: { charged: { remove: ['DAZZLING_GLEAM'] } },
  talonflame: {
    fast: { keep: ['INCINERATE'] },
    charged: { remove: ['HURRICANE', 'FIRE_BLAST'] },
  },
  tapu_fini: { fast: { remove: ['HIDDEN_POWER'] } },
  tentacruel: { fast: { keep: ['POISON_JAB'] } },
  togekiss: { fast: { remove: ['HIDDEN_POWER'] } },
  togetic: { fast: { remove: ['EXTRASENSORY', 'HIDDEN_POWER'] } },
  togedemaru: { fast: { remove: ['SPARK'] } },
  toxapex: { fast: { remove: ['BITE'] } },
  toxicroak: { fast: { remove: ['POISON_JAB'] } },
  turtonator: { fast: { remove: ['EMBER', 'FIRE_SPIN'] } },
  ursaluna: { fast: { keep: ['TACKLE'] } },
  venusaur: {
    fast: { remove: ['RAZOR_LEAF'] },
    charged: { remove: ['PETAL_BLIZZARD', 'SOLAR_BEAM'] },
  },
  victreebel: {
    fast: { remove: ['ACID'] },
    charged: { remove: ['SOLAR_BEAM'] },
  },
  vigoroth: {
    fast: { remove: ['SCRATCH'] },
    charged: { remove: ['BRICK_BREAK'] },
  },
  virizion: { fast: { keep: ['DOUBLE_KICK'] } },
  walrein: {
    fast: { keep: ['POWDER_SNOW'] },
    charged: { keep: ['ICICLE_SPEAR', 'EARTHQUAKE'] },
  },
  weezing_galarian: { charged: { remove: ['HYPER_BEAM'] } },
  whiscash: { charged: { remove: ['WATER_PULSE'] } },
  wigglytuff: { charged: { remove: ['ICE_BEAM', 'HYPER_BEAM'] } },
  wormadam_trash: {
    fast: { remove: ['BUG_BITE'] },
    charged: { remove: ['PSYBEAM'] },
  },
  xerneas: { fast: { keep: ['GEOMANCY'] } },
  yveltal: { charged: { remove: ['PSYCHIC', 'HYPER_BEAM'] } },
  zacian_hero: { fast: { remove: ['METAL_CLAW', 'FIRE_FANG'] } },
  zarude: { fast: { remove: ['BITE'] }, charged: { remove: ['ENERGY_BALL'] } },
  zweilous: { fast: { remove: ['BITE'] } },
  zygarde_complete: {
    fast: { remove: ['BITE'] },
    charged: { remove: ['BULLDOZE', 'HYPER_BEAM'] },
  },
};

const ALWAYS_EXCLUDED_FAST_MOVES: FastMoveId[] = [
  'ACID',
  'ASTONISH',
  'CHARGE_BEAM',
  'EXTRASENSORY',
  'FEINT_ATTACK',
  'FROST_BREATH',
  'IRON_TAIL',
  'LOW_KICK',
  'PECK',
  'POUND',
  'ROCK_SMASH',
  'SUCKER_PUNCH',
  'TACKLE', // used by Ursuluna
  'TAKE_DOWN',
  'YAWN',
  'ZEN_HEADBUTT',
];
const ALWAYS_EXCLUDED_CHARGED_MOVES: ChargedMoveId[] = [
  'GIGA_IMPACT',
  'GYRO_BALL',
  'HEAT_WAVE',
  'LOW_SWEEP',
  'TWISTER',
];

export function applyMovesetOverrides(p: PokemonSpecies): PokemonSpecies {
  // Apply global exclusions first
  let fastMoves: FastMoveId[] = p.fastMoves.filter(
    (m) => !ALWAYS_EXCLUDED_FAST_MOVES.includes(m),
  );
  let chargedMoves: ChargedMoveId[] = p.chargedMoves.filter(
    (m) => !ALWAYS_EXCLUDED_CHARGED_MOVES.includes(m),
  );

  // Apply species-specific exclusions, if they exist
  const overrides = MOVESET_OVERRIDES[p.speciesId];
  if (!overrides) {
    return withMoveset(p, { fast: fastMoves, charged: chargedMoves });
  }

  if (overrides.fast) {
    const { keep, remove } = overrides.fast;
    if (keep) {
      fastMoves = keep;
    } else {
      fastMoves = fastMoves.filter((m) => !remove?.includes(m));
    }
  }

  if (overrides.charged) {
    const { keep, remove } = overrides.charged;
    if (keep) {
      chargedMoves = keep;
    } else {
      chargedMoves = chargedMoves.filter((m) => !remove?.includes(m));
    }
  }

  return withMoveset(p, { fast: fastMoves, charged: chargedMoves });
}

interface SimpleMoveset {
  fast: FastMoveId[];
  charged: ChargedMoveId[];
}

export function withMoveset(
  p: PokemonSpecies,
  { fast, charged }: SimpleMoveset,
): PokemonSpecies {
  const fastMoves = p.fastMoves.filter((m) => fast.includes(m));
  const chargedMoves = p.chargedMoves.filter((m) => charged.includes(m));

  // Add Return, if needed; it's never in a Pokemon's moveset but most can learn it
  if (charged.includes('RETURN')) {
    chargedMoves.push('RETURN');
  }

  return { ...p, fastMoves, chargedMoves };
}

function leastCommonMultiple(a: number, b: number): number {
  return Math.abs(a * b) / greatestCommonFactor(a, b);
}

function greatestCommonFactor(a: number, b: number): number {
  // Euclid's algorithm
  if (b === 0) return a;
  return greatestCommonFactor(b, a % b); // Notice they're switched
}

export interface MoveCounts {
  nFastMoves: number;
  nTurns: number;
  remainingEnergy: number;
}

/**
 * Compute the number of fast moves and turns to reach the same charged
 * move several times in succession; return a variable-length array
 * depending on the number of charged moves before returning to 0 energy.
 */
export function getMoveCounts(
  fastMove: FastMove,
  chargedMove: ChargedMove,
): MoveCounts[] {
  const moveCounts: MoveCounts[] = [];
  let residualEnergy = 0;

  // Number of cycles = lcm(CM energy cost, FM energy gain)
  const nCycles =
    leastCommonMultiple(chargedMove.energy, fastMove.energyGain) /
    chargedMove.energy;

  for (let i = 1; i <= nCycles; i++) {
    const energyNeeded = chargedMove.energy - residualEnergy;

    // How many fast moves & turns until the charged move?
    const fastMoveCount = Math.ceil(energyNeeded / fastMove.energyGain);
    const fastMoveTurns = fastMoveCount * fastMove.turns;

    // How much energy is left?
    residualEnergy =
      residualEnergy + fastMoveCount * fastMove.energyGain - chargedMove.energy;

    moveCounts.push({
      nFastMoves: fastMoveCount,
      nTurns: fastMoveTurns,
      remainingEnergy: residualEnergy,
    });
  }

  return moveCounts;
}
