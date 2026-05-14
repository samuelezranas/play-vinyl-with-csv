// SpotifyParser.js
// Robust CSV parser for Spotify Exportify format
// Handles quoted values, escaped commas, and standard CSV structure

/**
 * Parses a CSV string into an array of track objects
 * @param {string} csvString - The raw CSV string from Exportify
 * @returns {Array} Array of track objects with trackName, artistNames, albumImageUrl, previewUrl
 * @throws {Error} If required headers are missing
 */
export function parseSpotifyCSV(csvString) {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return [];

  // Parse header row
  const headers = parseCSVLine(lines[0]);
  const requiredHeaders = ['Track Name', 'Artist Name(s)', 'Album Image URL', 'Track Preview URL'];

  // Map header indices
  const headerMap = {};
  for (let i = 0; i < headers.length; i++) {
    headerMap[headers[i]] = i;
  }

  // Validate required headers
  for (const header of requiredHeaders) {
    if (!(header in headerMap)) {
      throw new Error(`Required CSV header "${header}" not found`);
    }
  }

  // Parse data rows
  const tracks = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= headers.length) {
      tracks.push({
        trackName: values[headerMap['Track Name']] || '',
        artistNames: values[headerMap['Artist Name(s)']] || '',
        albumImageUrl: values[headerMap['Album Image URL']] || '',
        previewUrl: values[headerMap['Track Preview URL']] || '',
      });
    }
  }
  return tracks;
}

/**
 * Parses a single CSV line, handling quoted values and commas within quotes
 * @param {string} line - A single line from the CSV
 * @returns {Array} Array of parsed values
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  // Add the last field
  result.push(current);
  return result;
}