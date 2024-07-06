import { z } from 'zod';
import type { ValueOf } from './type-utils';
import { keys, values } from './type-utils';

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
const PokemonSpeciesSchema = z.object({
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

enum CupName {
  great = 'great',
  ultra = 'ultra',
  master = 'master',
  remix = 'remix',
  summer = 'summer',
  premiermaster = 'premiermaster',
  premierultra = 'premierultra',
  // these aren't in PVPoke yet, later this season probably?
  // fossil = 'fossil',
  // fantasy = 'fantasy',
}

type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
type FastMove = z.infer<typeof FastMoveSchema>;
type ChargedMove = z.infer<typeof ChargedMoveSchema>;
type Move = FastMove | ChargedMove;
type CupMeta = z.infer<typeof CupMetaSchema>;

// Construct indexes & string unions for the different entities
import type ChargedMoveIndex from './content/chargedMoves.ts';
import type FastMoveIndex from './content/fastMoves.ts';
import PokemonIndex from './content/pokemon.ts';

/** ID of a charged move (e.g., "SOLAR_BEAM", "HYDRO_PUMP") */
type ChargedMoveId = keyof typeof ChargedMoveIndex;

/** Human-readable name of a charged move (e.g., "Solar Beam", "Hydro Pump") */
type ChargedMoveName = ValueOf<typeof ChargedMoveIndex>;

/** ID of a fast move (e.g., "AIR_SLASH", "COUNTER") */
type FastMoveId = keyof typeof FastMoveIndex;

/** Human-readable name of a fast move (e.g., "Air Slash", "Counter") */
type FastMoveName = ValueOf<typeof FastMoveIndex>;

/** Number & name of a Pokemon (e.g., "0001-bulbasaur", "0038-ninetales_alolan") */
type PokemonId = keyof typeof PokemonIndex;

/** Lowercase, underscored name of a Pokemon (e.g., "bulbasaur", "ninetales_alolan") */
type PokemonName = ValueOf<typeof PokemonIndex>;

// Zod validators for PokemonId & PokemonName
const ids = keys(PokemonIndex);
const names = values(PokemonIndex);
const ZPokemonId = z.enum([ids[0], ...ids.slice(1)]);
const ZPokemonName = z.enum([names[0], ...names.slice(1)]);

export {
  ChargedMoveSchema,
  CupMetaSchema,
  CupName,
  FastMoveSchema,
  PokemonSpeciesSchema,
  ZPokemonId,
  ZPokemonName,
};
export type {
  ChargedMove,
  ChargedMoveId,
  ChargedMoveName,
  CupMeta,
  FastMove,
  FastMoveId,
  FastMoveName,
  Move,
  PokemonId,
  PokemonName,
  PokemonSpecies,
};
