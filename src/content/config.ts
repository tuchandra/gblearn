import { defineCollection, z, reference } from 'astro:content';
import { PokemonSchema, FastMoveSchema, ChargedMoveSchema } from '../models';

const pokemon = defineCollection({
  type: 'data',
  schema: z.object({
    ...PokemonSchema.shape,
    fastMoves: z.array(reference('fastMoves')),
    chargedMoves: z.array(reference('chargedMoves')),
  }),
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
