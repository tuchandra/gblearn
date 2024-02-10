import { defineCollection, z, reference } from 'astro:content';
import {
  PokemonSpeciesSchema,
  FastMoveSchema,
  ChargedMoveSchema,
} from '../models';

const pokemon = defineCollection({
  type: 'data',
  schema: z.object({
    ...PokemonSpeciesSchema.shape,
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
const metas = defineCollection({
  type: 'data',
  schema: z.array(
    z.object({
      speciesId: z.string(),
      pokemon: reference('pokemon'),
      fastMove: reference('fastMoves'),
      chargedMoves: z.tuple([
        reference('chargedMoves'),
        reference('chargedMoves'),
      ]),
    }),
  ),
});

export const collections = {
  pokemon,
  fastMoves,
  chargedMoves,
  metas,
};
