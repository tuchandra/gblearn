import { defineCollection } from 'astro:content';
import { PokemonSchema, FastMoveSchema, ChargedMoveSchema } from '../models';

const pokemon = defineCollection({
  type: 'data',
  schema: PokemonSchema,
});
const fastMoves = defineCollection({
  type: 'data',
  schema: FastMoveSchema,
});
const chargedMoves = defineCollection({
  type: 'data',
  schema: ChargedMoveSchema,
});

export const collections = {
  pokemon,
  fastMoves,
  chargedMoves,
};
