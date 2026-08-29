/**
 * US Open 2026 static main draws (men's + women's singles).
 *
 * Entrants, seeds, bracket pairings, ids, and countries are pulled directly from the
 * RapidAPI (tennis-api-atp-wta-itf) pre-tournament fixtures feed — the same API and the
 * same player ids the app uses to sync results and score picks — so drafted picks always
 * line up with synced results. Seeds are the official draw seeds (never derived from live
 * ranking). `currentRanking` is the live ATP/WTA ranking entering the tournament
 * (captured 2026-08-29) and is DISPLAY ONLY — never used in draft eligibility rules.
 *
 * GENERATED FILE — regenerate via scripts/usopen2026/generate.mjs, do not edit by hand.
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

export const USOPEN_2026_ATP: StaticDrawEntry[] = [
	{
		apiId: '18736',
		name: 'Marcos Giron',
		seed: null,
		country: 'USA',
		currentRanking: 77,
		firstRoundOpponent: 'Ignacio Buse'
	},
	{
		apiId: '79113',
		name: 'Ignacio Buse',
		seed: 32,
		country: 'PER',
		currentRanking: 36,
		firstRoundOpponent: 'Marcos Giron'
	},
	{
		apiId: '24008',
		name: 'Alexander Zverev',
		seed: 1,
		country: 'GER',
		currentRanking: 2,
		firstRoundOpponent: 'Lorenzo Sonego'
	},
	{
		apiId: '31392',
		name: 'Lorenzo Sonego',
		seed: null,
		country: 'ITA',
		currentRanking: 91,
		firstRoundOpponent: 'Alexander Zverev'
	},
	{
		apiId: '26421',
		name: 'Jan Choinski',
		seed: null,
		country: 'GBR',
		currentRanking: 75,
		firstRoundOpponent: 'Botic Van De Zandschulp'
	},
	{
		apiId: '24249',
		name: 'Botic Van De Zandschulp',
		seed: null,
		country: 'NED',
		currentRanking: 71,
		firstRoundOpponent: 'Jan Choinski'
	},
	{
		apiId: '29932',
		name: 'Taylor Fritz',
		seed: 9,
		country: 'USA',
		currentRanking: 10,
		firstRoundOpponent: 'Darwin Blanch'
	},
	{
		apiId: '92243',
		name: 'Darwin Blanch',
		seed: null,
		country: 'USA',
		currentRanking: 241,
		firstRoundOpponent: 'Taylor Fritz'
	},
	{
		apiId: '34539',
		name: 'Alex Molcan',
		seed: null,
		country: 'SVK',
		currentRanking: 84,
		firstRoundOpponent: 'Benjamin Bonzi'
	},
	{
		apiId: '28899',
		name: 'Benjamin Bonzi',
		seed: null,
		country: 'FRA',
		currentRanking: 109,
		firstRoundOpponent: 'Alex Molcan'
	},
	{
		apiId: '37741',
		name: 'Zizou Bergs',
		seed: 31,
		country: 'BEL',
		currentRanking: 35,
		firstRoundOpponent: 'Carlos Taberner'
	},
	{
		apiId: '29665',
		name: 'Carlos Taberner',
		seed: null,
		country: 'ESP',
		currentRanking: 400,
		firstRoundOpponent: 'Zizou Bergs'
	},
	{
		apiId: '40187',
		name: 'Andrea Guerrieri',
		seed: null,
		country: 'ITA',
		currentRanking: 187,
		firstRoundOpponent: 'Alex De Minaur'
	},
	{
		apiId: '39309',
		name: 'Alex De Minaur',
		seed: 6,
		country: 'AUS',
		currentRanking: 7,
		firstRoundOpponent: 'Andrea Guerrieri'
	},
	{
		apiId: '42229',
		name: 'Camilo Ugo Carabelli',
		seed: null,
		country: 'ARG',
		currentRanking: 76,
		firstRoundOpponent: 'Jan-Lennard Struff'
	},
	{
		apiId: '14177',
		name: 'Jan-Lennard Struff',
		seed: null,
		country: 'GER',
		currentRanking: 44,
		firstRoundOpponent: 'Camilo Ugo Carabelli'
	},
	{
		apiId: '51417',
		name: 'Filip Misolic',
		seed: null,
		country: 'AUT',
		currentRanking: 530,
		firstRoundOpponent: 'Francisco Cerundolo'
	},
	{
		apiId: '52279',
		name: 'Francisco Cerundolo',
		seed: 24,
		country: 'ARG',
		currentRanking: 25,
		firstRoundOpponent: 'Filip Misolic'
	},
	{
		apiId: '52140',
		name: 'Fabian Marozsan',
		seed: null,
		country: 'HUN',
		currentRanking: 63,
		firstRoundOpponent: 'Michael Zheng'
	},
	{
		apiId: '87512',
		name: 'Michael Zheng',
		seed: null,
		country: 'USA',
		currentRanking: 106,
		firstRoundOpponent: 'Fabian Marozsan'
	},
	{
		apiId: '52934',
		name: 'Juan Manuel Cerundolo',
		seed: null,
		country: 'ARG',
		currentRanking: 51,
		firstRoundOpponent: 'Casper Ruud'
	},
	{
		apiId: '33648',
		name: 'Casper Ruud',
		seed: 19,
		country: 'NOR',
		currentRanking: 20,
		firstRoundOpponent: 'Juan Manuel Cerundolo'
	},
	{
		apiId: '56590',
		name: 'Dane Sweeny',
		seed: null,
		country: 'AUS',
		currentRanking: 122,
		firstRoundOpponent: 'Corentin Moutet'
	},
	{
		apiId: '36263',
		name: 'Corentin Moutet',
		seed: null,
		country: 'FRA',
		currentRanking: 62,
		firstRoundOpponent: 'Dane Sweeny'
	},
	{
		apiId: '59166',
		name: 'Jesper De Jong',
		seed: null,
		country: 'NED',
		currentRanking: 99,
		firstRoundOpponent: 'Francesco Passaro'
	},
	{
		apiId: '63021',
		name: 'Francesco Passaro',
		seed: null,
		country: 'ITA',
		currentRanking: 207,
		firstRoundOpponent: 'Jesper De Jong'
	},
	{
		apiId: '61971',
		name: 'Francisco Comesana',
		seed: null,
		country: 'ARG',
		currentRanking: 123,
		firstRoundOpponent: 'Flavio Cobolli'
	},
	{
		apiId: '67546',
		name: 'Flavio Cobolli',
		seed: 5,
		country: 'ITA',
		currentRanking: 6,
		firstRoundOpponent: 'Francisco Comesana'
	},
	{
		apiId: '72578',
		name: 'Mattia Bellucci',
		seed: null,
		country: 'ITA',
		currentRanking: 96,
		firstRoundOpponent: 'Zsombor Piros'
	},
	{
		apiId: '47021',
		name: 'Zsombor Piros',
		seed: null,
		country: 'HUN',
		currentRanking: 118,
		firstRoundOpponent: 'Mattia Bellucci'
	},
	{
		apiId: '73620',
		name: 'Zachary Svajda',
		seed: null,
		country: 'USA',
		currentRanking: 80,
		firstRoundOpponent: 'Daniel Altmaier'
	},
	{
		apiId: '29732',
		name: 'Daniel Altmaier',
		seed: null,
		country: 'GER',
		currentRanking: 57,
		firstRoundOpponent: 'Zachary Svajda'
	},
	{
		apiId: '79065',
		name: 'Arthur Fery',
		seed: null,
		country: 'GBR',
		currentRanking: 37,
		firstRoundOpponent: 'Lorenzo Musetti'
	},
	{
		apiId: '63572',
		name: 'Lorenzo Musetti',
		seed: 13,
		country: 'ITA',
		currentRanking: 14,
		firstRoundOpponent: 'Arthur Fery'
	},
	{
		apiId: '80391',
		name: 'Adolfo Daniel Vallejo',
		seed: null,
		country: 'PAR',
		currentRanking: 61,
		firstRoundOpponent: 'Gael Monfils'
	},
	{
		apiId: '5917',
		name: 'Gael Monfils',
		seed: null,
		country: 'FRA',
		currentRanking: 307,
		firstRoundOpponent: 'Adolfo Daniel Vallejo'
	},
	{
		apiId: '92184',
		name: 'Nishesh Basavareddy',
		seed: null,
		country: 'USA',
		currentRanking: 163,
		firstRoundOpponent: 'Tristan Schoolkate'
	},
	{
		apiId: '67986',
		name: 'Tristan Schoolkate',
		seed: null,
		country: 'AUS',
		currentRanking: 180,
		firstRoundOpponent: 'Nishesh Basavareddy'
	},
	{
		apiId: '99691',
		name: 'Rafael Jodar',
		seed: 12,
		country: 'ESP',
		currentRanking: 13,
		firstRoundOpponent: 'Thanasi Kokkinakis'
	},
	{
		apiId: '22432',
		name: 'Thanasi Kokkinakis',
		seed: null,
		country: 'AUS',
		currentRanking: 412,
		firstRoundOpponent: 'Rafael Jodar'
	},
	{
		apiId: '72574',
		name: 'Martin Damm',
		seed: null,
		country: 'USA',
		currentRanking: 92,
		firstRoundOpponent: 'Frances Tiafoe'
	},
	{
		apiId: '29939',
		name: 'Frances Tiafoe',
		seed: 11,
		country: 'USA',
		currentRanking: 12,
		firstRoundOpponent: 'Martin Damm'
	},
	{
		apiId: '87562',
		name: 'Ben Shelton',
		seed: 8,
		country: 'USA',
		currentRanking: 9,
		firstRoundOpponent: 'Tallon Griekspoor'
	},
	{
		apiId: '33860',
		name: 'Tallon Griekspoor',
		seed: null,
		country: 'NED',
		currentRanking: 56,
		firstRoundOpponent: 'Ben Shelton'
	},
	{
		apiId: '11953',
		name: 'Grigor Dimitrov',
		seed: null,
		country: 'BUL',
		currentRanking: 137,
		firstRoundOpponent: 'Alexei Popyrin'
	},
	{
		apiId: '34233',
		name: 'Alexei Popyrin',
		seed: null,
		country: 'AUS',
		currentRanking: 130,
		firstRoundOpponent: 'Grigor Dimitrov'
	},
	{
		apiId: '25171',
		name: 'Quentin Halys',
		seed: null,
		country: 'FRA',
		currentRanking: 52,
		firstRoundOpponent: 'Facundo Diaz Acosta'
	},
	{
		apiId: '64741',
		name: 'Facundo Diaz Acosta',
		seed: null,
		country: 'ARG',
		currentRanking: 82,
		firstRoundOpponent: 'Quentin Halys'
	},
	{
		apiId: '31446',
		name: 'Nuno Borges',
		seed: null,
		country: 'POR',
		currentRanking: 41,
		firstRoundOpponent: 'Learner Tien'
	},
	{
		apiId: '93452',
		name: 'Learner Tien',
		seed: 14,
		country: 'USA',
		currentRanking: 15,
		firstRoundOpponent: 'Nuno Borges'
	},
	{
		apiId: '40434',
		name: 'Felix Auger Aliassime',
		seed: 3,
		country: 'CAN',
		currentRanking: 4,
		firstRoundOpponent: 'Rinky Hijikata'
	},
	{
		apiId: '58149',
		name: 'Rinky Hijikata',
		seed: null,
		country: 'AUS',
		currentRanking: 85,
		firstRoundOpponent: 'Felix Auger Aliassime'
	},
	{
		apiId: '70705',
		name: 'Roman Andres Burruchaga',
		seed: null,
		country: 'ARG',
		currentRanking: 59,
		firstRoundOpponent: 'Karen Khachanov'
	},
	{
		apiId: '25543',
		name: 'Karen Khachanov',
		seed: null,
		country: 'RUS',
		currentRanking: 49,
		firstRoundOpponent: 'Roman Andres Burruchaga'
	},
	{
		apiId: '86691',
		name: 'Jakub Mensik',
		seed: 17,
		country: 'CZE',
		currentRanking: 18,
		firstRoundOpponent: 'Shintaro Mochizuki'
	},
	{
		apiId: '73742',
		name: 'Shintaro Mochizuki',
		seed: null,
		country: 'JPN',
		currentRanking: 117,
		firstRoundOpponent: 'Jakub Mensik'
	},
	{
		apiId: '14856',
		name: 'Yannick Hanfmann',
		seed: null,
		country: 'GER',
		currentRanking: 54,
		firstRoundOpponent: 'Alejandro Tabilo'
	},
	{
		apiId: '30087',
		name: 'Alejandro Tabilo',
		seed: 25,
		country: 'CHI',
		currentRanking: 28,
		firstRoundOpponent: 'Yannick Hanfmann'
	},
	{
		apiId: '88766',
		name: 'Alexander Blockx',
		seed: 28,
		country: 'BEL',
		currentRanking: 32,
		firstRoundOpponent: 'Tomas Barrios Vera'
	},
	{
		apiId: '30849',
		name: 'Tomas Barrios Vera',
		seed: null,
		country: 'CHI',
		currentRanking: 144,
		firstRoundOpponent: 'Alexander Blockx'
	},
	{
		apiId: '29812',
		name: 'Matteo Berrettini',
		seed: null,
		country: 'ITA',
		currentRanking: 43,
		firstRoundOpponent: 'Stan Wawrinka'
	},
	{
		apiId: '1092',
		name: 'Stan Wawrinka',
		seed: null,
		country: 'SUI',
		currentRanking: 127,
		firstRoundOpponent: 'Matteo Berrettini'
	},
	{
		apiId: '63299',
		name: 'Dalibor Svrcina',
		seed: null,
		country: 'CZE',
		currentRanking: 134,
		firstRoundOpponent: 'Valentin Royer'
	},
	{
		apiId: '61857',
		name: 'Valentin Royer',
		seed: null,
		country: 'FRA',
		currentRanking: 74,
		firstRoundOpponent: 'Dalibor Svrcina'
	},
	{
		apiId: '76127',
		name: 'Luciano Darderi',
		seed: 21,
		country: 'ITA',
		currentRanking: 22,
		firstRoundOpponent: 'Harry Wendelken'
	},
	{
		apiId: '65558',
		name: 'Harry Wendelken',
		seed: null,
		country: 'GBR',
		currentRanking: 196,
		firstRoundOpponent: 'Luciano Darderi'
	},
	{
		apiId: '86082',
		name: 'Juncheng Shang',
		seed: null,
		country: 'CHN',
		currentRanking: 227,
		firstRoundOpponent: 'Marco Trungelliti'
	},
	{
		apiId: '12653',
		name: 'Marco Trungelliti',
		seed: null,
		country: 'ARG',
		currentRanking: 83,
		firstRoundOpponent: 'Juncheng Shang'
	},
	{
		apiId: '28900',
		name: 'Roman Safiullin',
		seed: null,
		country: 'RUS',
		currentRanking: 98,
		firstRoundOpponent: 'Carlos Alcaraz'
	},
	{
		apiId: '68074',
		name: 'Carlos Alcaraz',
		seed: 2,
		country: 'ESP',
		currentRanking: 3,
		firstRoundOpponent: 'Roman Safiullin'
	},
	{
		apiId: '13447',
		name: 'Damir Dzumhur',
		seed: null,
		country: 'BIH',
		currentRanking: 103,
		firstRoundOpponent: 'Hubert Hurkacz'
	},
	{
		apiId: '26473',
		name: 'Hubert Hurkacz',
		seed: null,
		country: 'POL',
		currentRanking: 46,
		firstRoundOpponent: 'Damir Dzumhur'
	},
	{
		apiId: '44555',
		name: 'Jurij Rodionov',
		seed: null,
		country: 'AUT',
		currentRanking: 143,
		firstRoundOpponent: 'Giovanni Mpetshi Perricard'
	},
	{
		apiId: '71174',
		name: 'Giovanni Mpetshi Perricard',
		seed: null,
		country: 'FRA',
		currentRanking: 104,
		firstRoundOpponent: 'Jurij Rodionov'
	},
	{
		apiId: '56846',
		name: 'Brandon Nakashima',
		seed: 16,
		country: 'USA',
		currentRanking: 17,
		firstRoundOpponent: 'Sebastian Baez'
	},
	{
		apiId: '52721',
		name: 'Sebastian Baez',
		seed: null,
		country: 'ARG',
		currentRanking: 50,
		firstRoundOpponent: 'Brandon Nakashima'
	},
	{
		apiId: '73956',
		name: 'Matteo Arnaldi',
		seed: 30,
		country: 'ITA',
		currentRanking: 34,
		firstRoundOpponent: 'James Duckworth'
	},
	{
		apiId: '11517',
		name: 'James Duckworth',
		seed: null,
		country: 'AUS',
		currentRanking: 79,
		firstRoundOpponent: 'Matteo Arnaldi'
	},
	{
		apiId: '6101',
		name: 'Marin Cilic',
		seed: null,
		country: 'CRO',
		currentRanking: 81,
		firstRoundOpponent: 'Andrey Rublev'
	},
	{
		apiId: '29372',
		name: 'Andrey Rublev',
		seed: 23,
		country: 'RUS',
		currentRanking: 24,
		firstRoundOpponent: 'Marin Cilic'
	},
	{
		apiId: '30470',
		name: 'Stefanos Tsitsipas',
		seed: null,
		country: 'GRE',
		currentRanking: 53,
		firstRoundOpponent: 'Arthur Fils'
	},
	{
		apiId: '83135',
		name: 'Arthur Fils',
		seed: 10,
		country: 'FRA',
		currentRanking: 11,
		firstRoundOpponent: 'Stefanos Tsitsipas'
	},
	{
		apiId: '36594',
		name: 'Valentin Vacherot',
		seed: 22,
		country: 'MON',
		currentRanking: 23,
		firstRoundOpponent: 'Aleksandar Kovacevic'
	},
	{
		apiId: '39152',
		name: 'Aleksandar Kovacevic',
		seed: null,
		country: 'USA',
		currentRanking: 89,
		firstRoundOpponent: 'Valentin Vacherot'
	},
	{
		apiId: '24245',
		name: 'Alexander Bublik',
		seed: 15,
		country: 'KAZ',
		currentRanking: 16,
		firstRoundOpponent: 'Jeff Wolf'
	},
	{
		apiId: '46722',
		name: 'Jeff Wolf',
		seed: null,
		country: 'USA',
		currentRanking: 248,
		firstRoundOpponent: 'Alexander Bublik'
	},
	{
		apiId: '66828',
		name: 'Mariano Navone',
		seed: null,
		country: 'ARG',
		currentRanking: 48,
		firstRoundOpponent: 'Novak Djokovic'
	},
	{
		apiId: '5992',
		name: 'Novak Djokovic',
		seed: 4,
		country: 'SRB',
		currentRanking: 5,
		firstRoundOpponent: 'Mariano Navone'
	},
	{
		apiId: '92985',
		name: 'Alex Michelsen',
		seed: null,
		country: 'USA',
		currentRanking: 45,
		firstRoundOpponent: 'Federico Cina'
	},
	{
		apiId: '95698',
		name: 'Federico Cina',
		seed: null,
		country: 'ITA',
		currentRanking: 181,
		firstRoundOpponent: 'Alex Michelsen'
	},
	{
		apiId: '28267',
		name: 'Aleksandar Vukic',
		seed: null,
		country: 'AUS',
		currentRanking: 95,
		firstRoundOpponent: 'Rei Sakamoto'
	},
	{
		apiId: '93550',
		name: 'Rei Sakamoto',
		seed: null,
		country: 'JPN',
		currentRanking: 157,
		firstRoundOpponent: 'Aleksandar Vukic'
	},
	{
		apiId: '34337',
		name: 'Miomir Kecmanovic',
		seed: null,
		country: 'SRB',
		currentRanking: 64,
		firstRoundOpponent: 'Denis Shapovalov'
	},
	{
		apiId: '33502',
		name: 'Denis Shapovalov',
		seed: null,
		country: 'CAN',
		currentRanking: 47,
		firstRoundOpponent: 'Miomir Kecmanovic'
	},
	{
		apiId: '37532',
		name: 'Tomas Martin Etcheverry',
		seed: 27,
		country: 'ARG',
		currentRanking: 31,
		firstRoundOpponent: 'Vit Kopriva'
	},
	{
		apiId: '42971',
		name: 'Vit Kopriva',
		seed: null,
		country: 'CZE',
		currentRanking: 69,
		firstRoundOpponent: 'Tomas Martin Etcheverry'
	},
	{
		apiId: '92474',
		name: 'Sebastian Gorzny',
		seed: null,
		country: 'USA',
		currentRanking: null,
		firstRoundOpponent: 'Raphael Collignon'
	},
	{
		apiId: '84235',
		name: 'Raphael Collignon',
		seed: null,
		country: 'BEL',
		currentRanking: 38,
		firstRoundOpponent: 'Sebastian Gorzny'
	},
	{
		apiId: '94493',
		name: 'Martin Landaluce',
		seed: null,
		country: 'ESP',
		currentRanking: 65,
		firstRoundOpponent: 'Jacob Fearnley'
	},
	{
		apiId: '68090',
		name: 'Jacob Fearnley',
		seed: null,
		country: 'GBR',
		currentRanking: 100,
		firstRoundOpponent: 'Martin Landaluce'
	},
	{
		apiId: '31358',
		name: 'Jaume Antoni Munar Clar',
		seed: null,
		country: 'ESP',
		currentRanking: 55,
		firstRoundOpponent: 'Terence Atmane'
	},
	{
		apiId: '67535',
		name: 'Terence Atmane',
		seed: null,
		country: 'FRA',
		currentRanking: 90,
		firstRoundOpponent: 'Jaume Antoni Munar Clar'
	},
	{
		apiId: '36449',
		name: 'Lloyd Harris',
		seed: null,
		country: 'RSA',
		currentRanking: 139,
		firstRoundOpponent: 'Jack Kennedy'
	},
	{
		apiId: '111500',
		name: 'Jack Kennedy',
		seed: null,
		country: 'USA',
		currentRanking: 386,
		firstRoundOpponent: 'Lloyd Harris'
	},
	{
		apiId: '52394',
		name: 'Thiago Agustin Tirante',
		seed: null,
		country: 'ARG',
		currentRanking: 42,
		firstRoundOpponent: 'Adrian Mannarino'
	},
	{
		apiId: '7806',
		name: 'Adrian Mannarino',
		seed: null,
		country: 'FRA',
		currentRanking: 67,
		firstRoundOpponent: 'Thiago Agustin Tirante'
	},
	{
		apiId: '79068',
		name: 'Toby Samuel',
		seed: null,
		country: 'GBR',
		currentRanking: 110,
		firstRoundOpponent: 'Tomas Machac'
	},
	{
		apiId: '58327',
		name: 'Tomas Machac',
		seed: null,
		country: 'CZE',
		currentRanking: 58,
		firstRoundOpponent: 'Toby Samuel'
	},
	{
		apiId: '83795',
		name: 'Jaime Faria',
		seed: null,
		country: 'POR',
		currentRanking: 70,
		firstRoundOpponent: 'Jenson Brooksby'
	},
	{
		apiId: '40609',
		name: 'Jenson Brooksby',
		seed: null,
		country: 'USA',
		currentRanking: 73,
		firstRoundOpponent: 'Jaime Faria'
	},
	{
		apiId: '22807',
		name: 'Daniil Medvedev',
		seed: 7,
		country: 'RUS',
		currentRanking: 8,
		firstRoundOpponent: 'Hugo Gaston'
	},
	{
		apiId: '46747',
		name: 'Hugo Gaston',
		seed: null,
		country: 'FRA',
		currentRanking: 88,
		firstRoundOpponent: 'Daniil Medvedev'
	},
	{
		apiId: '71166',
		name: 'Chak Lam Coleman Wong',
		seed: null,
		country: 'HKG',
		currentRanking: 94,
		firstRoundOpponent: 'Tommy Paul'
	},
	{
		apiId: '29935',
		name: 'Tommy Paul',
		seed: 20,
		country: 'USA',
		currentRanking: 21,
		firstRoundOpponent: 'Chak Lam Coleman Wong'
	},
	{
		apiId: '82371',
		name: 'Luca Van Assche',
		seed: null,
		country: 'FRA',
		currentRanking: 40,
		firstRoundOpponent: 'Cameron Norrie'
	},
	{
		apiId: '27851',
		name: 'Cameron Norrie',
		seed: 29,
		country: 'GBR',
		currentRanking: 33,
		firstRoundOpponent: 'Luca Van Assche'
	},
	{
		apiId: '28898',
		name: 'Kamil Majchrzak',
		seed: null,
		country: 'POL',
		currentRanking: 72,
		firstRoundOpponent: 'Hamad Medjedovic'
	},
	{
		apiId: '79060',
		name: 'Hamad Medjedovic',
		seed: null,
		country: 'SRB',
		currentRanking: 78,
		firstRoundOpponent: 'Kamil Majchrzak'
	},
	{
		apiId: '39310',
		name: 'Yibing Wu',
		seed: null,
		country: 'CHN',
		currentRanking: 113,
		firstRoundOpponent: 'Adam Walton'
	},
	{
		apiId: '47752',
		name: 'Adam Walton',
		seed: null,
		country: 'AUS',
		currentRanking: 93,
		firstRoundOpponent: 'Yibing Wu'
	},
	{
		apiId: '39863',
		name: 'Sho Shimabukuro',
		seed: null,
		country: 'JPN',
		currentRanking: 87,
		firstRoundOpponent: 'Arthur Rinderknech'
	},
	{
		apiId: '28170',
		name: 'Arthur Rinderknech',
		seed: 26,
		country: 'FRA',
		currentRanking: 29,
		firstRoundOpponent: 'Sho Shimabukuro'
	},
	{
		apiId: '61838',
		name: 'Jiri Lehecka',
		seed: 18,
		country: 'CZE',
		currentRanking: 19,
		firstRoundOpponent: 'Pablo Carreno-Busta'
	},
	{
		apiId: '14432',
		name: 'Pablo Carreno-Busta',
		seed: null,
		country: 'ESP',
		currentRanking: 66,
		firstRoundOpponent: 'Jiri Lehecka'
	},
	{
		apiId: '83223',
		name: 'Daniel Merida Aguilar',
		seed: null,
		country: 'ESP',
		currentRanking: 39,
		firstRoundOpponent: 'Marton Fucsovics'
	},
	{
		apiId: '13674',
		name: 'Marton Fucsovics',
		seed: null,
		country: 'HUN',
		currentRanking: 121,
		firstRoundOpponent: 'Daniel Merida Aguilar'
	},
	{
		apiId: '85899',
		name: 'Dino Prizmic',
		seed: null,
		country: 'CRO',
		currentRanking: 101,
		firstRoundOpponent: 'Alexander Shevchenko'
	},
	{
		apiId: '64891',
		name: 'Alexander Shevchenko',
		seed: null,
		country: 'KAZ',
		currentRanking: 97,
		firstRoundOpponent: 'Dino Prizmic'
	}
];

export const USOPEN_2026_WTA: StaticDrawEntry[] = [
	{
		apiId: '4110',
		name: 'Tatjana Maria',
		seed: null,
		country: 'GER',
		currentRanking: 79,
		firstRoundOpponent: 'Jelena Ostapenko'
	},
	{
		apiId: '16628',
		name: 'Jelena Ostapenko',
		seed: 30,
		country: 'LAT',
		currentRanking: 31,
		firstRoundOpponent: 'Tatjana Maria'
	},
	{
		apiId: '6933',
		name: 'Arantxa Rus',
		seed: null,
		country: 'NED',
		currentRanking: 203,
		firstRoundOpponent: 'Leolia Jeanjean'
	},
	{
		apiId: '11959',
		name: 'Leolia Jeanjean',
		seed: null,
		country: 'FRA',
		currentRanking: 127,
		firstRoundOpponent: 'Arantxa Rus'
	},
	{
		apiId: '9357',
		name: 'Magda Linette',
		seed: null,
		country: 'POL',
		currentRanking: 78,
		firstRoundOpponent: 'Francesca Jones'
	},
	{
		apiId: '38210',
		name: 'Francesca Jones',
		seed: null,
		country: 'GBR',
		currentRanking: 104,
		firstRoundOpponent: 'Magda Linette'
	},
	{
		apiId: '11672',
		name: 'Madison Keys',
		seed: 22,
		country: 'USA',
		currentRanking: 23,
		firstRoundOpponent: 'Alina Korneeva'
	},
	{
		apiId: '75858',
		name: 'Alina Korneeva',
		seed: null,
		country: 'RUS',
		currentRanking: 67,
		firstRoundOpponent: 'Madison Keys'
	},
	{
		apiId: '12390',
		name: 'Yulia Putintseva',
		seed: null,
		country: 'KAZ',
		currentRanking: 80,
		firstRoundOpponent: 'Belinda Bencic'
	},
	{
		apiId: '14056',
		name: 'Belinda Bencic',
		seed: 12,
		country: 'SUI',
		currentRanking: 12,
		firstRoundOpponent: 'Yulia Putintseva'
	},
	{
		apiId: '13541',
		name: 'Maria Sakkari',
		seed: 32,
		country: 'GRE',
		currentRanking: 33,
		firstRoundOpponent: 'Robin Montgomery'
	},
	{
		apiId: '64341',
		name: 'Robin Montgomery',
		seed: null,
		country: 'USA',
		currentRanking: 187,
		firstRoundOpponent: 'Maria Sakkari'
	},
	{
		apiId: '17503',
		name: 'Daria Kasatkina',
		seed: null,
		country: 'AUS',
		currentRanking: 59,
		firstRoundOpponent: 'Paula Badosa Gibert'
	},
	{
		apiId: '17142',
		name: 'Paula Badosa Gibert',
		seed: null,
		country: 'ESP',
		currentRanking: 83,
		firstRoundOpponent: 'Daria Kasatkina'
	},
	{
		apiId: '26509',
		name: 'Gabriela Andrea Knutson',
		seed: null,
		country: 'CZE',
		currentRanking: 184,
		firstRoundOpponent: 'Eva Lys'
	},
	{
		apiId: '44525',
		name: 'Eva Lys',
		seed: null,
		country: 'GER',
		currentRanking: 98,
		firstRoundOpponent: 'Gabriela Andrea Knutson'
	},
	{
		apiId: '40156',
		name: 'Anastasia Potapova',
		seed: 24,
		country: 'AUT',
		currentRanking: 25,
		firstRoundOpponent: 'Tereza Valentova'
	},
	{
		apiId: '73274',
		name: 'Tereza Valentova',
		seed: null,
		country: 'CZE',
		currentRanking: 57,
		firstRoundOpponent: 'Anastasia Potapova'
	},
	{
		apiId: '41888',
		name: 'Yuliia Starodubtseva',
		seed: null,
		country: 'UKR',
		currentRanking: 74,
		firstRoundOpponent: 'Ella Seidel'
	},
	{
		apiId: '72064',
		name: 'Ella Seidel',
		seed: null,
		country: 'GER',
		currentRanking: 124,
		firstRoundOpponent: 'Yuliia Starodubtseva'
	},
	{
		apiId: '49991',
		name: 'Zeynep Sonmez',
		seed: null,
		country: 'TUR',
		currentRanking: 52,
		firstRoundOpponent: 'Cori Gauff'
	},
	{
		apiId: '54663',
		name: 'Cori Gauff',
		seed: 4,
		country: 'USA',
		currentRanking: 4,
		firstRoundOpponent: 'Zeynep Sonmez'
	},
	{
		apiId: '61710',
		name: 'Darja Vidmanova',
		seed: null,
		country: 'CZE',
		currentRanking: 90,
		firstRoundOpponent: 'Jessica Bouzas Maneiro'
	},
	{
		apiId: '57090',
		name: 'Jessica Bouzas Maneiro',
		seed: null,
		country: 'ESP',
		currentRanking: 105,
		firstRoundOpponent: 'Darja Vidmanova'
	},
	{
		apiId: '69651',
		name: 'Lucie Havlickova',
		seed: null,
		country: 'CZE',
		currentRanking: 225,
		firstRoundOpponent: 'Anna Bondar'
	},
	{
		apiId: '31728',
		name: 'Anna Bondar',
		seed: null,
		country: 'HUN',
		currentRanking: 70,
		firstRoundOpponent: 'Lucie Havlickova'
	},
	{
		apiId: '70519',
		name: 'Mary Stoiana',
		seed: null,
		country: 'USA',
		currentRanking: 122,
		firstRoundOpponent: 'Alexandra Eala'
	},
	{
		apiId: '67792',
		name: 'Alexandra Eala',
		seed: 17,
		country: 'PHI',
		currentRanking: 18,
		firstRoundOpponent: 'Mary Stoiana'
	},
	{
		apiId: '71092',
		name: 'Nikola Bartunkova',
		seed: null,
		country: 'CZE',
		currentRanking: 38,
		firstRoundOpponent: 'Mayar Sherif'
	},
	{
		apiId: '13706',
		name: 'Mayar Sherif',
		seed: null,
		country: 'EGY',
		currentRanking: 51,
		firstRoundOpponent: 'Nikola Bartunkova'
	},
	{
		apiId: '77934',
		name: 'Mirra Andreeva',
		seed: 5,
		country: 'RUS',
		currentRanking: 5,
		firstRoundOpponent: 'Janice Tjen'
	},
	{
		apiId: '60341',
		name: 'Janice Tjen',
		seed: null,
		country: 'INA',
		currentRanking: 35,
		firstRoundOpponent: 'Mirra Andreeva'
	},
	{
		apiId: '80381',
		name: 'Iva Jovic',
		seed: 14,
		country: 'USA',
		currentRanking: 14,
		firstRoundOpponent: 'Magdalena Frech'
	},
	{
		apiId: '17155',
		name: 'Magdalena Frech',
		seed: null,
		country: 'POL',
		currentRanking: 37,
		firstRoundOpponent: 'Iva Jovic'
	},
	{
		apiId: '87058',
		name: 'Thea Frodin',
		seed: null,
		country: 'USA',
		currentRanking: 580,
		firstRoundOpponent: 'Elena Rybakina'
	},
	{
		apiId: '36558',
		name: 'Elena Rybakina',
		seed: 2,
		country: 'KAZ',
		currentRanking: 2,
		firstRoundOpponent: 'Thea Frodin'
	},
	{
		apiId: '16430',
		name: 'Naomi Osaka',
		seed: 13,
		country: 'JPN',
		currentRanking: 13,
		firstRoundOpponent: 'Anastasia Zakharova'
	},
	{
		apiId: '52660',
		name: 'Anastasia Zakharova',
		seed: null,
		country: 'RUS',
		currentRanking: 101,
		firstRoundOpponent: 'Naomi Osaka'
	},
	{
		apiId: '45854',
		name: 'Iga Swiatek',
		seed: 8,
		country: 'POL',
		currentRanking: 8,
		firstRoundOpponent: 'Xiyu Wang'
	},
	{
		apiId: '43872',
		name: 'Xiyu Wang',
		seed: null,
		country: 'CHN',
		currentRanking: 82,
		firstRoundOpponent: 'Iga Swiatek'
	},
	{
		apiId: '54664',
		name: 'Elisabetta Cocciaretto',
		seed: null,
		country: 'ITA',
		currentRanking: 66,
		firstRoundOpponent: 'Katerina Siniakova'
	},
	{
		apiId: '17501',
		name: 'Katerina Siniakova',
		seed: null,
		country: 'CZE',
		currentRanking: 39,
		firstRoundOpponent: 'Elisabetta Cocciaretto'
	},
	{
		apiId: '72414',
		name: 'Maya Joint',
		seed: null,
		country: 'AUS',
		currentRanking: 75,
		firstRoundOpponent: 'Liudmila Samsonova'
	},
	{
		apiId: '24368',
		name: 'Liudmila Samsonova',
		seed: null,
		country: 'RUS',
		currentRanking: 45,
		firstRoundOpponent: 'Maya Joint'
	},
	{
		apiId: '10749',
		name: 'Viktorija Golubic',
		seed: null,
		country: 'SUI',
		currentRanking: 55,
		firstRoundOpponent: 'Diane Parry'
	},
	{
		apiId: '51151',
		name: 'Diane Parry',
		seed: null,
		country: 'FRA',
		currentRanking: 50,
		firstRoundOpponent: 'Viktorija Golubic'
	},
	{
		apiId: '16134',
		name: 'Julia Grabher',
		seed: null,
		country: 'AUT',
		currentRanking: 114,
		firstRoundOpponent: 'Sorana Cirstea'
	},
	{
		apiId: '6019',
		name: 'Sorana Cirstea',
		seed: 16,
		country: 'ROU',
		currentRanking: 17,
		firstRoundOpponent: 'Julia Grabher'
	},
	{
		apiId: '10033',
		name: 'Sloane Stephens',
		seed: null,
		country: 'USA',
		currentRanking: 208,
		firstRoundOpponent: 'Clara Tauson'
	},
	{
		apiId: '54989',
		name: 'Clara Tauson',
		seed: null,
		country: 'DEN',
		currentRanking: 42,
		firstRoundOpponent: 'Sloane Stephens'
	},
	{
		apiId: '45866',
		name: 'Ann Li',
		seed: 29,
		country: 'USA',
		currentRanking: 30,
		firstRoundOpponent: 'Antonia Ruzic'
	},
	{
		apiId: '65417',
		name: 'Antonia Ruzic',
		seed: null,
		country: 'CRO',
		currentRanking: 81,
		firstRoundOpponent: 'Ann Li'
	},
	{
		apiId: '52790',
		name: 'Katie Volynets',
		seed: null,
		country: 'USA',
		currentRanking: 91,
		firstRoundOpponent: 'Linda Noskova'
	},
	{
		apiId: '66597',
		name: 'Linda Noskova',
		seed: 6,
		country: 'CZE',
		currentRanking: 6,
		firstRoundOpponent: 'Katie Volynets'
	},
	{
		apiId: '27035',
		name: 'Tamara Zidansek',
		seed: null,
		country: 'SLO',
		currentRanking: 146,
		firstRoundOpponent: 'Maria Timofeeva'
	},
	{
		apiId: '60792',
		name: 'Maria Timofeeva',
		seed: null,
		country: 'UZB',
		currentRanking: 92,
		firstRoundOpponent: 'Tamara Zidansek'
	},
	{
		apiId: '55173',
		name: 'Daria Snigur',
		seed: null,
		country: 'UKR',
		currentRanking: 44,
		firstRoundOpponent: 'Diana Shnaider'
	},
	{
		apiId: '65911',
		name: 'Diana Shnaider',
		seed: 15,
		country: 'RUS',
		currentRanking: 16,
		firstRoundOpponent: 'Daria Snigur'
	},
	{
		apiId: '61291',
		name: 'Anouk Koevermans',
		seed: null,
		country: 'NED',
		currentRanking: 228,
		firstRoundOpponent: 'Caty McNally'
	},
	{
		apiId: '41569',
		name: 'Caty McNally',
		seed: null,
		country: 'USA',
		currentRanking: 64,
		firstRoundOpponent: 'Anouk Koevermans'
	},
	{
		apiId: '64343',
		name: 'Ashlyn Krueger',
		seed: null,
		country: 'USA',
		currentRanking: 62,
		firstRoundOpponent: 'Amanda Anisimova'
	},
	{
		apiId: '41564',
		name: 'Amanda Anisimova',
		seed: 10,
		country: 'USA',
		currentRanking: 10,
		firstRoundOpponent: 'Ashlyn Krueger'
	},
	{
		apiId: '14448',
		name: 'Nadia Podoroska',
		seed: null,
		country: 'ARG',
		currentRanking: 447,
		firstRoundOpponent: 'Simona Waltert'
	},
	{
		apiId: '44349',
		name: 'Simona Waltert',
		seed: null,
		country: 'SUI',
		currentRanking: 85,
		firstRoundOpponent: 'Nadia Podoroska'
	},
	{
		apiId: '34747',
		name: 'Anna Blinkova',
		seed: null,
		country: 'RUS',
		currentRanking: 94,
		firstRoundOpponent: 'Anna Kalinskaya'
	},
	{
		apiId: '32480',
		name: 'Anna Kalinskaya',
		seed: 21,
		country: 'RUS',
		currentRanking: 22,
		firstRoundOpponent: 'Anna Blinkova'
	},
	{
		apiId: '43323',
		name: 'Maja Chwalinska',
		seed: 20,
		country: 'POL',
		currentRanking: 21,
		firstRoundOpponent: 'Taylor Townsend'
	},
	{
		apiId: '13621',
		name: 'Taylor Townsend',
		seed: null,
		country: 'USA',
		currentRanking: 95,
		firstRoundOpponent: 'Maja Chwalinska'
	},
	{
		apiId: '61481',
		name: 'Aoi Ito',
		seed: null,
		country: 'JPN',
		currentRanking: 369,
		firstRoundOpponent: 'Oksana Selekhmeteva'
	},
	{
		apiId: '59448',
		name: 'Oksana Selekhmeteva',
		seed: null,
		country: 'ESP',
		currentRanking: 93,
		firstRoundOpponent: 'Aoi Ito'
	},
	{
		apiId: '18455',
		name: 'Aryna Sabalenka',
		seed: 1,
		country: 'BLR',
		currentRanking: 1,
		firstRoundOpponent: 'Maria Camila Osorio Serrano'
	},
	{
		apiId: '44040',
		name: 'Maria Camila Osorio Serrano',
		seed: null,
		country: 'COL',
		currentRanking: 58,
		firstRoundOpponent: 'Aryna Sabalenka'
	},
	{
		apiId: '14609',
		name: 'Harriet Dart',
		seed: null,
		country: 'GBR',
		currentRanking: 131,
		firstRoundOpponent: 'Peyton Stearns'
	},
	{
		apiId: '53793',
		name: 'Peyton Stearns',
		seed: null,
		country: 'USA',
		currentRanking: 54,
		firstRoundOpponent: 'Harriet Dart'
	},
	{
		apiId: '16043',
		name: 'Anhelina Kalinina',
		seed: null,
		country: 'UKR',
		currentRanking: 49,
		firstRoundOpponent: 'Himeno Sakatsume'
	},
	{
		apiId: '48220',
		name: 'Himeno Sakatsume',
		seed: null,
		country: 'JPN',
		currentRanking: 144,
		firstRoundOpponent: 'Anhelina Kalinina'
	},
	{
		apiId: '49995',
		name: 'Mananchaya Sawangkaew',
		seed: null,
		country: 'THA',
		currentRanking: 97,
		firstRoundOpponent: 'Panna Udvardy'
	},
	{
		apiId: '43866',
		name: 'Panna Udvardy',
		seed: null,
		country: 'HUN',
		currentRanking: 76,
		firstRoundOpponent: 'Mananchaya Sawangkaew'
	},
	{
		apiId: '50943',
		name: 'Sinja Kraus',
		seed: null,
		country: 'AUT',
		currentRanking: 86,
		firstRoundOpponent: 'Karolina Muchova'
	},
	{
		apiId: '18482',
		name: 'Karolina Muchova',
		seed: 7,
		country: 'CZE',
		currentRanking: 7,
		firstRoundOpponent: 'Sinja Kraus'
	},
	{
		apiId: '51696',
		name: 'Oleksandra Oliynykova',
		seed: null,
		country: 'UKR',
		currentRanking: 46,
		firstRoundOpponent: 'Reese Brantmeier'
	},
	{
		apiId: '65420',
		name: 'Reese Brantmeier',
		seed: null,
		country: 'USA',
		currentRanking: 425,
		firstRoundOpponent: 'Oleksandra Oliynykova'
	},
	{
		apiId: '53128',
		name: 'Qinwen Zheng',
		seed: null,
		country: 'CHN',
		currentRanking: 121,
		firstRoundOpponent: 'Kristina Liutova'
	},
	{
		apiId: '96680',
		name: 'Kristina Liutova',
		seed: null,
		country: 'RUS',
		currentRanking: 125,
		firstRoundOpponent: 'Qinwen Zheng'
	},
	{
		apiId: '57147',
		name: 'Elsa Jacquemot',
		seed: null,
		country: 'FRA',
		currentRanking: 113,
		firstRoundOpponent: 'Marie Bouzkova'
	},
	{
		apiId: '24572',
		name: 'Marie Bouzkova',
		seed: 25,
		country: 'CZE',
		currentRanking: 26,
		firstRoundOpponent: 'Elsa Jacquemot'
	},
	{
		apiId: '71163',
		name: 'Sara Bejlek',
		seed: 28,
		country: 'CZE',
		currentRanking: 29,
		firstRoundOpponent: 'Cristina Bucsa'
	},
	{
		apiId: '24344',
		name: 'Cristina Bucsa',
		seed: null,
		country: 'ESP',
		currentRanking: 40,
		firstRoundOpponent: 'Sara Bejlek'
	},
	{
		apiId: '77673',
		name: 'Kaitlin Quevedo',
		seed: null,
		country: 'ESP',
		currentRanking: 107,
		firstRoundOpponent: 'Elise Mertens'
	},
	{
		apiId: '13351',
		name: 'Elise Mertens',
		seed: 23,
		country: 'BEL',
		currentRanking: 24,
		firstRoundOpponent: 'Kaitlin Quevedo'
	},
	{
		apiId: '79778',
		name: 'Lilli Tagger',
		seed: null,
		country: 'AUT',
		currentRanking: 48,
		firstRoundOpponent: 'Tamara Korpatsch'
	},
	{
		apiId: '14694',
		name: 'Tamara Korpatsch',
		seed: null,
		country: 'GER',
		currentRanking: 47,
		firstRoundOpponent: 'Lilli Tagger'
	},
	{
		apiId: '151',
		name: 'Venus Williams',
		seed: null,
		country: 'USA',
		currentRanking: 611,
		firstRoundOpponent: 'Sofia Kenin'
	},
	{
		apiId: '23432',
		name: 'Sofia Kenin',
		seed: null,
		country: 'USA',
		currentRanking: 110,
		firstRoundOpponent: 'Venus Williams'
	},
	{
		apiId: '11371',
		name: 'Elina Svitolina',
		seed: 9,
		country: 'UKR',
		currentRanking: 9,
		firstRoundOpponent: 'Solana Sierra'
	},
	{
		apiId: '61881',
		name: 'Solana Sierra',
		seed: null,
		country: 'ARG',
		currentRanking: 87,
		firstRoundOpponent: 'Elina Svitolina'
	},
	{
		apiId: '42098',
		name: 'Emma Navarro',
		seed: 26,
		country: 'USA',
		currentRanking: 27,
		firstRoundOpponent: 'Lois Boisson'
	},
	{
		apiId: '60758',
		name: 'Lois Boisson',
		seed: null,
		country: 'FRA',
		currentRanking: 236,
		firstRoundOpponent: 'Emma Navarro'
	},
	{
		apiId: '18427',
		name: 'Kimberly Birrell',
		seed: null,
		country: 'AUS',
		currentRanking: 69,
		firstRoundOpponent: 'Petra Marcinko'
	},
	{
		apiId: '73203',
		name: 'Petra Marcinko',
		seed: null,
		country: 'CRO',
		currentRanking: 73,
		firstRoundOpponent: 'Kimberly Birrell'
	},
	{
		apiId: '70326',
		name: 'Taylah Preston',
		seed: null,
		country: 'AUS',
		currentRanking: 100,
		firstRoundOpponent: 'Alycia Parks'
	},
	{
		apiId: '45540',
		name: 'Alycia Parks',
		seed: null,
		country: 'USA',
		currentRanking: 89,
		firstRoundOpponent: 'Taylah Preston'
	},
	{
		apiId: '48900',
		name: 'Mccartney Kessler',
		seed: null,
		country: 'USA',
		currentRanking: 65,
		firstRoundOpponent: 'Ekaterina Alexandrova'
	},
	{
		apiId: '14054',
		name: 'Ekaterina Alexandrova',
		seed: 18,
		country: 'RUS',
		currentRanking: 19,
		firstRoundOpponent: 'Mccartney Kessler'
	},
	{
		apiId: '63750',
		name: 'Carol Young Suh Lee',
		seed: null,
		country: 'USA',
		currentRanking: 143,
		firstRoundOpponent: 'Katie Boulter'
	},
	{
		apiId: '14175',
		name: 'Katie Boulter',
		seed: null,
		country: 'GBR',
		currentRanking: 60,
		firstRoundOpponent: 'Carol Young Suh Lee'
	},
	{
		apiId: '73836',
		name: 'Hanne Vandewinkel',
		seed: null,
		country: 'BEL',
		currentRanking: 77,
		firstRoundOpponent: 'Karolina Pliskova'
	},
	{
		apiId: '7982',
		name: 'Karolina Pliskova',
		seed: null,
		country: 'CZE',
		currentRanking: 56,
		firstRoundOpponent: 'Hanne Vandewinkel'
	},
	{
		apiId: '32633',
		name: 'Lucrezia Stefanini',
		seed: null,
		country: 'ITA',
		currentRanking: 119,
		firstRoundOpponent: 'Dayana Yastremska'
	},
	{
		apiId: '37266',
		name: 'Dayana Yastremska',
		seed: null,
		country: 'UKR',
		currentRanking: 112,
		firstRoundOpponent: 'Lucrezia Stefanini'
	},
	{
		apiId: '47742',
		name: 'Marta Kostyuk',
		seed: 11,
		country: 'UKR',
		currentRanking: 11,
		firstRoundOpponent: 'Storm Hunter'
	},
	{
		apiId: '12722',
		name: 'Storm Hunter',
		seed: null,
		country: 'AUS',
		currentRanking: 169,
		firstRoundOpponent: 'Marta Kostyuk'
	},
	{
		apiId: '55186',
		name: 'Elvina Kalieva',
		seed: null,
		country: 'USA',
		currentRanking: 115,
		firstRoundOpponent: 'Lanlana Tararudee'
	},
	{
		apiId: '66626',
		name: 'Lanlana Tararudee',
		seed: null,
		country: 'THA',
		currentRanking: 72,
		firstRoundOpponent: 'Elvina Kalieva'
	},
	{
		apiId: '4263',
		name: 'Shuai Zhang',
		seed: null,
		country: 'CHN',
		currentRanking: 53,
		firstRoundOpponent: 'Leylah Annie Fernandez'
	},
	{
		apiId: '49081',
		name: 'Leylah Annie Fernandez',
		seed: 31,
		country: 'CAN',
		currentRanking: 32,
		firstRoundOpponent: 'Shuai Zhang'
	},
	{
		apiId: '39540',
		name: 'Emiliana Arango',
		seed: null,
		country: 'COL',
		currentRanking: 84,
		firstRoundOpponent: 'Xinyu Wang'
	},
	{
		apiId: '47152',
		name: 'Xinyu Wang',
		seed: null,
		country: 'CHN',
		currentRanking: 41,
		firstRoundOpponent: 'Emiliana Arango'
	},
	{
		apiId: '11712',
		name: 'Jessica Pegula',
		seed: 3,
		country: 'USA',
		currentRanking: 3,
		firstRoundOpponent: 'Elena Gabriela Ruse'
	},
	{
		apiId: '17774',
		name: 'Elena Gabriela Ruse',
		seed: null,
		country: 'ROU',
		currentRanking: 63,
		firstRoundOpponent: 'Jessica Pegula'
	},
	{
		apiId: '14362',
		name: 'Jasmine Paolini',
		seed: 19,
		country: 'ITA',
		currentRanking: 20,
		firstRoundOpponent: 'Veronika Erjavec'
	},
	{
		apiId: '54393',
		name: 'Veronika Erjavec',
		seed: null,
		country: 'SLO',
		currentRanking: 106,
		firstRoundOpponent: 'Jasmine Paolini'
	},
	{
		apiId: '18403',
		name: 'Renata Zarazua',
		seed: null,
		country: 'MEX',
		currentRanking: 71,
		firstRoundOpponent: 'Polina Iatcenko'
	},
	{
		apiId: '71437',
		name: 'Polina Iatcenko',
		seed: null,
		country: 'RUS',
		currentRanking: 160,
		firstRoundOpponent: 'Renata Zarazua'
	},
	{
		apiId: '45072',
		name: 'Kamilla Rakhimova',
		seed: null,
		country: 'UZB',
		currentRanking: 88,
		firstRoundOpponent: 'Barbora Krejcikova'
	},
	{
		apiId: '13267',
		name: 'Barbora Krejcikova',
		seed: 27,
		country: 'CZE',
		currentRanking: 28,
		firstRoundOpponent: 'Kamilla Rakhimova'
	},
	{
		apiId: '63749',
		name: 'Talia Gibson',
		seed: null,
		country: 'AUS',
		currentRanking: 61,
		firstRoundOpponent: 'Donna Vekic'
	},
	{
		apiId: '13498',
		name: 'Donna Vekic',
		seed: null,
		country: 'CRO',
		currentRanking: 36,
		firstRoundOpponent: 'Talia Gibson'
	}
];

const STATIC_DRAWS: Record<string, { tour: 'atp' | 'wta'; entries: StaticDrawEntry[] }> = {
	'usopen-2026-atp': { tour: 'atp', entries: USOPEN_2026_ATP },
	'usopen-2026-wta': { tour: 'wta', entries: USOPEN_2026_WTA }
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
 * Return the committed static draw for a tournament id (e.g. 'usopen-2026-atp'),
 * or null if there is no US Open static draw for it.
 */
export function getStaticDraw(tournamentId: string): TennisPlayer[] | null {
	const draw = STATIC_DRAWS[tournamentId];
	if (!draw) return null;
	return toTennisPlayers(draw.entries, draw.tour, tournamentId);
}

const FIRST_ROUND_OPPONENTS: Record<string, string> = Object.fromEntries(
	[...USOPEN_2026_ATP, ...USOPEN_2026_WTA].map((e) => [e.apiId, e.firstRoundOpponent])
);

/**
 * Round-1 opponent display name for a player (keyed by RapidAPI/apiId), or null when
 * the player isn't part of a US Open static draw. DISPLAY ONLY — never used in draft rules.
 */
export function getFirstRoundOpponent(playerId: string): string | null {
	return FIRST_ROUND_OPPONENTS[playerId] ?? null;
}
