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
  super_effective_on: ReadonlyArray<PokemonType>;
  resisted_by: ReadonlyArray<PokemonType>;
  double_resisted_by: ReadonlyArray<PokemonType>;
};

export const TYPE_MATCHUPS: Record<PokemonType, TypeMatchups> = {
  [PokemonType.normal]: {
    super_effective_on: [],
    resisted_by: [PokemonType.rock, PokemonType.steel],
    double_resisted_by: [PokemonType.ghost],
  },
  [PokemonType.fighting]: {
    super_effective_on: [
      PokemonType.dark,
      PokemonType.ice,
      PokemonType.normal,
      PokemonType.rock,
      PokemonType.steel,
    ],
    resisted_by: [
      PokemonType.bug,
      PokemonType.fairy,
      PokemonType.flying,
      PokemonType.poison,
      PokemonType.psychic,
    ],
    double_resisted_by: [PokemonType.ghost],
  },
  [PokemonType.flying]: {
    super_effective_on: [
      PokemonType.bug,
      PokemonType.fighting,
      PokemonType.grass,
    ],
    resisted_by: [PokemonType.electric, PokemonType.rock, PokemonType.steel],
    double_resisted_by: [],
  },
  [PokemonType.poison]: {
    super_effective_on: [PokemonType.fairy, PokemonType.grass],
    resisted_by: [
      PokemonType.ghost,
      PokemonType.ground,
      PokemonType.poison,
      PokemonType.rock,
    ],
    double_resisted_by: [PokemonType.steel],
  },
  [PokemonType.ground]: {
    super_effective_on: [
      PokemonType.electric,
      PokemonType.fire,
      PokemonType.poison,
      PokemonType.rock,
      PokemonType.steel,
    ],
    resisted_by: [PokemonType.bug, PokemonType.grass],
    double_resisted_by: [PokemonType.flying],
  },
  [PokemonType.rock]: {
    super_effective_on: [
      PokemonType.bug,
      PokemonType.fire,
      PokemonType.flying,
      PokemonType.ice,
    ],
    resisted_by: [PokemonType.fighting, PokemonType.ground, PokemonType.steel],
    double_resisted_by: [],
  },
  [PokemonType.bug]: {
    super_effective_on: [
      PokemonType.dark,
      PokemonType.grass,
      PokemonType.psychic,
    ],
    resisted_by: [
      PokemonType.fairy,
      PokemonType.fighting,
      PokemonType.fire,
      PokemonType.flying,
      PokemonType.ghost,
      PokemonType.poison,
      PokemonType.steel,
    ],
    double_resisted_by: [],
  },
  [PokemonType.ghost]: {
    super_effective_on: [PokemonType.ghost, PokemonType.psychic],
    resisted_by: [PokemonType.dark],
    double_resisted_by: [PokemonType.normal],
  },
  [PokemonType.steel]: {
    super_effective_on: [PokemonType.fairy, PokemonType.ice, PokemonType.rock],
    resisted_by: [
      PokemonType.electric,
      PokemonType.fire,
      PokemonType.steel,
      PokemonType.water,
    ],
    double_resisted_by: [],
  },
  [PokemonType.fire]: {
    super_effective_on: [
      PokemonType.bug,
      PokemonType.grass,
      PokemonType.ice,
      PokemonType.steel,
    ],
    resisted_by: [
      PokemonType.dragon,
      PokemonType.fire,
      PokemonType.rock,
      PokemonType.water,
    ],
    double_resisted_by: [],
  },
  [PokemonType.water]: {
    super_effective_on: [
      PokemonType.fire,
      PokemonType.ground,
      PokemonType.rock,
    ],
    resisted_by: [PokemonType.dragon, PokemonType.grass, PokemonType.water],
    double_resisted_by: [],
  },
  [PokemonType.grass]: {
    super_effective_on: [
      PokemonType.ground,
      PokemonType.rock,
      PokemonType.water,
    ],
    resisted_by: [
      PokemonType.bug,
      PokemonType.dragon,
      PokemonType.fire,
      PokemonType.flying,
      PokemonType.grass,
      PokemonType.poison,
      PokemonType.steel,
    ],
    double_resisted_by: [],
  },
  [PokemonType.electric]: {
    super_effective_on: [PokemonType.flying, PokemonType.water],
    resisted_by: [PokemonType.dragon, PokemonType.electric, PokemonType.grass],
    double_resisted_by: [PokemonType.ground],
  },
  [PokemonType.psychic]: {
    super_effective_on: [PokemonType.fighting, PokemonType.poison],
    resisted_by: [PokemonType.psychic, PokemonType.steel],
    double_resisted_by: [PokemonType.dark],
  },
  [PokemonType.ice]: {
    super_effective_on: [
      PokemonType.dragon,
      PokemonType.flying,
      PokemonType.grass,
      PokemonType.ground,
    ],
    resisted_by: [
      PokemonType.fire,
      PokemonType.ice,
      PokemonType.steel,
      PokemonType.water,
    ],
    double_resisted_by: [],
  },
  [PokemonType.dragon]: {
    super_effective_on: [PokemonType.dragon],
    resisted_by: [PokemonType.steel],
    double_resisted_by: [PokemonType.fairy],
  },
  [PokemonType.dark]: {
    super_effective_on: [PokemonType.ghost, PokemonType.psychic],
    resisted_by: [PokemonType.dark, PokemonType.fairy, PokemonType.fighting],
    double_resisted_by: [],
  },
  [PokemonType.fairy]: {
    super_effective_on: [
      PokemonType.dark,
      PokemonType.dragon,
      PokemonType.fighting,
    ],
    resisted_by: [PokemonType.fire, PokemonType.poison, PokemonType.steel],
    double_resisted_by: [],
  },
};

export function getTypeEffectiveness(
  attack: PokemonType,
  defense: PokemonType,
): Effectiveness {
  if (TYPE_MATCHUPS[attack].super_effective_on.includes(defense)) {
    return Effectiveness.super_effective;
  }
  if (TYPE_MATCHUPS[attack].resisted_by.includes(defense)) {
    return Effectiveness.not_very_effective;
  }
  if (TYPE_MATCHUPS[attack].double_resisted_by.includes(defense)) {
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
