import { z } from 'zod';
import type { ValueOf } from './type-utils';
import { keys, values } from './type-utils';

import ChargedMoveIndex from './content/chargedMoves.ts';
import FastMoveIndex from './content/fastMoves.ts';
import PokemonIndex from './content/pokemon.ts';
import { Level } from './levels.ts';
import { PokemonType } from './pokemon-types.ts';

export const IvsSchema = z.object({
  atk: z.number().min(0).max(15).int(),
  def: z.number().min(0).max(15).int(),
  hp: z.number().min(0).max(15).int(),
});
export type Ivs = z.infer<typeof IvsSchema>;
export type IvKey = `${number}-${number}-${number}`;

export function IvsToKey(ivs: Ivs): IvKey {
  return `${ivs.atk}-${ivs.def}-${ivs.hp}`;
}
export function IvsFromKey(key: IvKey): Ivs {
  const [atk, def, hp] = key.split('-').map(Number.parseInt);
  return { atk, def, hp };
}

export const LevelIvsSchema = z.object({
  level: z
    .number()
    .min(1)
    .max(51)
    .multipleOf(0.5)
    .transform((val): Level => {
      return val as Level;
    }),
  ivs: IvsSchema,
});
export type LevelIvs = z.infer<typeof LevelIvsSchema>;

export const StatsSchema = z.object({
  atk: z.number(),
  def: z.number(),
  hp: z.number(),
});
export type Stats = z.infer<typeof StatsSchema>;

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
export const PokemonSpeciesSchema = z.object({
  dex: z.number(),
  speciesName: z.string(),
  speciesId: z.string().transform((val) => val as SpeciesId),
  baseStats: StatsSchema,
  defaultIvs: z.object({
    1500: LevelIvsSchema,
    2500: LevelIvsSchema,
  }),
  types: z
    .string()
    .array()
    .transform((vals): PokemonType[] => {
      return vals.map((val) => PokemonType[val as keyof typeof PokemonType]);
    }),
  fastMoves: z
    .string()
    .array()
    .transform((vals) => vals as FastMoveId[]),
  chargedMoves: z
    .string()
    .array()
    .transform((vals) => vals as ChargedMoveId[]),
  released: z.boolean(),
  tags: z.array(z.string()).optional(),
});
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;

/**
 * A Pokemon is a PokemonSpecies with some IVs and a level, which together
 * determine its CP and stats.
 */
export const PokemonSchema = z.object({
  species: PokemonSpeciesSchema,
  shadow: z.boolean(),
  level: z
    .number()
    .min(1)
    .max(51)
    .multipleOf(0.5)
    .transform((val): Level => {
      return val as Level;
    }),
  ivs: z.object({
    atk: z.number().min(0).max(15).int(),
    def: z.number().min(0).max(15).int(),
    hp: z.number().min(0).max(15).int(),
  }),
});
export type Pokemon = z.infer<typeof PokemonSchema>;

export const FastMoveSchema = z.object({
  moveId: z.string(),
  name: z.string(),
  type: z
    .string()
    .transform((val) => PokemonType[val as keyof typeof PokemonType]),
  power: z.number(),
  energyGain: z.number(),
  turns: z.number(),
});
export type FastMove = z.infer<typeof FastMoveSchema>;

export const ChargedMoveSchema = z.object({
  moveId: z.string(),
  name: z.string(),
  type: z
    .string()
    .transform((val) => PokemonType[val as keyof typeof PokemonType]),
  power: z.number(),
  energy: z.number(),
  // Not every move has buff/debuff effects; we also don't use them yet.
  buffs: z.array(z.number()).optional(),
  buffTarget: z.string().optional(),
  buffApplyChance: z.string().optional(),
});
export type ChargedMove = z.infer<typeof ChargedMoveSchema>;

export const CupMetaSchema = z.array(
  z.object({
    speciesId: z.string(), // "escavalier"
    pokemon: z.string(), // "0589-escavalier"
  }),
);

export enum CupName {
  great = 'great',
  ultra = 'ultra',
  master = 'master',
  remix = 'remix',
  summer = 'summer',
  premiermaster = 'premiermaster',
  premierultra = 'premierultra',
  fossil = 'fossil',
  fantasy = 'fantasy',
}

export type Move = FastMove | ChargedMove;
export type CupMeta = z.infer<typeof CupMetaSchema>;

/** ID of a charged move (e.g., "SOLAR_BEAM", "HYDRO_PUMP") */
export type ChargedMoveId = keyof typeof ChargedMoveIndex;

/** Human-readable name of a charged move (e.g., "Solar Beam", "Hydro Pump") */
export type ChargedMoveName = ValueOf<typeof ChargedMoveIndex>;

/** ID of a fast move (e.g., "AIR_SLASH", "COUNTER") */
export type FastMoveId = keyof typeof FastMoveIndex;

/** Human-readable name of a fast move (e.g., "Air Slash", "Counter") */
export type FastMoveName = ValueOf<typeof FastMoveIndex>;

/** Number & name of a Pokemon (e.g., "0001-bulbasaur", "0038-ninetales_alolan") */
export type SpeciesSlug = keyof typeof PokemonIndex;

/** Lowercase, underscored name of a Pokemon (e.g., "bulbasaur", "ninetales_alolan") */
export type SpeciesId = ValueOf<typeof PokemonIndex>;

// Zod validators for PokemonId & PokemonName
const ids = keys(PokemonIndex);
const names = values(PokemonIndex);
export const ZPokemonId = z.enum([ids[0], ...ids.slice(1)]);
export const ZPokemonName = z.enum([names[0], ...names.slice(1)]);
