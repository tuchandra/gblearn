import { type CollectionEntry, getEntry } from 'astro:content';
import type {
  ChargedMove,
  ChargedMoveName,
  FastMove,
  FastMoveName,
} from './models';

interface MovesetChanges {
  fast?: {
    keep?: FastMoveName[];
    remove?: FastMoveName[];
  };
  charged?: {
    keep?: ChargedMoveName[];
    remove?: ChargedMoveName[];
  };
}

interface SimpleMoveset {
  fast: FastMoveName[];
  charged: ChargedMoveName[];
}

async function getFastMove(name: FastMoveName): Promise<FastMove> {
  const move = await getEntry('fastMoves', name);
  return move.data;
}

async function getChargedMove(name: ChargedMoveName): Promise<ChargedMove> {
  const move = await getEntry('chargedMoves', name);
  return move.data;
}

async function withMoveset(
  p: CollectionEntry<'pokemon'>,
  { fast, charged }: SimpleMoveset,
): Promise<CollectionEntry<'pokemon'>> {
  const fastMoves = p.data.fastMoves.filter((m) => fast.includes(m.id));
  const chargedMoves = p.data.chargedMoves.filter((m) =>
    charged.includes(m.id),
  );

  return {
    ...p,
    data: {
      ...p.data,
      fastMoves,
      chargedMoves,
    },
  };
}

export interface MoveCounts {
  nFastMoves: number;
  nTurns: number;
  remainingEnergy: number;
}

function leastCommonMultiple(a: number, b: number): number {
  return Math.abs(a * b) / greatestCommonFactor(a, b);
}

function greatestCommonFactor(a: number, b: number): number {
  // Euclid's algorithm
  if (b === 0) return a;
  return greatestCommonFactor(b, a % b); // Notice they're switched
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
  // if (moveCounts.length === 1) {
  //   moveCounts.push({
  //     nFastMoves: '⟲',
  //     nTurns: '⟲',
  //     remainingEnergy: '⟲',
  //   });
  // }

  return moveCounts;
}

export { withMoveset, getFastMove, getChargedMove, getMoveCounts };
export type { SimpleMoveset };
