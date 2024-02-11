import { type CollectionEntry, getEntry } from 'astro:content';
import {
  ChargedMoveSchema,
  type ChargedMove,
  type ChargedMoveName,
  type FastMove,
  type FastMoveName,
  type PokemonName,
} from './models';

async function getFastMove(name: FastMoveName): Promise<FastMove> {
  const move = await getEntry('fastMoves', name);
  return move.data;
}

async function getChargedMove(name: ChargedMoveName): Promise<ChargedMove> {
  const move = await getEntry('chargedMoves', name);
  return move.data;
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

interface MovesetChanges {
  fast?: KeepOrRemove<FastMoveName>;
  charged?: KeepOrRemove<ChargedMoveName>;
}

const MOVESET_OVERRIDES: Partial<Record<PokemonName, MovesetChanges>> = {
  '0768-golisopod': {
    fast: { remove: ['FURY_CUTTER', 'METAL_CLAW'] },
    charged: { remove: ['AQUA_JET'] },
  },
  '0181-ampharos': {
    fast: { remove: ['CHARGE_BEAM'] },
  },
  '0149-dragonite': {
    fast: { remove: ['STEEL_WING'] },
    charged: { remove: ['DRAGON_PULSE', 'HYPER_BEAM', 'DRACO_METEOR'] },
  },
  '0210-granbull': {
    fast: { remove: ['BITE'] },
  },
  '0820-greedent': {
    fast: { remove: ['BITE', 'TACKLE'] },
  },
  '0006-charizard': {
    fast: { remove: ['EMBER', 'AIR_SLASH'] },
    charged: { remove: ['FLAMETHROWER', 'OVERHEAT', 'FIRE_BLAST'] },
  },
  '0250-ho_oh': {
    fast: { keep: ['INCINERATE'] },
    charged: { remove: ['FIRE_BLAST'] },
  },
  '0382-kyogre': {
    charged: { remove: ['HYDRO_PUMP'] },
  },
  '0645-landorus_therian': {
    fast: { remove: ['EXTRASENSORY'] },
    charged: { remove: ['BULLDOZE'] },
  },
  '0249-lugia': {
    fast: { remove: ['EXTRASENSORY'] },
    charged: { remove: ['FUTURE_SIGHT'] },
  },
  '0473-mamoswine': {
    charged: { remove: ['ANCIENT_POWER'] },
  },
  '0809-melmetal': {
    charged: { remove: ['HYPER_BEAM', 'FLASH_CANNON'] },
  },
  '0376-metagross': {
    charged: { remove: ['PSYCHIC', 'FLASH_CANNON'] },
  },
  '0150-mewtwo': {
    charged: { remove: ['PSYCHIC', 'HYPER_BEAM'] },
  },
  '0464-rhyperior': {
    charged: { remove: ['SKULL_BASH', 'STONE_EDGE'] },
  },
  '0658-greninja': {
    charged: { keep: ['NIGHT_SLASH', 'HYDRO_CANNON'] },
  },
  '0130-gyarados': {
    fast: { remove: ['BITE'] },
    charged: { remove: ['TWISTER', 'DRAGON_PULSE'] },
  },
  '0089-muk_alolan': {
    fast: { remove: ['BITE'] },
  },
  '0038-ninetales_alolan': {
    fast: { remove: ['FEINT_ATTACK'] },
    charged: { remove: ['BLIZZARD', 'ICE_BEAM'] },
  },
  '0018-pidgeot': {
    fast: { remove: ['AIR_SLASH'] },
    charged: { remove: ['AIR_CUTTER', 'HURRICANE'] },
  },
  '0062-poliwrath': {
    fast: { remove: ['ROCK_SMASH', 'BUBBLE'] },
    charged: { remove: ['HYDRO_PUMP', 'SUBMISSION'] },
  },
  '0302-sableye': {
    charged: { keep: ['FOUL_PLAY', 'POWER_GEM', 'RETURN'] },
  },
  '0028-sandslash_alolan': {
    fast: { remove: ['METAL_CLAW'] },
    charged: { remove: ['BULLDOZE', 'GYRO_BALL'] },
  },
  '0911-skeledirge': {
    fast: { remove: ['BITE'] },
  },
  '0497-serperior': {
    charged: { remove: ['GRASS_KNOT'] },
  },
  '0618-stunfisk_galarian': {
    fast: { remove: ['METAL_CLAW'] },
  },
  '0071-victreebel': {
    fast: { remove: ['ACID'] },
    charged: { remove: ['SOLAR_BEAM'] },
  },
  '0340-whiscash': {
    charged: { remove: ['WATER_PULSE'] },
  },
  '0288-vigoroth': {
    fast: { remove: ['SCRATCH'] },
    charged: { remove: ['BRICK_BREAK'] },
  },
  '0379-registeel': {
    fast: { keep: ['LOCK_ON'] },
  },
  '0208-steelix': {
    fast: { keep: ['DRAGON_TAIL'] },
  },
  '0260-swampert': {
    fast: { keep: ['MUD_SHOT'] },
    charged: { remove: ['MUDDY_WATER'] },
  },
  '0483-dialga': {
    fast: { keep: ['DRAGON_BREATH'] },
  },
  '0530-excadrill': {
    fast: { remove: ['METAL_CLAW'] },
    charged: { remove: ['EARTHQUAKE'] },
  },
  '0143-snorlax': {
    charged: { remove: ['HYPER_BEAM', 'HEAVY_SLAM', 'EARTHQUAKE'] },
  },
  '0700-sylveon': {
    charged: { remove: ['DAZZLING_GLEAM'] },
  },
  '0468-togekiss': {
    fast: { remove: ['HIDDEN_POWER'] },
  },
  '0716-xerneas': {
    fast: { keep: ['GEOMANCY'] },
  },
  '0717-yveltal': {
    charged: { remove: ['PSYCHIC', 'HYPER_BEAM'] },
  },
  '0893-zarude': {
    charged: { remove: ['ENERGY_BALL'] },
  },
  '0718-zygarde_complete': {
    fast: { remove: ['BITE'] },
    charged: { remove: ['BULLDOZE', 'HYPER_BEAM'] },
  },
  '0445-garchomp': {
    charged: { remove: ['EARTHQUAKE'] },
  },
  '0383-groudon': {
    charged: { remove: ['FIRE_BLAST'] },
  },
  '0663-talonflame': {
    fast: { keep: ['INCINERATE'] },
    charged: { remove: ['HURRICANE', 'FIRE_BLAST'] },
  },
  '0148-dragonair': {
    charged: { remove: ['WRAP'] },
  },
  '0888-zacian': {
    fast: { remove: ['METAL_CLAW', 'FIRE_FANG'] },
  },
  '0334-altaria': {
    charged: { remove: ['DRAGON_PULSE', 'DAZZLING_GLEAM'] },
  },
  '0980-clodsire': {
    charged: { remove: ['WATER_PULSE'] },
  },
  '0087-dewgong': {
    charged: { remove: ['AURORA_BEAM', 'AQUA_JET', 'BLIZZARD', 'WATER_PULSE'] },
  },
  '0093-haunter': {
    fast: { remove: ['LICK'] },
    charged: { remove: ['DARK_PULSE'] },
  },
  '0002-ivysaur': {
    charged: { remove: ['SOLAR_BEAM'] },
  },
  '0082-magneton': {
    fast: { remove: ['SPARK'] },
  },
  '0259-marshtomp': {
    fast: { remove: ['WATER_GUN'] },
  },
  '0375-metang': {
    charged: { keep: ['RETURN', 'GYRO_BALL', 'PSYSHOCK'] },
  },
  '0221-piloswine': {
    fast: { remove: ['ICE_SHARD'] },
    charged: { remove: ['BULLDOZE'] },
  },
  '0364-sealeo': {
    fast: { remove: ['WATER_GUN'] },
    charged: { keep: ['RETURN', 'AURORA_BEAM', 'WATER_PULSE', 'BODY_SLAM'] },
  },
  '0452-drapion': {
    fast: { remove: ['ICE_FANG', 'INFESTATION'] },
  },
  '0426-drifblim': {
    charged: { remove: ['OMINOUS_WIND'] },
  },
  '0395-empoleon': {
    charged: { remove: ['HYDRO_PUMP'] },
  },
  '0475-gallade': {
    charged: { remove: ['SYNCHRONOISE'] },
  },
  '0423-gastrodon': {
    fast: { remove: ['HIDDEN_POWER'] },
  },
  '0448-lucario': {
    fast: { remove: ['BULLET_PUNCH'] },
  },
  '0413-wormadam_trash': {
    fast: { remove: ['BUG_BITE'] },
    charged: { remove: ['PSYBEAM'] },
  },
  '0634-zweilous': {
    fast: { remove: ['BITE'] },
  },
  '0030-nidorina': {
    fast: { remove: ['BITE'] },
  },
  '0910-crocalor': {
    fast: { remove: ['BITE'] },
  },
  '0057-primeape': {
    fast: { remove: ['KARATE_CHOP'] },
  },
  '0176-togetic': {
    fast: { remove: ['EXTRASENSORY', 'HIDDEN_POWER'] },
  },
  '0207-gligar': {
    fast: { remove: ['FURY_CUTTER'] },
  },
  '0108-lickitung': {
    charged: { remove: ['STOMP', 'HYPER_BEAM'] },
  },
  '0226-mantine': {
    charged: { remove: ['WATER_PULSE'] },
  },
  '0279-pelipper': {
    fast: { remove: ['WATER_GUN'] },
    charged: { remove: ['HYDRO_PUMP'] },
  },
  '0033-nidorino': {
    charged: { remove: ['HORN_ATTACK'] },
  },
  '0589-escavalier': {
    fast: { remove: ['BUG_BITE'] },
  },
  '0598-ferrothorn': {
    fast: { remove: ['METAL_CLAW'] },
  },
  '0330-flygon': {
    charged: { remove: ['EARTH_POWER', 'BOOMBURST'] },
  },
  '0612-haxorus': {
    charged: { remove: ['DRAGON_CLAW'] },
  },
  '0462-magnezone': {
    fast: { remove: ['SPARK'] },
  },
  '0303-mawile': {
    fast: { remove: ['BITE', 'ICE_FANG'] },
  },
  '0788-tapu_fini': {
    fast: { remove: ['HIDDEN_POWER'] },
  },
  '0776-turtonator': {
    fast: { remove: ['EMBER', 'FIRE_SPIN'] },
  },
  '0110-weezing_galarian': {
    fast: { remove: ['TACKLE'] },
    charged: { remove: ['HYPER_BEAM'] },
  },
  '0454-toxicroak': {
    fast: { remove: ['POISON_JAB'] },
  },
  '0703-carbink': {
    fast: { remove: ['TACKLE'] },
    charged: { remove: ['POWER_GEM'] },
  },
  '0737-charjabug': {
    fast: { remove: ['SPARK'] },
  },
  '0003-venusaur': {
    fast: { remove: ['RAZOR_LEAF'] },
    charged: { remove: ['PETAL_BLIZZARD', 'SOLAR_BEAM'] },
  },
  '0640-virizion': {
    fast: { keep: ['DOUBLE_KICK'] },
  },
  '0638-cobalion': {
    fast: { keep: ['DOUBLE_KICK'] },
  },
  '0073-tentacruel': {
    fast: { keep: ['POISON_JAB'] },
  },
  '0365-walrein': {
    fast: { keep: ['POWDER_SNOW'] },
    charged: { keep: ['ICICLE_SPEAR', 'EARTHQUAKE'] },
  },
};

const ALWAYS_EXCLUDED_FAST_MOVES: FastMoveName[] = [
  'ZEN_HEADBUTT',
  'FEINT_ATTACK',
  'ROCK_SMASH',
  'FROST_BREATH',
  'LOW_KICK',
  'PECK',
  'YAWN',
  'ASTONISH',
  'IRON_TAIL',
  'CHARGE_BEAM',
  'ACID',
  'TAKE_DOWN',
  'SUCKER_PUNCH',
];
const ALWAYS_EXCLUDED_CHARGED_MOVES: ChargedMoveName[] = [
  'TWISTER',
  'GIGA_IMPACT',
  'GYRO_BALL',
  'HEAT_WAVE',
  'LOW_SWEEP',
];

function applyMovesetOverrides(
  p: CollectionEntry<'pokemon'>,
): CollectionEntry<'pokemon'> {
  // Apply global exclusions first
  let fastMoves: FastMoveName[] = p.data.fastMoves
    .map((m) => m.id)
    .filter((m) => !ALWAYS_EXCLUDED_FAST_MOVES.includes(m));
  let chargedMoves: ChargedMoveName[] = p.data.chargedMoves
    .map((m) => m.id)
    .filter((m) => !ALWAYS_EXCLUDED_CHARGED_MOVES.includes(m));

  // Apply species-specific exclusions, if they exist
  const overrides = MOVESET_OVERRIDES[p.id];
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
  fast: FastMoveName[];
  charged: ChargedMoveName[];
}

function withMoveset(
  p: CollectionEntry<'pokemon'>,
  { fast, charged }: SimpleMoveset,
): CollectionEntry<'pokemon'> {
  const fastMoves = p.data.fastMoves.filter((m) => fast.includes(m.id));
  const chargedMoves = p.data.chargedMoves.filter((m) =>
    charged.includes(m.id),
  );

  // Add Return, if needed; it's never in a Pokemon's moveset but most can learn it
  if (charged.includes('RETURN')) {
    chargedMoves.push({ id: 'RETURN', collection: 'chargedMoves' });
  }

  return {
    ...p,
    data: {
      ...p.data,
      fastMoves,
      chargedMoves,
    },
  };
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
function getMoveCounts(
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

export {
  withMoveset,
  getFastMove,
  applyMovesetOverrides,
  getChargedMove,
  getMoveCounts,
  MOVESET_OVERRIDES,
};
export type { SimpleMoveset };
