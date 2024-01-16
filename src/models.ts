import { z } from 'astro:content';

const PokemonSchema = z.object({
  dex: z.number(),
  speciesName: z.string(),
  speciesId: z.string(),
  baseStats: z.object({
    atk: z.number(),
    def: z.number(),
    hp: z.number(),
  }),
  types: z.array(z.string()),
  fastMoves: z.array(z.string()),
  chargedMoves: z.array(z.string()),
  released: z.boolean(),
});

const FastMoveSchema = z.object({
  moveId: z.string(),
  name: z.string(),
  type: z.string(),
  power: z.number(),
  energyGain: z.number(),
  cooldown: z.number(),
});

const ChargedMoveSchema = z.object({
  moveId: z.string(),
  name: z.string(),
  type: z.string(),
  power: z.number(),
  energy: z.number(),
  buffs: z.array(z.number()).optional(),
  buffTarget: z.string().optional(),
  buffApplyChance: z.string().optional(),
});

type Pokemon = z.infer<typeof PokemonSchema>;
type FastMove = z.infer<typeof FastMoveSchema>;
type ChargedMove = z.infer<typeof ChargedMoveSchema>;
type Move = FastMove | ChargedMove;

export { PokemonSchema, FastMoveSchema, ChargedMoveSchema };
export type { Pokemon, FastMove, ChargedMove, Move };
