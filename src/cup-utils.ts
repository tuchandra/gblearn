import { CupName } from './models';

export type CupConfig = {
  id: CupName;
  name: string;
  maxCp: 1500 | 2500 | null;
};

function magicDefaultConfig(cupId: CupName): CupConfig {
  const cupTitle = cupId[0].toUpperCase() + cupId.slice(1);
  return {
    id: cupId,
    name: `${cupTitle} Cup`,
    maxCp: 1500,
  };
}

export function cupConfig(cup: CupName): CupConfig {
  switch (cup) {
    case CupName.great:
      return {
        id: CupName.great,
        name: 'Great League',
        maxCp: 1500,
      };
    case CupName.ultra:
      return {
        id: CupName.ultra,
        name: 'Ultra League',
        maxCp: 2500,
      };
    case CupName.master:
      return {
        id: CupName.master,
        name: 'Master League',
        maxCp: null,
      };
    case CupName.remix:
      return {
        id: CupName.remix,
        name: 'Great League (Remix)',
        maxCp: 1500,
      };
    case CupName.retro:
    case CupName.fantasy:
    case CupName.color:
    case CupName.love:
    case CupName.psychic:
    case CupName.halloween:
    case CupName.fossil:
    case CupName.summer:
    case CupName.willpower:
      return magicDefaultConfig(cup);
    case CupName.premiermaster:
      return {
        id: CupName.premiermaster,
        name: 'Master League (Premier)',
        maxCp: null,
      };
    case CupName.premierultra:
      return {
        id: CupName.premierultra,
        name: 'Ultra League (Premier)',
        maxCp: 2500,
      };
    case CupName.summerultra:
      return {
        id: CupName.summerultra,
        name: 'Summer Cup (Ultra)',
        maxCp: 2500,
      };
    default: {
      const _never: never = cup;
      throw new Error(`Unknown cup name: ${_never}`);
    }
  }
}
