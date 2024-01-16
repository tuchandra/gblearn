/**
 * parseGamemaster.ts
 *
 * tldr:
 * - invoke with `bun scripts/parseGamemaster.ts`
 * - requires bun, since we use the file writing API
 * - fetches & parses the latest GameMaster file from the Pokeminers repo
 * - (over)writes JSON to:
 *   - src/content/pokemon.json
 *   - src/content/fastMoves.json
 *   - src/content/chargedMoves.json
 *
 * Parse ... somehow.
 */

import { z } from 'zod';
import {
  PokemonSchema,
  FastMoveSchema,
  ChargedMoveSchema,
} from '../src/models';
import type { Pokemon, FastMove, ChargedMove, Move } from '../src/models';

/**
 * PHP inspiration
 * 
 * for(var i = 0; i < data.length; i++){
	var template = data[i];

	if(! template.data.pokemonSettings){
		continue;
	}

	if( (template.templateId.indexOf("NORMAL") > -1) || (template.templateId.indexOf("SHADOW") > -1) || (template.templateId.indexOf("PURIFIED") > -1)){
		continue;
	}

	// Parse out the dex number from the template Id

	var dexStr = template.templateId.split("_");
	dexStr = dexStr[0].split("V0");
	var dexNumber = parseInt(dexStr[1]);

	var settings = template.data.pokemonSettings;
	var speciesId = settings.pokemonId.toLowerCase();

	if(settings.form){
		speciesId = String(settings.form).toLowerCase();
	}

	var speciesName = speciesId[0].toUpperCase() + speciesId.substring(1);

	// Gather fast moves and charged moves

	var fastMoves = [];
	var chargedMoves = [];

	// Catch for Smeargle, which doesn't have set moves
	if(settings.quickMoves){
		for(var n = 0; n < settings.quickMoves.length; n++){
			settings.quickMoves[n] = settings.quickMoves[n].replace("_FAST","");
		}

		fastMoves = settings.quickMoves;
		chargedMoves = settings.cinematicMoves;
	}

	// Gather Poekmon types
	var types = ["none", "none"];

	if(settings.type){
		types[0] = settings.type.replace("POKEMON_TYPE_","").toLowerCase();
	}

	if(settings.type2){
		types[1] = settings.type2.replace("POKEMON_TYPE_","").toLowerCase();
	}

	var poke = {
		dex: dexNumber,
		speciesName: speciesName,
		speciesId: speciesId,
		baseStats: {
			atk: settings.stats.baseAttack,
			def: settings.stats.baseDefense,
			hp: settings.stats.baseStamina
		},
		types: types,
		fastMoves: fastMoves,
		chargedMoves: chargedMoves,
		defaultIVs: {
			cp1500: [20, 15, 15, 15],
			cp2500: [20, 15, 15, 15]
		},
		buddyDistance: settings.kmBuddyDistance,
		thirdMoveCost: settings.thirdMove.stardustToUnlock,
		released: false
	};

	pokemon.push(poke);
}
 */

/**
 * From a Pokemon template in the gamemaster.json, parse and construct the Pokemon object
 * format that we need for the app. Heavily inspired by what PVPoke does.
 */
function parsePokemonTemplate(templateData: {
  templateId: string;
  pokemonSettings: {
    pokemonId: string;
    form?: string;
    quickMoves?: string[];
    cinematicMoves?: string[];
    type?: string;
    type2?: string;
    stats: {
      baseAttack: number;
      baseDefense: number;
      baseStamina: number;
    };
  };
}): Pokemon {
  const settings = templateData.pokemonSettings;

  // templateId is a bizarre format, e.g., V0001_POKEMON_BULBASAUR
  const dexStr = templateData.templateId.split('_');
  const dexNumber = parseInt(dexStr[0].split('V')[1]);

  // Use the form as an ID if possible, since it's more granular than the species
  const speciesId =
    settings.form?.toLowerCase() || settings.pokemonId.toLowerCase();

  // This isn't even correct, but whatever
  const speciesName =
    settings.pokemonId[0].toUpperCase() +
    settings.pokemonId.toLowerCase().substring(1);

  const fastMoves =
    settings.quickMoves?.map((move) => move.replace('_FAST', '')) ?? [];
  const chargedMoves = settings.cinematicMoves ?? [];

  const types = [
    ...(settings.type
      ? [settings.type.replace('POKEMON_TYPE_', '').toLowerCase()]
      : []),
    ...(settings.type2
      ? [settings.type2.replace('POKEMON_TYPE_', '').toLowerCase()]
      : []),
  ];

  const poke: Pokemon = {
    dex: dexNumber,
    speciesName,
    speciesId,
    baseStats: {
      atk: settings.stats.baseAttack,
      def: settings.stats.baseDefense,
      hp: settings.stats.baseStamina,
    },
    types,
    fastMoves,
    chargedMoves,
    form: settings.form,
    released: undefined,
  };

  return poke;
}

async function getGamemaster() {
  const url =
    'https://raw.githubusercontent.com/PokeMiners/game_masters/master/latest/latest.json';
  const gamemaster = await fetch(url).then((res) => res.json());
  const pokemonTemplates = gamemaster
    .filter((t) => !!t.data.pokemonSettings)
    .filter(
      (t) =>
        !t.templateId.includes('NORMAL') &&
        !t.templateId.includes('SHADOW') &&
        !t.templateId.includes('PURIFIED'),
    );
  // .map((t) => t.data.pokemonSettings);

  for (const template of pokemonTemplates) {
    const pokemon = parsePokemonTemplate(template.data);
    console.log(pokemon);

    if (pokemon.dex > 150) break;
  }
}

async function main() {
  await getGamemaster();
}

main();
