import { CupName } from './models';

export type CupConfig = {
  id: CupName;
  name: string;
  maxCp: 1500 | 2500 | null;
};

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
    case CupName.fantasy:
      return {
        id: CupName.fantasy,
        name: 'Fantasy Cup',
        maxCp: 1500,
      };
    case CupName.psychic:
      return {
        id: CupName.psychic,
        name: 'Psychic Cup',
        maxCp: 1500,
      };
    case CupName.halloween:
      return {
        id: CupName.halloween,
        name: 'Halloween Cup',
        maxCp: 1500,
      };
    case CupName.fossil:
      return {
        id: CupName.fossil,
        name: 'Fossil Cup',
        maxCp: 1500,
      };
    case CupName.summer:
      return {
        id: CupName.summer,
        name: 'Summer Cup',
        maxCp: 1500,
      };
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
    default: {
      const _never: never = cup;
      throw new Error(`Unknown cup name: ${_never}`);
    }
  }
}
