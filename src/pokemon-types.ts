export enum PokemonType {
  normal = 'normal',
  fire = 'fire',
  water = 'water',
  electric = 'electric',
  grass = 'grass',
  ice = 'ice',
  fighting = 'fighting',
  poison = 'poison',
  ground = 'ground',
  flying = 'flying',
  psychic = 'psychic',
  bug = 'bug',
  rock = 'rock',
  ghost = 'ghost',
  dragon = 'dragon',
  dark = 'dark',
  steel = 'steel',
  fairy = 'fairy',
}

export enum Effectiveness {
  super_effective = 1.6,
  not_very_effective = 0.625,
  immune = 0.625 * 0.625,
  default = 1,
}

export type TypeMatchups = {
  super_effective_on: Set<PokemonType>;
  resisted_by: Set<PokemonType>;
  double_resisted_by: Set<PokemonType>;
};

export const TYPE_MATCHUPS: Record<PokemonType, TypeMatchups> = {
  [PokemonType.normal]: {
    super_effective_on: new Set(),
    resisted_by: new Set([PokemonType.rock, PokemonType.steel]),
    double_resisted_by: new Set([PokemonType.ghost]),
  },
  [PokemonType.fighting]: {
    super_effective_on: new Set([
      PokemonType.dark,
      PokemonType.ice,
      PokemonType.normal,
      PokemonType.rock,
      PokemonType.steel,
    ]),
    resisted_by: new Set([
      PokemonType.bug,
      PokemonType.fairy,
      PokemonType.flying,
      PokemonType.poison,
      PokemonType.psychic,
    ]),
    double_resisted_by: new Set([PokemonType.ghost]),
  },
  [PokemonType.flying]: {
    super_effective_on: new Set([
      PokemonType.bug,
      PokemonType.fighting,
      PokemonType.grass,
    ]),
    resisted_by: new Set([
      PokemonType.electric,
      PokemonType.rock,
      PokemonType.steel,
    ]),
    double_resisted_by: new Set(),
  },
  [PokemonType.poison]: {
    super_effective_on: new Set([PokemonType.fairy, PokemonType.grass]),
    resisted_by: new Set([
      PokemonType.ghost,
      PokemonType.ground,
      PokemonType.poison,
      PokemonType.rock,
    ]),
    double_resisted_by: new Set([PokemonType.steel]),
  },
  [PokemonType.ground]: {
    super_effective_on: new Set([
      PokemonType.electric,
      PokemonType.fire,
      PokemonType.poison,
      PokemonType.rock,
      PokemonType.steel,
    ]),
    resisted_by: new Set([PokemonType.bug, PokemonType.grass]),
    double_resisted_by: new Set([PokemonType.flying]),
  },
  [PokemonType.rock]: {
    super_effective_on: new Set([
      PokemonType.bug,
      PokemonType.fire,
      PokemonType.flying,
      PokemonType.ice,
    ]),
    resisted_by: new Set([
      PokemonType.fighting,
      PokemonType.ground,
      PokemonType.steel,
    ]),
    double_resisted_by: new Set(),
  },
  [PokemonType.bug]: {
    super_effective_on: new Set([
      PokemonType.dark,
      PokemonType.grass,
      PokemonType.psychic,
    ]),
    resisted_by: new Set([
      PokemonType.fairy,
      PokemonType.fighting,
      PokemonType.fire,
      PokemonType.flying,
      PokemonType.ghost,
      PokemonType.poison,
      PokemonType.steel,
    ]),
    double_resisted_by: new Set(),
  },
  [PokemonType.ghost]: {
    super_effective_on: new Set([PokemonType.ghost, PokemonType.psychic]),
    resisted_by: new Set([PokemonType.dark]),
    double_resisted_by: new Set([PokemonType.normal]),
  },
  [PokemonType.steel]: {
    super_effective_on: new Set([
      PokemonType.fairy,
      PokemonType.ice,
      PokemonType.rock,
    ]),
    resisted_by: new Set([
      PokemonType.electric,
      PokemonType.fire,
      PokemonType.steel,
      PokemonType.water,
    ]),
    double_resisted_by: new Set(),
  },
  [PokemonType.fire]: {
    super_effective_on: new Set([
      PokemonType.bug,
      PokemonType.grass,
      PokemonType.ice,
      PokemonType.steel,
    ]),
    resisted_by: new Set([
      PokemonType.dragon,
      PokemonType.fire,
      PokemonType.rock,
      PokemonType.water,
    ]),
    double_resisted_by: new Set(),
  },
  [PokemonType.water]: {
    super_effective_on: new Set([
      PokemonType.fire,
      PokemonType.ground,
      PokemonType.rock,
    ]),
    resisted_by: new Set([
      PokemonType.dragon,
      PokemonType.grass,
      PokemonType.water,
    ]),
    double_resisted_by: new Set(),
  },
  [PokemonType.grass]: {
    super_effective_on: new Set([
      PokemonType.ground,
      PokemonType.rock,
      PokemonType.water,
    ]),
    resisted_by: new Set([
      PokemonType.bug,
      PokemonType.dragon,
      PokemonType.fire,
      PokemonType.flying,
      PokemonType.grass,
      PokemonType.poison,
      PokemonType.steel,
    ]),
    double_resisted_by: new Set(),
  },
  [PokemonType.electric]: {
    super_effective_on: new Set([PokemonType.flying, PokemonType.water]),
    resisted_by: new Set([
      PokemonType.dragon,
      PokemonType.electric,
      PokemonType.grass,
    ]),
    double_resisted_by: new Set([PokemonType.ground]),
  },
  [PokemonType.psychic]: {
    super_effective_on: new Set([PokemonType.fighting, PokemonType.poison]),
    resisted_by: new Set([PokemonType.psychic, PokemonType.steel]),
    double_resisted_by: new Set([PokemonType.dark]),
  },
  [PokemonType.ice]: {
    super_effective_on: new Set([
      PokemonType.dragon,
      PokemonType.flying,
      PokemonType.grass,
      PokemonType.ground,
    ]),
    resisted_by: new Set([
      PokemonType.fire,
      PokemonType.ice,
      PokemonType.steel,
      PokemonType.water,
    ]),
    double_resisted_by: new Set(),
  },
  [PokemonType.dragon]: {
    super_effective_on: new Set([PokemonType.dragon]),
    resisted_by: new Set([PokemonType.steel]),
    double_resisted_by: new Set([PokemonType.fairy]),
  },
  [PokemonType.dark]: {
    super_effective_on: new Set([PokemonType.ghost, PokemonType.psychic]),
    resisted_by: new Set([
      PokemonType.dark,
      PokemonType.fairy,
      PokemonType.fighting,
    ]),
    double_resisted_by: new Set(),
  },
  [PokemonType.fairy]: {
    super_effective_on: new Set([
      PokemonType.dark,
      PokemonType.dragon,
      PokemonType.fighting,
    ]),
    resisted_by: new Set([
      PokemonType.fire,
      PokemonType.poison,
      PokemonType.steel,
    ]),
    double_resisted_by: new Set(),
  },
};

export function getTypeEffectiveness(
  attack: PokemonType,
  defense: PokemonType,
): Effectiveness {
  if (defense in TYPE_MATCHUPS[attack].super_effective_on) {
    return Effectiveness.super_effective;
  }
  if (defense in TYPE_MATCHUPS[attack].resisted_by) {
    return Effectiveness.not_very_effective;
  }
  if (defense in TYPE_MATCHUPS[attack].double_resisted_by) {
    return Effectiveness.immune;
  }

  return Effectiveness.default;
}

export function getMoveEffectiveness(
  attack: PokemonType,
  defender: PokemonType[],
) {
  let multiplier = 1;
  for (const defenseType of defender) {
    const effectiveness = getTypeEffectiveness(attack, defenseType);
    multiplier *= effectiveness;
  }
  return multiplier;
}
