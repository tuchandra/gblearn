import { defineCollection, reference, z } from 'astro:content';
import {
  ChargedMoveSchema,
  FastMoveSchema,
  PokemonSpeciesSchema,
} from '../models';

const pokemon = defineCollection({
  type: 'data',
  schema: PokemonSpeciesSchema,
});
const fastMoves = defineCollection({
  type: 'data',
  schema: FastMoveSchema,
});
const chargedMoves = defineCollection({
  type: 'data',
  schema: ChargedMoveSchema,
});
const metas = defineCollection({
  type: 'data',
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
