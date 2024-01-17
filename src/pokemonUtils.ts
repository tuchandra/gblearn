import { PokemonSchema } from './models';
import type { Pokemon } from './models';

interface MovesetChanges {
  fast?: {
    keep?: string[];
    remove?: string[];
  };
  charged?: {
    keep?: string[];
    remove?: string[];
  };
}

function simplifyMoves(p: Pokemon, { fast, charged }: MovesetChanges): Pokemon {
  const fastMoves = [...p.fastMoves, ...(fast?.keep || [])].filter(
    (m) => !fast?.remove?.includes(m),
  );
  const chargedMoves = [...p.chargedMoves, ...(charged?.keep || [])].filter(
    (m) => !charged?.remove?.includes(m),
  );

  return {
    ...p,
    fastMoves,
    chargedMoves,
  };
}

export { simplifyMoves };
export type { MovesetChanges };
