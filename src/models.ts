import { z } from 'zod';

/**
 * What is a Pokemon?
 * ------------------
 * Its definition has changed throughout the lifetime of the franchise (that is, if
 * there ever was a coherent definition to begin with).
 * 
 * Pokemon with different Pokedex numbers are always considered distinct. 
 * 
 * Two Pokemon with the same Pokedex number may also be considered distinct if they
 * have different stats, typings, or movesets; that is, if there are material
 * differences in how one would use them in battle.
 * 
 * Alternate forms
 * ---------------
 * Shadow forms are not considered distinct. They have the same stats and moveset
 * (ignoring Frustration, because it sucks); while they take & deal 20% more damage,
 * these can be accounted for when computing damage.
 * 
 * Regional forms _are_ considered distinct. They can have different stats, movesets,
 * and/or types. Sandlash and Alolan Sandslash are completely different.
 * 
 * Megas are considered distinct, because they have different stats; in practice this
 * distinction does not matter until megas are allowed in GBL.
 * 
 * Certain other forms are considered distinct, including (non-exhaustively):
 * - Castform (normal, Rainy, Sunny, Snowy)
 * - Deoxys (normal, Attack, Defense, Speed)
 * - Darmanitan (normal, Zen) & Galarian variants
 * - Shaymin, Giratina, and other Pokemon with alternate forms
 * - Pumpkaboo and Gourgeist (the sizes have different stats)
 * - Certain Pikachu costumes that got, inexplicably, different moves ...
 */
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
  tags: z.array(z.string()).optional(),
});

const FastMoveSchema = z.object({
  moveId: z.string(),
  name: z.string(),
  type: z.string(),
  power: z.number(),
  energyGain: z.number(),
  turns: z.number(),
});

const ChargedMoveSchema = z.object({
  moveId: z.string(),
  name: z.string(),
  type: z.string(),
  power: z.number(),
  energy: z.number(),
  // Not every move has buff/debuff effects; we also don't use them yet.
  buffs: z.array(z.number()).optional(),
  buffTarget: z.string().optional(),
  buffApplyChance: z.string().optional(),
});

const CupMetaSchema = z.array(
  z.object({
    speciesId: z.string(),
    pokemon: z.string(), // will reference Pokemon
    fastMove: z.string(),
    chargedMoves: z.tuple([z.string(), z.string()]),
  }),
);

type Pokemon = z.infer<typeof PokemonSchema>;
type FastMove = z.infer<typeof FastMoveSchema>;
type ChargedMove = z.infer<typeof ChargedMoveSchema>;
type Move = FastMove | ChargedMove;
type CupMeta = z.infer<typeof CupMetaSchema>;

export { PokemonSchema, FastMoveSchema, ChargedMoveSchema, CupMetaSchema };
export type { Pokemon, FastMove, ChargedMove, Move, CupMeta };
