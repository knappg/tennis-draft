/**
 * Wimbledon 2026 static main draws (gentlemen's + ladies' singles).
 *
 * Seeds + entrants are sourced from the official draws (ATP via tennisexplorer.com,
 * WTA via wtatennis.com) so seeds are authoritative and never derived from live ranking.
 * `currentRanking` is the live ATP/WTA ranking going into the tournament (live-tennis.eu,
 * captured 2026-06-26) and is DISPLAY ONLY — never used in draft eligibility rules.
 * `apiId` is the RapidAPI (tennis-api-atp-wta-itf) player id, so drafted picks match
 * synced match results for scoring.
 *
 * GENERATED FILE — regenerate via scripts/wimbledon2026/generate.mjs, do not edit by hand.
 */
import type { TennisPlayer } from '$lib/types';
import { getPlayerImageUrl, lookupAtpPlayerId } from '$lib/data/atpPlayerIds';

export interface StaticDrawEntry {
	apiId: string;
	name: string;
	seed: number | null;
	country: string;
	currentRanking: number | null;
	/** Round-1 opponent's display name (from the official draw's bracket order). DISPLAY ONLY. */
	firstRoundOpponent: string;
}

export const WIMBLEDON_2026_ATP: StaticDrawEntry[] = [
	{
		apiId: '47275',
		name: 'Jannik Sinner',
		seed: 1,
		country: 'ITA',
		currentRanking: 1,
		firstRoundOpponent: 'Miomir Kecmanović'
	},
	{
		apiId: '34337',
		name: 'Miomir Kecmanović',
		seed: null,
		country: 'SRB',
		currentRanking: 50,
		firstRoundOpponent: 'Jannik Sinner'
	},
	{
		apiId: '31446',
		name: 'Nuno Borges',
		seed: null,
		country: 'POR',
		currentRanking: 49,
		firstRoundOpponent: 'Tristan Boyer'
	},
	{
		apiId: '56195',
		name: 'Tristan Boyer',
		seed: null,
		country: 'USA',
		currentRanking: 191,
		firstRoundOpponent: 'Nuno Borges'
	},
	{
		apiId: '28267',
		name: 'Aleksandar Vukic',
		seed: null,
		country: 'AUS',
		currentRanking: 104,
		firstRoundOpponent: 'Jenson Brooksby'
	},
	{
		apiId: '40609',
		name: 'Jenson Brooksby',
		seed: null,
		country: 'USA',
		currentRanking: 81,
		firstRoundOpponent: 'Aleksandar Vukic'
	},
	{
		apiId: '56197',
		name: 'Emilio Nava',
		seed: null,
		country: 'USA',
		currentRanking: 86,
		firstRoundOpponent: 'Ignacio Buse'
	},
	{
		apiId: '79113',
		name: 'Ignacio Buse',
		seed: 31,
		country: 'PER',
		currentRanking: 34,
		firstRoundOpponent: 'Emilio Nava'
	},
	{
		apiId: '99691',
		name: 'Rafael Jódar',
		seed: 23,
		country: 'ESP',
		currentRanking: 26,
		firstRoundOpponent: 'Felix Gill'
	},
	{
		apiId: '73608',
		name: 'Felix Gill',
		seed: null,
		country: 'GBR',
		currentRanking: 219,
		firstRoundOpponent: 'Rafael Jódar'
	},
	{
		apiId: '33502',
		name: 'Denis Shapovalov',
		seed: null,
		country: 'CAN',
		currentRanking: 41,
		firstRoundOpponent: 'Pablo Carreño Busta'
	},
	{
		apiId: '14432',
		name: 'Pablo Carreño Busta',
		seed: null,
		country: 'ESP',
		currentRanking: 70,
		firstRoundOpponent: 'Denis Shapovalov'
	},
	{
		apiId: '73742',
		name: 'Shintaro Mochizuki',
		seed: null,
		country: 'JPN',
		currentRanking: 151,
		firstRoundOpponent: 'Max Basing'
	},
	{
		apiId: '67853',
		name: 'Max Basing',
		seed: null,
		country: 'GBR',
		currentRanking: null,
		firstRoundOpponent: 'Shintaro Mochizuki'
	},
	{
		apiId: '82269',
		name: 'Ethan Quinn',
		seed: null,
		country: 'USA',
		currentRanking: 47,
		firstRoundOpponent: 'Luciano Darderi'
	},
	{
		apiId: '76127',
		name: 'Luciano Darderi',
		seed: 14,
		country: 'ITA',
		currentRanking: 16,
		firstRoundOpponent: 'Ethan Quinn'
	},
	{
		apiId: '33648',
		name: 'Casper Ruud',
		seed: 11,
		country: 'NOR',
		currentRanking: 12,
		firstRoundOpponent: 'Hubert Hurkacz'
	},
	{
		apiId: '26473',
		name: 'Hubert Hurkacz',
		seed: null,
		country: 'POL',
		currentRanking: 96,
		firstRoundOpponent: 'Casper Ruud'
	},
	{
		apiId: '79060',
		name: 'Hamad Medjedović',
		seed: null,
		country: 'SRB',
		currentRanking: 68,
		firstRoundOpponent: 'Sebastian Ofner'
	},
	{
		apiId: '27547',
		name: 'Sebastian Ofner',
		seed: null,
		country: 'AUT',
		currentRanking: 110,
		firstRoundOpponent: 'Hamad Medjedović'
	},
	{
		apiId: '28762',
		name: 'Soonwoo Kwon',
		seed: null,
		country: 'KOR',
		currentRanking: 200,
		firstRoundOpponent: 'Martin Landaluce'
	},
	{
		apiId: '94493',
		name: 'Martin Landaluce',
		seed: null,
		country: 'ESP',
		currentRanking: 59,
		firstRoundOpponent: 'Soonwoo Kwon'
	},
	{
		apiId: '28108',
		name: 'Alexandre Müller',
		seed: null,
		country: 'FRA',
		currentRanking: 126,
		firstRoundOpponent: 'Tommy Paul'
	},
	{
		apiId: '29935',
		name: 'Tommy Paul',
		seed: 21,
		country: 'USA',
		currentRanking: 24,
		firstRoundOpponent: 'Alexandre Müller'
	},
	{
		apiId: '56846',
		name: 'Brandon Nakashima',
		seed: 28,
		country: 'USA',
		currentRanking: 31,
		firstRoundOpponent: 'Jack Pinnington Jones'
	},
	{
		apiId: '79067',
		name: 'Jack Pinnington Jones',
		seed: null,
		country: 'GBR',
		currentRanking: 138,
		firstRoundOpponent: 'Brandon Nakashima'
	},
	{
		apiId: '14177',
		name: 'Jan Lennard Struff',
		seed: null,
		country: 'GER',
		currentRanking: 74,
		firstRoundOpponent: 'Sebastián Báez'
	},
	{
		apiId: '52721',
		name: 'Sebastián Báez',
		seed: null,
		country: 'ARG',
		currentRanking: 57,
		firstRoundOpponent: 'Jan Lennard Struff'
	},
	{
		apiId: '42229',
		name: 'Camilo Ugo Carabelli',
		seed: null,
		country: 'ARG',
		currentRanking: 58,
		firstRoundOpponent: 'Daniel Merida Aguilar'
	},
	{
		apiId: '83223',
		name: 'Daniel Merida Aguilar',
		seed: null,
		country: 'ESP',
		currentRanking: null,
		firstRoundOpponent: 'Camilo Ugo Carabelli'
	},
	{
		apiId: '6101',
		name: 'Marin Čilić',
		seed: null,
		country: 'CRO',
		currentRanking: 62,
		firstRoundOpponent: 'Daniil Medvedev'
	},
	{
		apiId: '22807',
		name: 'Daniil Medvedev',
		seed: 8,
		country: 'RUS',
		currentRanking: 9,
		firstRoundOpponent: 'Marin Čilić'
	},
	{
		apiId: '40434',
		name: 'Félix Auger-Aliassime',
		seed: 3,
		country: 'CAN',
		currentRanking: 4,
		firstRoundOpponent: 'Aleksandr Shevchenko'
	},
	{
		apiId: '64891',
		name: 'Aleksandr Shevchenko',
		seed: null,
		country: 'KAZ',
		currentRanking: 99,
		firstRoundOpponent: 'Félix Auger-Aliassime'
	},
	{
		apiId: '47752',
		name: 'Adam Walton',
		seed: null,
		country: 'AUS',
		currentRanking: 85,
		firstRoundOpponent: 'Dino Prižmić'
	},
	{
		apiId: '85899',
		name: 'Dino Prižmić',
		seed: null,
		country: 'CRO',
		currentRanking: 88,
		firstRoundOpponent: 'Adam Walton'
	},
	{
		apiId: '80391',
		name: 'Adolfo Daniel Vallejo',
		seed: null,
		country: 'PAR',
		currentRanking: 72,
		firstRoundOpponent: 'Nicolás Mejía'
	},
	{
		apiId: '34968',
		name: 'Nicolás Mejía',
		seed: null,
		country: 'COL',
		currentRanking: 165,
		firstRoundOpponent: 'Adolfo Daniel Vallejo'
	},
	{
		apiId: '87512',
		name: 'Michael Zheng',
		seed: null,
		country: 'USA',
		currentRanking: 144,
		firstRoundOpponent: 'Cameron Norrie'
	},
	{
		apiId: '27851',
		name: 'Cameron Norrie',
		seed: 26,
		country: 'GBR',
		currentRanking: 29,
		firstRoundOpponent: 'Michael Zheng'
	},
	{
		apiId: '36519',
		name: 'Alejandro Davidovich Fokina',
		seed: 22,
		country: 'ESP',
		currentRanking: 25,
		firstRoundOpponent: 'Juan Manuel Cerúndolo'
	},
	{
		apiId: '52934',
		name: 'Juan Manuel Cerúndolo',
		seed: null,
		country: 'ARG',
		currentRanking: 42,
		firstRoundOpponent: 'Alejandro Davidovich Fokina'
	},
	{
		apiId: '52394',
		name: 'Thiago Agustín Tirante',
		seed: null,
		country: 'ARG',
		currentRanking: 55,
		firstRoundOpponent: 'Fábián Marozsán'
	},
	{
		apiId: '52140',
		name: 'Fábián Marozsán',
		seed: null,
		country: 'HUN',
		currentRanking: 53,
		firstRoundOpponent: 'Thiago Agustín Tirante'
	},
	{
		apiId: '82371',
		name: 'Luca Van Assche',
		seed: null,
		country: 'FRA',
		currentRanking: 80,
		firstRoundOpponent: 'Márton Fucsovics'
	},
	{
		apiId: '13674',
		name: 'Márton Fucsovics',
		seed: null,
		country: 'HUN',
		currentRanking: 76,
		firstRoundOpponent: 'Luca Van Assche'
	},
	{
		apiId: '63299',
		name: 'Dalibor Svrčina',
		seed: null,
		country: 'CZE',
		currentRanking: 112,
		firstRoundOpponent: 'Learner Tien'
	},
	{
		apiId: '93452',
		name: 'Learner Tien',
		seed: 16,
		country: 'USA',
		currentRanking: 17,
		firstRoundOpponent: 'Dalibor Svrčina'
	},
	{
		apiId: '29372',
		name: 'Andrey Rublev',
		seed: 12,
		country: 'RUS',
		currentRanking: 13,
		firstRoundOpponent: 'Roman Safiullin'
	},
	{
		apiId: '28900',
		name: 'Roman Safiullin',
		seed: null,
		country: 'RUS',
		currentRanking: 132,
		firstRoundOpponent: 'Andrey Rublev'
	},
	{
		apiId: '39152',
		name: 'Aleksandar Kovačević',
		seed: null,
		country: 'USA',
		currentRanking: 69,
		firstRoundOpponent: 'Botic van de Zandschulp'
	},
	{
		apiId: '24249',
		name: 'Botic van de Zandschulp',
		seed: null,
		country: 'NED',
		currentRanking: 54,
		firstRoundOpponent: 'Aleksandar Kovačević'
	},
	{
		apiId: '59166',
		name: 'Jesper de Jong',
		seed: null,
		country: 'NED',
		currentRanking: 73,
		firstRoundOpponent: 'Rinky Hijikata'
	},
	{
		apiId: '58149',
		name: 'Rinky Hijikata',
		seed: null,
		country: 'AUS',
		currentRanking: 82,
		firstRoundOpponent: 'Jesper de Jong'
	},
	{
		apiId: '1837',
		name: 'Roberto Bautista Agut',
		seed: null,
		country: 'ESP',
		currentRanking: 183,
		firstRoundOpponent: 'João Fonseca'
	},
	{
		apiId: '91521',
		name: 'João Fonseca',
		seed: 24,
		country: 'BRA',
		currentRanking: 27,
		firstRoundOpponent: 'Roberto Bautista Agut'
	},
	{
		apiId: '28170',
		name: 'Arthur Rinderknech',
		seed: 25,
		country: 'FRA',
		currentRanking: 28,
		firstRoundOpponent: 'Oliver Tarvet'
	},
	{
		apiId: '87767',
		name: 'Oliver Tarvet',
		seed: null,
		country: 'GBR',
		currentRanking: null,
		firstRoundOpponent: 'Arthur Rinderknech'
	},
	{
		apiId: '12653',
		name: 'Marco Trungelliti',
		seed: null,
		country: 'ARG',
		currentRanking: 94,
		firstRoundOpponent: 'Martin Damm'
	},
	{
		apiId: '72574',
		name: 'Martin Damm',
		seed: null,
		country: 'USA',
		currentRanking: 106,
		firstRoundOpponent: 'Marco Trungelliti'
	},
	{
		apiId: '46747',
		name: 'Hugo Gaston',
		seed: null,
		country: 'FRA',
		currentRanking: 118,
		firstRoundOpponent: 'Stefanos Tsitsipas'
	},
	{
		apiId: '30470',
		name: 'Stefanos Tsitsipas',
		seed: null,
		country: 'GRE',
		currentRanking: 87,
		firstRoundOpponent: 'Hugo Gaston'
	},
	{
		apiId: '39310',
		name: 'Yibing Wu',
		seed: null,
		country: 'CHN',
		currentRanking: 102,
		firstRoundOpponent: 'Novak Djoković'
	},
	{
		apiId: '5992',
		name: 'Novak Djoković',
		seed: 7,
		country: 'SRB',
		currentRanking: 7,
		firstRoundOpponent: 'Yibing Wu'
	},
	{
		apiId: '39309',
		name: 'Alex de Minaur',
		seed: 5,
		country: 'AUS',
		currentRanking: 6,
		firstRoundOpponent: 'Román Andrés Burruchaga'
	},
	{
		apiId: '70705',
		name: 'Román Andrés Burruchaga',
		seed: null,
		country: 'ARG',
		currentRanking: 65,
		firstRoundOpponent: 'Alex de Minaur'
	},
	{
		apiId: '7806',
		name: 'Adrian Mannarino',
		seed: null,
		country: 'FRA',
		currentRanking: 40,
		firstRoundOpponent: 'Titouan Droguet'
	},
	{
		apiId: '59092',
		name: 'Titouan Droguet',
		seed: null,
		country: 'FRA',
		currentRanking: 116,
		firstRoundOpponent: 'Adrian Mannarino'
	},
	{
		apiId: '72578',
		name: 'Mattia Bellucci',
		seed: null,
		country: 'ITA',
		currentRanking: 67,
		firstRoundOpponent: 'Zachary Svajda'
	},
	{
		apiId: '73620',
		name: 'Zachary Svajda',
		seed: null,
		country: 'USA',
		currentRanking: 66,
		firstRoundOpponent: 'Mattia Bellucci'
	},
	{
		apiId: '28898',
		name: 'Kamil Majchrzak',
		seed: null,
		country: 'POL',
		currentRanking: 45,
		firstRoundOpponent: 'Alejandro Tabilo'
	},
	{
		apiId: '30087',
		name: 'Alejandro Tabilo',
		seed: 30,
		country: 'CHI',
		currentRanking: 33,
		firstRoundOpponent: 'Kamil Majchrzak'
	},
	{
		apiId: '25543',
		name: 'Karen Khachanov',
		seed: 19,
		country: 'RUS',
		currentRanking: 22,
		firstRoundOpponent: 'Billy Harris'
	},
	{
		apiId: '29180',
		name: 'Billy Harris',
		seed: null,
		country: 'GBR',
		currentRanking: 155,
		firstRoundOpponent: 'Karen Khachanov'
	},
	{
		apiId: '14856',
		name: 'Yannick Hanfmann',
		seed: null,
		country: 'GER',
		currentRanking: 56,
		firstRoundOpponent: 'Giovanni Mpetshi Perricard'
	},
	{
		apiId: '71174',
		name: 'Giovanni Mpetshi Perricard',
		seed: null,
		country: 'FRA',
		currentRanking: 83,
		firstRoundOpponent: 'Yannick Hanfmann'
	},
	{
		apiId: '33860',
		name: 'Tallon Griekspoor',
		seed: null,
		country: 'NED',
		currentRanking: 60,
		firstRoundOpponent: 'James Duckworth'
	},
	{
		apiId: '11517',
		name: 'James Duckworth',
		seed: null,
		country: 'AUS',
		currentRanking: 79,
		firstRoundOpponent: 'Tallon Griekspoor'
	},
	{
		apiId: '66828',
		name: 'Mariano Navone',
		seed: null,
		country: 'ARG',
		currentRanking: 38,
		firstRoundOpponent: 'Flavio Cobolli'
	},
	{
		apiId: '67546',
		name: 'Flavio Cobolli',
		seed: 9,
		country: 'ITA',
		currentRanking: 10,
		firstRoundOpponent: 'Mariano Navone'
	},
	{
		apiId: '86691',
		name: 'Jakub Menšík',
		seed: 15,
		country: 'CZE',
		currentRanking: 18,
		firstRoundOpponent: 'Toby Samuel'
	},
	{
		apiId: '79068',
		name: 'Toby Samuel',
		seed: null,
		country: 'GBR',
		currentRanking: 123,
		firstRoundOpponent: 'Jakub Menšík'
	},
	{
		apiId: '56590',
		name: 'Dane Sweeny',
		seed: null,
		country: 'AUS',
		currentRanking: 127,
		firstRoundOpponent: 'Grigor Dimitrov'
	},
	{
		apiId: '11953',
		name: 'Grigor Dimitrov',
		seed: null,
		country: 'BUL',
		currentRanking: 146,
		firstRoundOpponent: 'Dane Sweeny'
	},
	{
		apiId: '1092',
		name: 'Stan Wawrinka',
		seed: null,
		country: 'SUI',
		currentRanking: 109,
		firstRoundOpponent: 'Matteo Berrettini'
	},
	{
		apiId: '29812',
		name: 'Matteo Berrettini',
		seed: null,
		country: 'ITA',
		currentRanking: 51,
		firstRoundOpponent: 'Stan Wawrinka'
	},
	{
		apiId: '84235',
		name: 'Raphaël Collignon',
		seed: null,
		country: 'BEL',
		currentRanking: 43,
		firstRoundOpponent: 'Arthur Fils'
	},
	{
		apiId: '83135',
		name: 'Arthur Fils',
		seed: 20,
		country: 'FRA',
		currentRanking: 23,
		firstRoundOpponent: 'Raphaël Collignon'
	},
	{
		apiId: '38911',
		name: 'Ugo Humbert',
		seed: 27,
		country: 'FRA',
		currentRanking: 30,
		firstRoundOpponent: 'Zizou Bergs'
	},
	{
		apiId: '37741',
		name: 'Zizou Bergs',
		seed: null,
		country: 'BEL',
		currentRanking: 37,
		firstRoundOpponent: 'Ugo Humbert'
	},
	{
		apiId: '39863',
		name: 'Sho Shimabukuro',
		seed: null,
		country: 'JPN',
		currentRanking: 89,
		firstRoundOpponent: 'Jaime Faria'
	},
	{
		apiId: '83795',
		name: 'Jaime Faria',
		seed: null,
		country: 'POR',
		currentRanking: 98,
		firstRoundOpponent: 'Sho Shimabukuro'
	},
	{
		apiId: '13447',
		name: 'Damir Džumhur',
		seed: null,
		country: 'BIH',
		currentRanking: 105,
		firstRoundOpponent: 'Arthur Fery'
	},
	{
		apiId: '79065',
		name: 'Arthur Fery',
		seed: null,
		country: 'GBR',
		currentRanking: 114,
		firstRoundOpponent: 'Damir Džumhur'
	},
	{
		apiId: '55252',
		name: 'Otto Virtanen',
		seed: null,
		country: 'FIN',
		currentRanking: 140,
		firstRoundOpponent: 'Ben Shelton'
	},
	{
		apiId: '87562',
		name: 'Ben Shelton',
		seed: 4,
		country: 'USA',
		currentRanking: 5,
		firstRoundOpponent: 'Otto Virtanen'
	},
	{
		apiId: '29932',
		name: 'Taylor Fritz',
		seed: 6,
		country: 'USA',
		currentRanking: 8,
		firstRoundOpponent: 'Jack Draper'
	},
	{
		apiId: '63017',
		name: 'Jack Draper',
		seed: null,
		country: 'GBR',
		currentRanking: 131,
		firstRoundOpponent: 'Taylor Fritz'
	},
	{
		apiId: '46718',
		name: 'Patrick Kypson',
		seed: null,
		country: 'USA',
		currentRanking: 113,
		firstRoundOpponent: 'Mackenzie McDonald'
	},
	{
		apiId: '18094',
		name: 'Mackenzie McDonald',
		seed: null,
		country: 'USA',
		currentRanking: 145,
		firstRoundOpponent: 'Patrick Kypson'
	},
	{
		apiId: '28899',
		name: 'Benjamin Bonzi',
		seed: null,
		country: 'FRA',
		currentRanking: 93,
		firstRoundOpponent: 'Gabriel Diallo'
	},
	{
		apiId: '68627',
		name: 'Gabriel Diallo',
		seed: null,
		country: 'CAN',
		currentRanking: 91,
		firstRoundOpponent: 'Benjamin Bonzi'
	},
	{
		apiId: '31392',
		name: 'Lorenzo Sonego',
		seed: null,
		country: 'ITA',
		currentRanking: 71,
		firstRoundOpponent: 'Tomás Martín Etcheverry'
	},
	{
		apiId: '37532',
		name: 'Tomás Martín Etcheverry',
		seed: 29,
		country: 'ARG',
		currentRanking: 32,
		firstRoundOpponent: 'Lorenzo Sonego'
	},
	{
		apiId: '29939',
		name: 'Frances Tiafoe',
		seed: 17,
		country: 'USA',
		currentRanking: 19,
		firstRoundOpponent: 'Térence Atmane'
	},
	{
		apiId: '67535',
		name: 'Térence Atmane',
		seed: null,
		country: 'FRA',
		currentRanking: 52,
		firstRoundOpponent: 'Frances Tiafoe'
	},
	{
		apiId: '42971',
		name: 'Vít Kopřiva',
		seed: null,
		country: 'CZE',
		currentRanking: 64,
		firstRoundOpponent: 'Jan Choinski'
	},
	{
		apiId: '26421',
		name: 'Jan Choinski',
		seed: null,
		country: 'GBR',
		currentRanking: 100,
		firstRoundOpponent: 'Vít Kopřiva'
	},
	{
		apiId: '65904',
		name: 'Kyrian Jacquet',
		seed: null,
		country: 'FRA',
		currentRanking: 139,
		firstRoundOpponent: 'Vilius Gaubas'
	},
	{
		apiId: '79088',
		name: 'Vilius Gaubas',
		seed: null,
		country: 'LTU',
		currentRanking: 129,
		firstRoundOpponent: 'Kyrian Jacquet'
	},
	{
		apiId: '22432',
		name: 'Thanasi Kokkinakis',
		seed: null,
		country: 'AUS',
		currentRanking: null,
		firstRoundOpponent: 'Alexander Bublik'
	},
	{
		apiId: '24245',
		name: 'Alexander Bublik',
		seed: 10,
		country: 'KAZ',
		currentRanking: 11,
		firstRoundOpponent: 'Thanasi Kokkinakis'
	},
	{
		apiId: '61838',
		name: 'Jiří Lehečka',
		seed: 13,
		country: 'CZE',
		currentRanking: 14,
		firstRoundOpponent: 'Alexei Popyrin'
	},
	{
		apiId: '34233',
		name: 'Alexei Popyrin',
		seed: null,
		country: 'AUS',
		currentRanking: 103,
		firstRoundOpponent: 'Jiří Lehečka'
	},
	{
		apiId: '34539',
		name: 'Alex Molčan',
		seed: null,
		country: 'SVK',
		currentRanking: 101,
		firstRoundOpponent: 'Daniel Altmaier'
	},
	{
		apiId: '29732',
		name: 'Daniel Altmaier',
		seed: null,
		country: 'GER',
		currentRanking: 61,
		firstRoundOpponent: 'Alex Molčan'
	},
	{
		apiId: '92985',
		name: 'Alex Michelsen',
		seed: null,
		country: 'USA',
		currentRanking: 46,
		firstRoundOpponent: 'Jacob Fearnley'
	},
	{
		apiId: '68090',
		name: 'Jacob Fearnley',
		seed: null,
		country: 'GBR',
		currentRanking: 159,
		firstRoundOpponent: 'Alex Michelsen'
	},
	{
		apiId: '31358',
		name: 'Jaume Antoni Munar Clar',
		seed: null,
		country: 'ESP',
		currentRanking: null,
		firstRoundOpponent: 'Francisco Cerúndolo'
	},
	{
		apiId: '52279',
		name: 'Francisco Cerúndolo',
		seed: 18,
		country: 'ARG',
		currentRanking: 21,
		firstRoundOpponent: 'Jaume Antoni Munar Clar'
	},
	{
		apiId: '73956',
		name: 'Matteo Arnaldi',
		seed: 32,
		country: 'ITA',
		currentRanking: 35,
		firstRoundOpponent: 'Quentin Halys'
	},
	{
		apiId: '25171',
		name: 'Quentin Halys',
		seed: null,
		country: 'FRA',
		currentRanking: 95,
		firstRoundOpponent: 'Matteo Arnaldi'
	},
	{
		apiId: '36263',
		name: 'Corentin Moutet',
		seed: null,
		country: 'FRA',
		currentRanking: 39,
		firstRoundOpponent: 'Marcos Giron'
	},
	{
		apiId: '18736',
		name: 'Marcos Giron',
		seed: null,
		country: 'USA',
		currentRanking: 92,
		firstRoundOpponent: 'Corentin Moutet'
	},
	{
		apiId: '61857',
		name: 'Valentin Royer',
		seed: null,
		country: 'FRA',
		currentRanking: 75,
		firstRoundOpponent: 'Harry Wendelken'
	},
	{
		apiId: '65558',
		name: 'Harry Wendelken',
		seed: null,
		country: 'GBR',
		currentRanking: 202,
		firstRoundOpponent: 'Valentin Royer'
	},
	{
		apiId: '88766',
		name: 'Alexander Blockx',
		seed: null,
		country: 'BEL',
		currentRanking: 36,
		firstRoundOpponent: 'Alexander Zverev'
	},
	{
		apiId: '24008',
		name: 'Alexander Zverev',
		seed: 2,
		country: 'GER',
		currentRanking: 3,
		firstRoundOpponent: 'Alexander Blockx'
	}
];

export const WIMBLEDON_2026_WTA: StaticDrawEntry[] = [
	{
		apiId: '18455',
		name: 'Aryna Sabalenka',
		seed: 1,
		country: 'BLR',
		currentRanking: 1,
		firstRoundOpponent: 'Teodora Kostović'
	},
	{
		apiId: '87188',
		name: 'Teodora Kostović',
		seed: null,
		country: 'SRB',
		currentRanking: 184,
		firstRoundOpponent: 'Aryna Sabalenka'
	},
	{
		apiId: '51696',
		name: 'Oleksandra Oliynykova',
		seed: null,
		country: 'UKR',
		currentRanking: 53,
		firstRoundOpponent: 'Mccartney Kessler'
	},
	{
		apiId: '48900',
		name: 'Mccartney Kessler',
		seed: null,
		country: 'USA',
		currentRanking: 57,
		firstRoundOpponent: 'Oleksandra Oliynykova'
	},
	{
		apiId: '16628',
		name: 'Jeļena Ostapenko',
		seed: null,
		country: 'LAT',
		currentRanking: 31,
		firstRoundOpponent: 'Harriet Dart'
	},
	{
		apiId: '14609',
		name: 'Harriet Dart',
		seed: null,
		country: 'GBR',
		currentRanking: 152,
		firstRoundOpponent: 'Jeļena Ostapenko'
	},
	{
		apiId: '65417',
		name: 'Antonia Ružić',
		seed: null,
		country: 'CRO',
		currentRanking: 61,
		firstRoundOpponent: 'Emma Raducanu'
	},
	{
		apiId: '53487',
		name: 'Emma Raducanu',
		seed: 30,
		country: 'GBR',
		currentRanking: 33,
		firstRoundOpponent: 'Antonia Ružić'
	},
	{
		apiId: '49081',
		name: 'Leylah Fernandez',
		seed: 22,
		country: 'CAN',
		currentRanking: 23,
		firstRoundOpponent: 'Janice Tjen'
	},
	{
		apiId: '60341',
		name: 'Janice Tjen',
		seed: null,
		country: 'INA',
		currentRanking: 42,
		firstRoundOpponent: 'Leylah Fernandez'
	},
	{
		apiId: '74254',
		name: 'Mingge Xu',
		seed: null,
		country: 'GBR',
		currentRanking: null,
		firstRoundOpponent: 'Daria Kasatkina'
	},
	{
		apiId: '17503',
		name: 'Daria Kasatkina',
		seed: null,
		country: 'AUS',
		currentRanking: 65,
		firstRoundOpponent: 'Mingge Xu'
	},
	{
		apiId: '29385',
		name: 'Anastasia Gasanova',
		seed: null,
		country: 'RUS',
		currentRanking: 225,
		firstRoundOpponent: 'Emiliana Arango'
	},
	{
		apiId: '39540',
		name: 'Emiliana Arango',
		seed: null,
		country: 'COL',
		currentRanking: 97,
		firstRoundOpponent: 'Anastasia Gasanova'
	},
	{
		apiId: '57147',
		name: 'Elsa Jacquemot',
		seed: null,
		country: 'FRA',
		currentRanking: 80,
		firstRoundOpponent: 'Naomi Osaka'
	},
	{
		apiId: '16430',
		name: 'Naomi Osaka',
		seed: 14,
		country: 'JPN',
		currentRanking: 14,
		firstRoundOpponent: 'Elsa Jacquemot'
	},
	{
		apiId: '18482',
		name: 'Karolína Muchová',
		seed: 10,
		country: 'CZE',
		currentRanking: 10,
		firstRoundOpponent: 'Anastasia Zakharova'
	},
	{
		apiId: '52660',
		name: 'Anastasia Zakharova',
		seed: null,
		country: 'RUS',
		currentRanking: 85,
		firstRoundOpponent: 'Karolína Muchová'
	},
	{
		apiId: '39226',
		name: 'Bianca Andreescu',
		seed: null,
		country: 'CAN',
		currentRanking: 180,
		firstRoundOpponent: 'Shuai Zhang'
	},
	{
		apiId: '4263',
		name: 'Shuai Zhang',
		seed: null,
		country: 'CHN',
		currentRanking: 64,
		firstRoundOpponent: 'Bianca Andreescu'
	},
	{
		apiId: '45540',
		name: 'Alycia Parks',
		seed: null,
		country: 'USA',
		currentRanking: 81,
		firstRoundOpponent: 'Alicia Dudeney'
	},
	{
		apiId: '74253',
		name: 'Alicia Dudeney',
		seed: null,
		country: 'GBR',
		currentRanking: 245,
		firstRoundOpponent: 'Alycia Parks'
	},
	{
		apiId: '49995',
		name: 'Mananchaya Sawangkaew',
		seed: null,
		country: 'THA',
		currentRanking: 164,
		firstRoundOpponent: 'Maja Chwalińska'
	},
	{
		apiId: '43323',
		name: 'Maja Chwalińska',
		seed: 20,
		country: 'POL',
		currentRanking: 21,
		firstRoundOpponent: 'Mananchaya Sawangkaew'
	},
	{
		apiId: '17501',
		name: 'Kateřina Siniaková',
		seed: 32,
		country: 'CZE',
		currentRanking: 36,
		firstRoundOpponent: 'Qinwen Zheng'
	},
	{
		apiId: '53128',
		name: 'Qinwen Zheng',
		seed: null,
		country: 'CHN',
		currentRanking: 138,
		firstRoundOpponent: 'Kateřina Siniaková'
	},
	{
		apiId: '53793',
		name: 'Peyton Stearns',
		seed: null,
		country: 'USA',
		currentRanking: 63,
		firstRoundOpponent: 'Nikola Bartůňková'
	},
	{
		apiId: '71092',
		name: 'Nikola Bartůňková',
		seed: null,
		country: 'CZE',
		currentRanking: 48,
		firstRoundOpponent: 'Peyton Stearns'
	},
	{
		apiId: '13267',
		name: 'Barbora Krejčíková',
		seed: null,
		country: 'CZE',
		currentRanking: 38,
		firstRoundOpponent: 'Hannah Klugman'
	},
	{
		apiId: '80418',
		name: 'Hannah Klugman',
		seed: null,
		country: 'GBR',
		currentRanking: null,
		firstRoundOpponent: 'Barbora Krejčíková'
	},
	{
		apiId: '9357',
		name: 'Magda Linette',
		seed: null,
		country: 'POL',
		currentRanking: 59,
		firstRoundOpponent: 'Mirra Andreeva'
	},
	{
		apiId: '77934',
		name: 'Mirra Andreeva',
		seed: 5,
		country: 'RUS',
		currentRanking: 5,
		firstRoundOpponent: 'Magda Linette'
	},
	{
		apiId: '11712',
		name: 'Jessica Pegula',
		seed: 4,
		country: 'USA',
		currentRanking: 4,
		firstRoundOpponent: 'Darja Viďmanová'
	},
	{
		apiId: '61710',
		name: 'Darja Viďmanová',
		seed: null,
		country: 'CZE',
		currentRanking: 92,
		firstRoundOpponent: 'Jessica Pegula'
	},
	{
		apiId: '13839',
		name: 'Sara Sorribes Tormo',
		seed: null,
		country: 'ESP',
		currentRanking: null,
		firstRoundOpponent: 'Victoria Jimenez Kasintseva'
	},
	{
		apiId: '70327',
		name: 'Victoria Jimenez Kasintseva',
		seed: null,
		country: 'AND',
		currentRanking: 110,
		firstRoundOpponent: 'Sara Sorribes Tormo'
	},
	{
		apiId: '37266',
		name: 'Dayana Yastremska',
		seed: null,
		country: 'UKR',
		currentRanking: 67,
		firstRoundOpponent: 'Aoi Ito'
	},
	{
		apiId: '61481',
		name: 'Aoi Ito',
		seed: null,
		country: 'JPN',
		currentRanking: 228,
		firstRoundOpponent: 'Dayana Yastremska'
	},
	{
		apiId: '57090',
		name: 'Jéssica Bouzas Maneiro',
		seed: null,
		country: 'ESP',
		currentRanking: 52,
		firstRoundOpponent: 'Anastasia Potapova'
	},
	{
		apiId: '40156',
		name: 'Anastasia Potapova',
		seed: 27,
		country: 'AUT',
		currentRanking: 28,
		firstRoundOpponent: 'Jéssica Bouzas Maneiro'
	},
	{
		apiId: '14054',
		name: 'Ekaterina Alexandrova',
		seed: 18,
		country: 'RUS',
		currentRanking: 19,
		firstRoundOpponent: 'Panna Udvardy'
	},
	{
		apiId: '43866',
		name: 'Panna Udvardy',
		seed: null,
		country: 'HUN',
		currentRanking: 69,
		firstRoundOpponent: 'Ekaterina Alexandrova'
	},
	{
		apiId: '66626',
		name: 'Lanlana Tararudee',
		seed: null,
		country: 'THA',
		currentRanking: 99,
		firstRoundOpponent: 'Lilli Tagger'
	},
	{
		apiId: '79778',
		name: 'Lilli Tagger',
		seed: null,
		country: 'AUT',
		currentRanking: 82,
		firstRoundOpponent: 'Lanlana Tararudee'
	},
	{
		apiId: '12390',
		name: 'Yulia Putintseva',
		seed: null,
		country: 'KAZ',
		currentRanking: 84,
		firstRoundOpponent: 'Tatjana Maria'
	},
	{
		apiId: '4110',
		name: 'Tatjana Maria',
		seed: null,
		country: 'GER',
		currentRanking: 96,
		firstRoundOpponent: 'Yulia Putintseva'
	},
	{
		apiId: '17614',
		name: 'Jaqueline Cristian',
		seed: null,
		country: 'ROU',
		currentRanking: 37,
		firstRoundOpponent: 'Iva Jovic'
	},
	{
		apiId: '80381',
		name: 'Iva Jovic',
		seed: 16,
		country: 'USA',
		currentRanking: 16,
		firstRoundOpponent: 'Jaqueline Cristian'
	},
	{
		apiId: '14056',
		name: 'Belinda Bencic',
		seed: 11,
		country: 'SUI',
		currentRanking: 11,
		firstRoundOpponent: 'Mika Stojsavljevic'
	},
	{
		apiId: '84425',
		name: 'Mika Stojsavljevic',
		seed: null,
		country: 'GBR',
		currentRanking: null,
		firstRoundOpponent: 'Belinda Bencic'
	},
	{
		apiId: '47152',
		name: 'Xinyu Wang',
		seed: null,
		country: 'CHN',
		currentRanking: 39,
		firstRoundOpponent: 'Elisabetta Cocciaretto'
	},
	{
		apiId: '54664',
		name: 'Elisabetta Cocciaretto',
		seed: null,
		country: 'ITA',
		currentRanking: 46,
		firstRoundOpponent: 'Xinyu Wang'
	},
	{
		apiId: '38210',
		name: 'Francesca Jones',
		seed: null,
		country: 'GBR',
		currentRanking: 106,
		firstRoundOpponent: 'Diane Parry'
	},
	{
		apiId: '51151',
		name: 'Diane Parry',
		seed: null,
		country: 'FRA',
		currentRanking: 49,
		firstRoundOpponent: 'Francesca Jones'
	},
	{
		apiId: '17155',
		name: 'Magdalena Fręch',
		seed: null,
		country: 'POL',
		currentRanking: 44,
		firstRoundOpponent: 'Anna Kalinskaya'
	},
	{
		apiId: '32480',
		name: 'Anna Kalinskaya',
		seed: 19,
		country: 'RUS',
		currentRanking: 20,
		firstRoundOpponent: 'Magdalena Fręch'
	},
	{
		apiId: '45866',
		name: 'Ann Li',
		seed: 28,
		country: 'USA',
		currentRanking: 29,
		firstRoundOpponent: 'Zeynep Sönmez'
	},
	{
		apiId: '49991',
		name: 'Zeynep Sönmez',
		seed: null,
		country: 'TUR',
		currentRanking: 51,
		firstRoundOpponent: 'Ann Li'
	},
	{
		apiId: '27804',
		name: 'Claire Liu',
		seed: null,
		country: 'USA',
		currentRanking: 146,
		firstRoundOpponent: 'Hanne Vandewinkel'
	},
	{
		apiId: '73836',
		name: 'Hanne Vandewinkel',
		seed: null,
		country: 'BEL',
		currentRanking: 103,
		firstRoundOpponent: 'Claire Liu'
	},
	{
		apiId: '61881',
		name: 'Solana Sierra',
		seed: null,
		country: 'ARG',
		currentRanking: 56,
		firstRoundOpponent: 'Anna Bondár'
	},
	{
		apiId: '31728',
		name: 'Anna Bondár',
		seed: null,
		country: 'HUN',
		currentRanking: 74,
		firstRoundOpponent: 'Solana Sierra'
	},
	{
		apiId: '14694',
		name: 'Tamara Korpatsch',
		seed: null,
		country: 'GER',
		currentRanking: 78,
		firstRoundOpponent: 'Coco Gauff'
	},
	{
		apiId: '54663',
		name: 'Coco Gauff',
		seed: 7,
		country: 'USA',
		currentRanking: 7,
		firstRoundOpponent: 'Tamara Korpatsch'
	},
	{
		apiId: '11371',
		name: 'Elina Svitolina',
		seed: 8,
		country: 'UKR',
		currentRanking: 8,
		firstRoundOpponent: 'Daria Snigur'
	},
	{
		apiId: '55173',
		name: 'Daria Snigur',
		seed: null,
		country: 'UKR',
		currentRanking: 77,
		firstRoundOpponent: 'Elina Svitolina'
	},
	{
		apiId: '54393',
		name: 'Veronika Erjavec',
		seed: null,
		country: 'SLO',
		currentRanking: 89,
		firstRoundOpponent: 'Léolia Jeanjean'
	},
	{
		apiId: '11959',
		name: 'Léolia Jeanjean',
		seed: null,
		country: 'FRA',
		currentRanking: 132,
		firstRoundOpponent: 'Veronika Erjavec'
	},
	{
		apiId: '9503',
		name: 'Ajla Tomljanović',
		seed: null,
		country: 'AUS',
		currentRanking: 94,
		firstRoundOpponent: 'Mariam Bolkvadze'
	},
	{
		apiId: '18197',
		name: 'Mariam Bolkvadze',
		seed: null,
		country: 'GEO',
		currentRanking: null,
		firstRoundOpponent: 'Ajla Tomljanović'
	},
	{
		apiId: '64343',
		name: 'Ashlyn Krueger',
		seed: null,
		country: 'USA',
		currentRanking: 102,
		firstRoundOpponent: 'Donna Vekić'
	},
	{
		apiId: '13498',
		name: 'Donna Vekić',
		seed: 31,
		country: 'CRO',
		currentRanking: 34,
		firstRoundOpponent: 'Ashlyn Krueger'
	},
	{
		apiId: '42098',
		name: 'Emma Navarro',
		seed: 23,
		country: 'USA',
		currentRanking: 25,
		firstRoundOpponent: 'Paula Badosa'
	},
	{
		apiId: '17142',
		name: 'Paula Badosa',
		seed: null,
		country: 'ESP',
		currentRanking: 141,
		firstRoundOpponent: 'Emma Navarro'
	},
	{
		apiId: '59448',
		name: 'Oksana Selekhmeteva',
		seed: null,
		country: 'ESP',
		currentRanking: 91,
		firstRoundOpponent: 'Sinja Kraus'
	},
	{
		apiId: '50943',
		name: 'Sinja Kraus',
		seed: null,
		country: 'AUT',
		currentRanking: 93,
		firstRoundOpponent: 'Oksana Selekhmeteva'
	},
	{
		apiId: '41888',
		name: 'Yulia Starodubtseva',
		seed: null,
		country: 'UKR',
		currentRanking: 55,
		firstRoundOpponent: 'Anna Blinkova'
	},
	{
		apiId: '34747',
		name: 'Anna Blinkova',
		seed: null,
		country: 'RUS',
		currentRanking: 114,
		firstRoundOpponent: 'Yulia Starodubtseva'
	},
	{
		apiId: '14448',
		name: 'Nadia Podoroska',
		seed: null,
		country: 'ARG',
		currentRanking: null,
		firstRoundOpponent: 'Marta Kostyuk'
	},
	{
		apiId: '47742',
		name: 'Marta Kostyuk',
		seed: 12,
		country: 'UKR',
		currentRanking: 13,
		firstRoundOpponent: 'Nadia Podoroska'
	},
	{
		apiId: '14362',
		name: 'Jasmine Paolini',
		seed: 13,
		country: 'ITA',
		currentRanking: 17,
		firstRoundOpponent: 'Robin Montgomery'
	},
	{
		apiId: '64341',
		name: 'Robin Montgomery',
		seed: null,
		country: 'USA',
		currentRanking: 195,
		firstRoundOpponent: 'Jasmine Paolini'
	},
	{
		apiId: '18454',
		name: 'Iryna Shymanovich',
		seed: null,
		country: 'BLR',
		currentRanking: 213,
		firstRoundOpponent: 'Viktorija Golubic'
	},
	{
		apiId: '10749',
		name: 'Viktorija Golubic',
		seed: null,
		country: 'SUI',
		currentRanking: 62,
		firstRoundOpponent: 'Iryna Shymanovich'
	},
	{
		apiId: '16043',
		name: 'Anhelina Kalinina',
		seed: null,
		country: 'UKR',
		currentRanking: 66,
		firstRoundOpponent: 'Kamilla Rakhimova'
	},
	{
		apiId: '45072',
		name: 'Kamilla Rakhimova',
		seed: null,
		country: 'UZB',
		currentRanking: 70,
		firstRoundOpponent: 'Anhelina Kalinina'
	},
	{
		apiId: '13541',
		name: 'Maria Sakkari',
		seed: null,
		country: 'GRE',
		currentRanking: 43,
		firstRoundOpponent: 'Clara Tauson'
	},
	{
		apiId: '54989',
		name: 'Clara Tauson',
		seed: 24,
		country: 'DEN',
		currentRanking: 24,
		firstRoundOpponent: 'Maria Sakkari'
	},
	{
		apiId: '67792',
		name: 'Alexandra Eala',
		seed: 29,
		country: 'PHI',
		currentRanking: 32,
		firstRoundOpponent: 'Renata Zarazúa'
	},
	{
		apiId: '18403',
		name: 'Renata Zarazúa',
		seed: null,
		country: 'MEX',
		currentRanking: 75,
		firstRoundOpponent: 'Alexandra Eala'
	},
	{
		apiId: '151',
		name: 'Venus Williams',
		seed: null,
		country: 'USA',
		currentRanking: null,
		firstRoundOpponent: 'Maya Joint'
	},
	{
		apiId: '72414',
		name: 'Maya Joint',
		seed: null,
		country: 'AUS',
		currentRanking: 87,
		firstRoundOpponent: 'Venus Williams'
	},
	{
		apiId: '73274',
		name: 'Tereza Valentová',
		seed: null,
		country: 'CZE',
		currentRanking: 54,
		firstRoundOpponent: 'Karolína Plíšková'
	},
	{
		apiId: '7982',
		name: 'Karolína Plíšková',
		seed: null,
		country: 'CZE',
		currentRanking: 73,
		firstRoundOpponent: 'Tereza Valentová'
	},
	{
		apiId: '13621',
		name: 'Taylor Townsend',
		seed: null,
		country: 'USA',
		currentRanking: 79,
		firstRoundOpponent: 'Iga Świątek'
	},
	{
		apiId: '45854',
		name: 'Iga Świątek',
		seed: 3,
		country: 'POL',
		currentRanking: 3,
		firstRoundOpponent: 'Taylor Townsend'
	},
	{
		apiId: '41564',
		name: 'Amanda Anisimova',
		seed: 6,
		country: 'USA',
		currentRanking: 6,
		firstRoundOpponent: 'Lina Gjorcheska'
	},
	{
		apiId: '14397',
		name: 'Lina Gjorcheska',
		seed: null,
		country: 'MKD',
		currentRanking: 222,
		firstRoundOpponent: 'Amanda Anisimova'
	},
	{
		apiId: '73203',
		name: 'Petra Marčinko',
		seed: null,
		country: 'CRO',
		currentRanking: 47,
		firstRoundOpponent: 'Sofia Kenin'
	},
	{
		apiId: '23432',
		name: 'Sofia Kenin',
		seed: null,
		country: 'USA',
		currentRanking: 105,
		firstRoundOpponent: 'Petra Marčinko'
	},
	{
		apiId: '6651',
		name: 'Irina-Camelia Begu',
		seed: null,
		country: 'ROU',
		currentRanking: 173,
		firstRoundOpponent: 'Katie Swan'
	},
	{
		apiId: '32631',
		name: 'Katie Swan',
		seed: null,
		country: 'GBR',
		currentRanking: 196,
		firstRoundOpponent: 'Irina-Camelia Begu'
	},
	{
		apiId: '30510',
		name: 'Kayla Day',
		seed: null,
		country: 'USA',
		currentRanking: 137,
		firstRoundOpponent: 'Madison Keys'
	},
	{
		apiId: '11672',
		name: 'Madison Keys',
		seed: 26,
		country: 'USA',
		currentRanking: 26,
		firstRoundOpponent: 'Kayla Day'
	},
	{
		apiId: '6019',
		name: 'Sorana Cîrstea',
		seed: 17,
		country: 'ROU',
		currentRanking: 18,
		firstRoundOpponent: 'Sára Bejlek'
	},
	{
		apiId: '71163',
		name: 'Sára Bejlek',
		seed: null,
		country: 'CZE',
		currentRanking: 45,
		firstRoundOpponent: 'Sorana Cîrstea'
	},
	{
		apiId: '18427',
		name: 'Kimberly Birrell',
		seed: null,
		country: 'AUS',
		currentRanking: 71,
		firstRoundOpponent: 'Alina Korneeva'
	},
	{
		apiId: '75858',
		name: 'Alina Korneeva',
		seed: null,
		country: 'RUS',
		currentRanking: 98,
		firstRoundOpponent: 'Kimberly Birrell'
	},
	{
		apiId: '44040',
		name: 'Camila Osorio',
		seed: null,
		country: 'COL',
		currentRanking: 68,
		firstRoundOpponent: 'Simona Waltert'
	},
	{
		apiId: '44349',
		name: 'Simona Waltert',
		seed: null,
		country: 'SUI',
		currentRanking: 90,
		firstRoundOpponent: 'Camila Osorio'
	},
	{
		apiId: '72064',
		name: 'Ella Seidel',
		seed: null,
		country: 'GER',
		currentRanking: 100,
		firstRoundOpponent: 'Linda Nosková'
	},
	{
		apiId: '66597',
		name: 'Linda Nosková',
		seed: 9,
		country: 'CZE',
		currentRanking: 12,
		firstRoundOpponent: 'Ella Seidel'
	},
	{
		apiId: '65911',
		name: 'Diana Shnaider',
		seed: 15,
		country: 'RUS',
		currentRanking: 15,
		firstRoundOpponent: 'Eva Lys'
	},
	{
		apiId: '44525',
		name: 'Eva Lys',
		seed: null,
		country: 'GER',
		currentRanking: 76,
		firstRoundOpponent: 'Diana Shnaider'
	},
	{
		apiId: '60791',
		name: 'Polina Kudermetova',
		seed: null,
		country: 'UZB',
		currentRanking: 113,
		firstRoundOpponent: 'Ludmilla Samsonova'
	},
	{
		apiId: '24368',
		name: 'Ludmilla Samsonova',
		seed: null,
		country: 'RUS',
		currentRanking: 41,
		firstRoundOpponent: 'Polina Kudermetova'
	},
	{
		apiId: '14175',
		name: 'Katie Boulter',
		seed: null,
		country: 'GBR',
		currentRanking: 60,
		firstRoundOpponent: 'Tyra Grant'
	},
	{
		apiId: '84377',
		name: 'Tyra Grant',
		seed: null,
		country: 'ITA',
		currentRanking: 172,
		firstRoundOpponent: 'Katie Boulter'
	},
	{
		apiId: '63749',
		name: 'Talia Gibson',
		seed: null,
		country: 'AUS',
		currentRanking: 58,
		firstRoundOpponent: 'Marie Bouzková'
	},
	{
		apiId: '24572',
		name: 'Marie Bouzková',
		seed: 21,
		country: 'CZE',
		currentRanking: 22,
		firstRoundOpponent: 'Talia Gibson'
	},
	{
		apiId: '13351',
		name: 'Elise Mertens',
		seed: 25,
		country: 'BEL',
		currentRanking: 27,
		firstRoundOpponent: 'Laura Siegemund'
	},
	{
		apiId: '4177',
		name: 'Laura Siegemund',
		seed: null,
		country: 'GER',
		currentRanking: 40,
		firstRoundOpponent: 'Elise Mertens'
	},
	{
		apiId: '13094',
		name: 'Beatriz Haddad Maia',
		seed: null,
		country: 'BRA',
		currentRanking: 134,
		firstRoundOpponent: 'Maria Timofeeva'
	},
	{
		apiId: '60792',
		name: 'Maria Timofeeva',
		seed: null,
		country: 'UZB',
		currentRanking: 95,
		firstRoundOpponent: 'Beatriz Haddad Maia'
	},
	{
		apiId: '17774',
		name: 'Elena-Gabriela Ruse',
		seed: null,
		country: 'ROU',
		currentRanking: 72,
		firstRoundOpponent: 'Caty McNally'
	},
	{
		apiId: '41569',
		name: 'Caty McNally',
		seed: null,
		country: 'USA',
		currentRanking: 50,
		firstRoundOpponent: 'Elena-Gabriela Ruse'
	},
	{
		apiId: '60758',
		name: 'Loïs Boisson',
		seed: null,
		country: 'FRA',
		currentRanking: 154,
		firstRoundOpponent: 'Elena Rybakina'
	},
	{
		apiId: '36558',
		name: 'Elena Rybakina',
		seed: 2,
		country: 'KAZ',
		currentRanking: 2,
		firstRoundOpponent: 'Loïs Boisson'
	}
];

const STATIC_DRAWS: Record<string, { tour: 'atp' | 'wta'; entries: StaticDrawEntry[] }> = {
	'wimbledon-2026-atp': { tour: 'atp', entries: WIMBLEDON_2026_ATP },
	'wimbledon-2026-wta': { tour: 'wta', entries: WIMBLEDON_2026_WTA }
};

function toTennisPlayers(
	entries: StaticDrawEntry[],
	tour: 'atp' | 'wta',
	tournamentId: string
): TennisPlayer[] {
	return entries.map((e) => {
		const atpPlayerId = tour === 'atp' ? lookupAtpPlayerId(e.name) : undefined;
		return {
			id: e.apiId,
			name: e.name,
			seed: e.seed,
			currentRanking: e.currentRanking,
			country: e.country,
			image: getPlayerImageUrl(e.name, tour, atpPlayerId),
			tour,
			atpPlayerId,
			apiId: e.apiId,
			tournamentId
		};
	});
}

/**
 * Return the committed static draw for a tournament id (e.g. 'wimbledon-2026-atp'),
 * or null if there is no static draw for it (fall back to the API draw).
 */
export function getStaticDraw(tournamentId: string): TennisPlayer[] | null {
	const draw = STATIC_DRAWS[tournamentId];
	if (!draw) return null;
	return toTennisPlayers(draw.entries, draw.tour, tournamentId);
}

const FIRST_ROUND_OPPONENTS: Record<string, string> = Object.fromEntries(
	[...WIMBLEDON_2026_ATP, ...WIMBLEDON_2026_WTA].map((e) => [e.apiId, e.firstRoundOpponent])
);

/**
 * Round-1 opponent display name for a player (keyed by RapidAPI/apiId), or null when
 * the player isn't part of a static draw. DISPLAY ONLY — never used in draft rules.
 */
export function getFirstRoundOpponent(playerId: string): string | null {
	return FIRST_ROUND_OPPONENTS[playerId] ?? null;
}
