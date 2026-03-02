import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPlayersPath = path.join(__dirname, 'raw-html-players.html');
const rankingsPath = path.join(__dirname, 'player-rankings.html');
const outPath = path.join(__dirname, 'players.ts');

try {
    // 1. Parse Tournament Players (Seed, Country, Name)
    const playersHtml = fs.readFileSync(htmlPlayersPath, 'utf8');
    const playerBlocks = playersHtml.split('class="player-row"');
    const tournamentPlayers = [];
    let idCounter = 1;

    for (let i = 1; i < playerBlocks.length; i++) {
        const block = playerBlocks[i];

        const countryMatch = block.match(/href="https:\/\/ausopen\.com\/players\/([^\/]+)\/[^"]+"/);
        let countrySlug = 'unknown';
        if (countryMatch) countrySlug = countryMatch[1];

        const nameSeedMatch = block.match(/<p>\s*(.*?)\s*<span>(.*?)<\/span>\s*<\/p>/s);

        if (nameSeedMatch) {
            let name = nameSeedMatch[1].trim();
            let seedStr = nameSeedMatch[2].trim();

            let seed = null;
            if (/^\d+$/.test(seedStr)) {
                seed = parseInt(seedStr, 10);
            }

            if (!name) continue;

            const country = formatCountry(countrySlug);
            const initials = getInitials(name); // For image placeholder if needed

            tournamentPlayers.push({
                id: String(idCounter++),
                name: name,
                seed: seed,
                country: country,
                image: `https://placehold.co/150?text=${initials}`,
                points: 0, // Placeholder, will update from rankings
                currentRanking: null // Placeholder
            });
        }
    }

    // 2. Parse Rankings (Rank, Name, Points)
    const rankingsHtml = fs.readFileSync(rankingsPath, 'utf8');
    // Split by <tr> to get rows
    const rankingRows = rankingsHtml.split('<tr');
    const rankingMap = new Map(); // Key: Normalized Name, Value: { rank, points }

    for (const row of rankingRows) {
        // Simple regexes for fields within a row
        // Rank: <td class="rk">1</td>
        const rankMatch = row.match(/<td class="rk">(\d+)<\/td>/);
        // Name: <td class="pn">Carlos Alcaraz</td>
        const nameMatch = row.match(/<td class="pn">(.*?)<\/td>/);
        // Points: <td>12050</td> - usually follows country which is <td class="sm" p="1">ESP</td>
        // Note: The points <td> doesn't have a class, but it usually contains a number and follows the country.
        // Let's find the country TD, then look for the next TD with a number.
        // Or simpler: Find <td>(\d+(?:,\d+)*)</td> but that might match other things.
        // Let's look at the structure: <td class="sm" p="1">ESP</td> <td>12050</td>
        const pointsMatch = row.match(/<td class="sm" p="\d+">[A-Z]{3}<\/td>\s*<td>([\d,]+)<\/td>/);

        if (rankMatch && nameMatch && pointsMatch) {
            const rank = parseInt(rankMatch[1], 10);
            const fullName = nameMatch[1].trim();
            const points = parseInt(pointsMatch[1].replace(/,/g, ''), 10);

            const normalized = normalizeName(fullName);
            rankingMap.set(normalized, { rank, points });
        }
    }

    // 3. Merge Data
    let matchedCount = 0;
    for (const player of tournamentPlayers) {
        // Normalize tournament player name (e.g. "C. Alcaraz")
        const norm = normalizeTournamentName(player.name);

        let match = rankingMap.get(norm);

        // Retry with slightly looser matching if needed? 
        // e.g. "A. De Minaur" vs "A de Minaur"
        if (!match) {
            // Try removing periods from tournament name if not already done
            // Try handling accents
        }

        if (match) {
            player.points = match.points;
            player.currentRanking = match.rank;
            matchedCount++;
        } else {
            // Some players might not have a ranking in top 50/100 or whatever the file has
            // Or name mismatch.
            // console.log(`No match for ${player.name} (Norm: ${norm})`);
        }
    }

    // Generate TypeScript content
    const jsonStr = JSON.stringify(tournamentPlayers, null, 4);
    const tsArrayStr = jsonStr.replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");

    const fileContent = `import type { TennisPlayer } from '$lib/types';

export const TENNIS_PLAYERS: TennisPlayer[] = ${tsArrayStr};
`;

    fs.writeFileSync(outPath, fileContent);
    console.log(`Successfully processed players.`);
    console.log(`Total Players: ${tournamentPlayers.length}`);
    console.log(`Matched with Rankings: ${matchedCount}`);

} catch (err) {
    console.error('Error processing players:', err);
}

function formatCountry(slug) {
    if (!slug) return 'Unknown';
    if (slug === 'united-states-america') return 'USA';
    if (slug === 'united-kingdom') return 'UK';
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getInitials(name) {
    const parts = name.replace(/\./g, '').split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().substring(0, 3);
}

// Normalizer for "Carlos Alcaraz" -> "c alcaraz" (first initial + last name)
// Also handles accents
function normalizeName(fullName) {
    const parts = fullName.trim().toLowerCase().split(/\s+/);
    if (parts.length === 0) return '';
    // Handle "Alex de Minaur" -> "a de minaur" ? Or "a minaur"?
    // Tournament name: "A. de Minaur". So rank name "Alex de Minaur" should become "a de minaur".
    // Strategy: Take first letter of first part, then keep the rest of the parts.
    const firstInitial = parts[0][0];
    const rest = parts.slice(1).join(' ');
    return removeAccents(`${firstInitial} ${rest}`);
}

// Normalizer for "C. Alcaraz" -> "c alcaraz"
function normalizeTournamentName(name) {
    // Remove dots
    let cleaned = name.replace(/\./g, '').toLowerCase().trim();
    // "c alcaraz"
    // "a de minaur"
    // If double spaces, fix
    cleaned = cleaned.replace(/\s+/g, ' ');
    return removeAccents(cleaned);
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
