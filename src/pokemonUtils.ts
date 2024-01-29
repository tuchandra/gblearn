import { CollectionEntry, getEntry } from 'astro:content';
import type {
  ChargedMove,
  ChargedMoveName,
  FastMove,
  FastMoveName,
  Pokemon,
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

export { withMoveset, getFastMove, getChargedMove };
export type { SimpleMoveset };
