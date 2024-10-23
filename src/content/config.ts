import { glob } from 'astro/loaders';
import { defineCollection, reference, z } from 'astro:content';
import {
  ChargedMoveSchema,
  FastMoveSchema,
  PokemonSpeciesSchema,
} from '../models';

const pokemon = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/pokemon' }),
  schema: PokemonSpeciesSchema,
});
const fastMoves = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: './src/data/fast-moves',
    generateId: ({ data }) => {
      return data.moveId as string; // shh, typescript
    },
  }),
  schema: FastMoveSchema,
});
const chargedMoves = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: './src/data/charged-moves',
    generateId: ({ data }) => {
      return data.moveId as string;
    },
  }),
  schema: ChargedMoveSchema,
});
const metas = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/metas' }),
  schema: z.array(
    z.object({
      speciesId: z.string(),
      pokemon: reference('pokemon'),
    }),
  ),
});

export const collections = {
  pokemon,
  fastMoves,
  chargedMoves,
  metas,
};
