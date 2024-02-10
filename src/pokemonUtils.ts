import { CollectionEntry, getEntry } from 'astro:content';
import type {
  ChargedMove,
  ChargedMoveName,
  FastMove,
  FastMoveName,
  PokemonSpecies,
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

interface MoveCounts {
  nFastMoves: number;
  nTurns: number;
  remainingEnergy: number;
}

async function getMoveCounts(
  fastMove: FastMove,
  chargedMove: ChargedMove,
): Promise<MoveCounts[]> {
  // const fastMove = await getFastMove(fast);
  // const chargedMove = await getChargedMove(charged);

  const moveCounts = [];
  let residualEnergy = 0;

  for (let i = 0; i <= 4; i++) {
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

export { withMoveset, getFastMove, getChargedMove, getMoveCounts };
export type { SimpleMoveset };
