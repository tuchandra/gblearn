import { getEntry } from 'astro:content';
import PokemonIndex from './data/pokemon.ts';
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

export async function getPokemonSpecies(
  name: SpeciesId,
): Promise<PokemonSpecies> {
  const speciesSlug = await getPokemonIdByName(name);
  const species = await getEntry('pokemon', speciesSlug);

  return species.data;
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
  /** tree-sorter-ts: keep-sorted **/
  abomasnow: {
    fast: {
      keep: ['POWDER_SNOW'],
    },
    charged: {
      remove: ['OUTRAGE', 'BLIZZARD'],
    },
  },
  altaria: { charged: { remove: ['DRAGON_PULSE', 'DAZZLING_GLEAM'] } },
  ampharos: { fast: { remove: ['CHARGE_BEAM'] } },
  annihilape: {
    charged: { remove: ['SHADOW_BALL'] },
  },
  arctibax: {
    fast: { remove: ['ICE_FANG'] },
    charged: { remove: ['OUTRAGE'] },
  },
  ariados: {
    fast: { remove: ['INFESTATION'] },
    charged: { remove: ['SHADOW_SNEAK', 'MEGAHORN'] },
  },
  aurorus: {
    fast: { keep: ['POWDER_SNOW'] },
    charged: {
      keep: ['WEATHER_BALL_ICE', 'METEOR_BEAM', 'ANCIENT_POWER', 'THUNDERBOLT'],
    },
  },
  bellibolt: {
    fast: { remove: ['WATER_GUN'] },
  },
  bibarel: { fast: { remove: ['WATER_GUN'] } },
  blastoise: {
    fast: { remove: ['WATER_GUN'] },
  },
  carbink: { charged: { remove: [] } },
  charizard: {
    fast: { remove: ['EMBER', 'AIR_SLASH'] },
    charged: { remove: ['FLAMETHROWER', 'OVERHEAT', 'FIRE_BLAST'] },
  },
  charjabug: { fast: { remove: ['SPARK'] } },
  chesnaught: { charged: { remove: ['ENERGY_BALL', 'SOLAR_BEAM'] } },
  clefable: { charged: { remove: ['DAZZLING_GLEAM'] } },
  clodsire: { charged: { remove: ['WATER_PULSE'] } },
  cobalion: { fast: { keep: ['DOUBLE_KICK'] } },
  corsola_galarian: {
    charged: { remove: ['ROCK_BLAST'] },
  },
  cradily: {
    fast: { remove: ['INFESTATION'] },
    charged: { remove: ['STONE_EDGE'] },
  },
  crustle: {
    fast: { remove: ['SMACK_DOWN'] },
    charged: { remove: ['ROCK_BLAST'] },
  },
  dewgong: { charged: { keep: ['ICY_WIND', 'DRILL_RUN'] } },
  dialga: { fast: { keep: ['DRAGON_BREATH'] } },
  diggersby: {
    charged: { remove: ['DIG', 'EARTHQUAKE'] },
  },
  dragonair: { charged: { remove: ['WRAP'] } },
  dragonite: {
    charged: { remove: ['DRAGON_PULSE', 'HYPER_BEAM', 'DRACO_METEOR'] },
    fast: { remove: ['STEEL_WING'] },
  },
  drapion: {
    fast: { remove: ['ICE_FANG', 'INFESTATION'] },
    charged: { remove: ['FELL_STINGER'] },
  },
  drifblim: { charged: { remove: ['OMINOUS_WIND'] } },
  dunsparce: {
    charged: { remove: ['DIG'] },
  },
  dusknoir: { charged: { remove: ['OMINOUS_WIND', 'PSYCHIC'] } },
  electivire: {
    charged: { remove: ['THUNDER'] },
  },
  empoleon: {
    charged: { remove: ['HYDRO_PUMP'] },
  },
  escavalier: { fast: { remove: [] } },
  excadrill: {
    fast: { remove: ['METAL_CLAW'] },
    charged: { remove: ['EARTHQUAKE'] },
  },
  feraligatr: {
    fast: { keep: ['SHADOW_CLAW'] },
    charged: { remove: ['HYDRO_PUMP'] },
  },
  ferrothorn: { fast: { remove: [] } },
  florges: { fast: { remove: ['RAZOR_LEAF'] } },
  flygon: { charged: { remove: ['EARTH_POWER', 'BOOMBURST'] } },
  forretress: {
    fast: {
      remove: ['STRUGGLE_BUG'],
    },
    charged: {
      remove: ['HEAVY_SLAM'],
    },
  },
  gallade: { charged: { remove: ['SYNCHRONOISE'] } },
  garchomp: { charged: { remove: ['EARTHQUAKE'] } },
  gastrodon: {
    fast: { remove: ['HIDDEN_POWER'] },
    charged: { remove: ['EARTHQUAKE'] },
  },
  gligar: { fast: { remove: [] } },
  golisopod: {
    fast: { remove: ['METAL_CLAW', 'WATERFALL'] },
    charged: { remove: [] },
  },
  golurk: {
    charged: { remove: ['POLTERGEIST'] },
  },
  goodra: {
    fast: { remove: ['WATER_GUN'] },
    charged: { remove: ['MUDDY_WATER', 'SLUDGE_WAVE'] },
  },
  greninja: {
    fast: { remove: ['BUBBLE'] },
    charged: { keep: ['NIGHT_SLASH', 'HYDRO_CANNON'] },
  },
  groudon: { charged: { remove: ['FIRE_BLAST'] } },
  gyarados: {
    charged: { remove: ['TWISTER', 'DRAGON_PULSE'] },
  },
  haunter: { fast: { remove: ['LICK'] }, charged: { remove: ['DARK_PULSE'] } },
  haxorus: { charged: { remove: ['DRAGON_CLAW'] } },
  hippowdon: { charged: { remove: ['EARTH_POWER', 'EARTHQUAKE'] } },
  ho_oh: {
    fast: { keep: ['INCINERATE'] },
    charged: { remove: ['FIRE_BLAST'] },
  },
  ivysaur: { charged: { remove: ['SOLAR_BEAM'] } },
  jumpluff: {
    fast: { remove: ['INFESTATION', 'BULLET_SEED'] },
    charged: { remove: ['DAZZLING_GLEAM', 'SOLAR_BEAM'] },
  },
  kartana: { fast: { remove: ['AIR_SLASH'] } },
  kyogre: { charged: { remove: ['HYDRO_PUMP'] } },
  landorus_therian: {
    fast: { remove: ['EXTRASENSORY'] },
    charged: { remove: ['BULLDOZE'] },
  },
  lanturn: { charged: { remove: ['THUNDER', 'HYDRO_PUMP'] } },
  lapras: {
    fast: {
      keep: ['PSYWAVE'],
    },
    charged: {
      remove: ['HYDRO_PUMP', 'DRAGON_PULSE', 'SURF', 'BLIZZARD'],
    },
  },
  lickilicky: {
    fast: { remove: ['LICK'] },
    charged: { remove: ['HYPER_BEAM'] },
  },
  lickitung: { charged: { remove: ['STOMP', 'HYPER_BEAM'] } },
  lileep: { fast: { remove: ['INFESTATION'] } },
  lucario: {
    fast: { remove: ['BULLET_PUNCH', 'COUNTER'] },
    charged: { remove: ['CLOSE_COMBAT', 'FLASH_CANNON'] },
  },
  ludicolo: {
    fast: {},
    charged: {
      remove: ['HYDRO_PUMP', 'SOLAR_BEAM', 'BLIZZARD'],
    },
  },
  lugia: {
    fast: { remove: ['EXTRASENSORY'] },
    charged: { remove: ['FUTURE_SIGHT'] },
  },
  machamp: {
    fast: { keep: ['KARATE_CHOP'] },
    charged: { remove: ['SUBMISSION', 'DYNAMIC_PUNCH', 'HEAVY_SLAM'] },
  },
  machoke: {
    charged: { remove: ['SUBMISSION'] },
  },
  magneton: { fast: { remove: ['SPARK'] } },
  magnezone: { fast: { remove: ['SPARK'] } },
  malamar: {
    fast: { remove: ['PSYWAVE'] },
    charged: { remove: ['PSYBEAM'] },
  },
  mamoswine: { charged: { remove: ['ANCIENT_POWER', 'BULLDOZE'] } },
  marowak: { charged: { remove: ['DIG', 'EARTHQUAKE'] } },
  marshtomp: { fast: { remove: ['WATER_GUN'] } },
  mawile: {
    fast: { remove: ['ICE_FANG'] },
    charged: { remove: ['VICE_GRIP'] },
  },
  melmetal: { charged: { remove: ['HYPER_BEAM', 'FLASH_CANNON'] } },
  metagross: { charged: { remove: ['PSYCHIC', 'FLASH_CANNON'] } },
  metang: { charged: { keep: ['RETURN', 'GYRO_BALL', 'PSYSHOCK'] } },
  mewtwo: { charged: { remove: ['PSYCHIC', 'HYPER_BEAM'] } },
  muk_alolan: { fast: { remove: [] } },
  necrozma_dawn_wings: { fast: { remove: ['METAL_CLAW'] } },
  necrozma_dusk_mane: { fast: { remove: ['METAL_CLAW'] } },
  nidorina: { fast: { remove: [] } },
  nidorino: { charged: { remove: ['HORN_ATTACK'] } },
  ninetales: {
    charged: { remove: ['FLAMETHROWER', 'FIRE_BLAST'] },
  },
  noctowl: { charged: { remove: ['NIGHT_SHADE', 'PSYCHIC'] } },
  obstagoon: { fast: { remove: ['LICK'] } },
  oranguru: { charged: { remove: ['PSYCHIC', 'FUTURE_SIGHT'] } },
  pangoro: {
    fast: { keep: ['KARATE_CHOP'] },
    charged: { remove: ['IRON_HEAD'] },
  },
  pelipper: {
    fast: { remove: ['WATER_GUN'] },
    charged: { remove: ['HYDRO_PUMP'] },
  },
  perrserker: {
    fast: {
      remove: ['METAL_CLAW'],
    },
  },
  pidgeot: {
    fast: { remove: ['AIR_SLASH'] },
    charged: { remove: ['AIR_CUTTER', 'HURRICANE'] },
  },
  piloswine: {
    fast: { remove: ['ICE_SHARD'] },
    charged: { remove: ['BULLDOZE'] },
  },
  politoed: {
    fast: { remove: ['BUBBLE'] },
    charged: { remove: ['HYDRO_PUMP', 'SURF'] },
  },
  poliwrath: {
    fast: { remove: ['ROCK_SMASH', 'BUBBLE'] },
    charged: { remove: ['HYDRO_PUMP', 'SUBMISSION'] },
  },
  primeape: { fast: { remove: ['KARATE_CHOP'] } },
  quagsire: {
    fast: { remove: ['WATER_GUN'] },
    charged: { remove: ['SLUDGE_BOMB'] },
  },
  quaquaval: {
    fast: { remove: ['WATER_GUN'] },
  },
  qwilfish: {
    fast: { remove: ['WATER_GUN'] },
    charged: { remove: ['FELL_STINGER', 'SLUDGE_WAVE'] },
  },
  regirock: { fast: { keep: ['LOCK_ON'] } },
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
  skeledirge: { fast: { remove: [] } },
  snorlax: { charged: { remove: ['HYPER_BEAM', 'HEAVY_SLAM', 'EARTHQUAKE'] } },
  steelix: {
    fast: { keep: ['DRAGON_TAIL', 'THUNDER_FANG'] },
    charged: { remove: ['HEAVY_SLAM'] },
  },
  stunfisk: {
    charged: { remove: ['MUDDY_WATER'] },
  },
  stunfisk_galarian: {
    fast: { remove: ['METAL_CLAW'] },
    charged: { remove: ['MUDDY_WATER', 'FLASH_CANNON'] },
  },
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
  togedemaru: { fast: { remove: ['SPARK'] } },
  togekiss: { fast: { remove: ['HIDDEN_POWER'] } },
  togetic: { fast: { remove: ['EXTRASENSORY', 'HIDDEN_POWER'] } },
  toxapex: {
    charged: { remove: ['GUNK_SHOT'] },
  },
  toxicroak: { fast: { remove: ['POISON_JAB'] } },
  turtonator: { fast: { remove: ['EMBER', 'FIRE_SPIN'] } },
  typhlosion: {
    fast: { remove: ['EMBER'] },
    charged: { keep: ['THUNDER_PUNCH', 'BLAST_BURN'] },
  },
  ursaluna: { fast: { keep: ['TACKLE'] } },
  venusaur: {
    fast: { remove: ['RAZOR_LEAF'] },
    charged: { remove: ['PETAL_BLIZZARD', 'SOLAR_BEAM'] },
  },
  victreebel: {
    fast: {},
    charged: { remove: ['SOLAR_BEAM'] },
  },
  vigoroth: {
    fast: { remove: ['SCRATCH'] },
    charged: { remove: ['BRICK_BREAK'] },
  },
  virizion: {
    fast: { keep: ['DOUBLE_KICK'] },
    charged: { remove: ['CLOSE_COMBAT'] },
  },
  walrein: {
    fast: { keep: ['POWDER_SNOW'] },
    charged: { keep: ['ICICLE_SPEAR', 'EARTHQUAKE'] },
  },
  weezing_galarian: { charged: { remove: ['HYPER_BEAM'] } },
  whiscash: {
    fast: { remove: ['WATER_GUN'] },
    charged: { remove: ['WATER_PULSE'] },
  },
  wigglytuff: {
    charged: { keep: ['ICY_WIND', 'SWIFT', 'DISARMING_VOICE'] },
  },
  wormadam_trash: {
    charged: { remove: ['PSYBEAM'] },
  },
  xerneas: { fast: { keep: ['GEOMANCY'] } },
  yveltal: { charged: { remove: ['PSYCHIC', 'HYPER_BEAM'] } },
  zacian_hero: { fast: { remove: ['METAL_CLAW', 'FIRE_FANG'] } },
  zapdos: {
    charged: { remove: ['THUNDER', 'ZAP_CANNON'] },
  },
  zarude: { charged: { remove: ['ENERGY_BALL'] } },
  zweilous: { fast: { remove: [] } },
  zygarde_complete: {
    charged: { remove: ['HYPER_BEAM'] },
  },
};

const ALWAYS_EXCLUDED_FAST_MOVES: FastMoveId[] = [
  /** tree-sorter-ts: keep-sorted **/
  'BITE',
  'CHARGE_BEAM',
  'EXTRASENSORY',
  'FEINT_ATTACK',
  'FROST_BREATH',
  'IRON_TAIL',
  'LOW_KICK',
  'PECK',
  'POUND',
  'ROCK_SMASH',
  'TACKLE', // used by Ursuluna
  'TAKE_DOWN',
  'YAWN',
  'ZEN_HEADBUTT',
];
const ALWAYS_EXCLUDED_CHARGED_MOVES: ChargedMoveId[] = [
  /** tree-sorter-ts: keep-sorted **/
  'GIGA_IMPACT',
  'GYRO_BALL',
  'HEAT_WAVE',
  'LOW_SWEEP',
  'RAZOR_SHELL',
  'STOMP',
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
