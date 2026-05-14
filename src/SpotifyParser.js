// SpotifyParser.js
// Parses Exportify CSV string into track array

export function parseSpotifyCSV(csvString) {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const trackNameIndex = headers.indexOf('Track Name');
  const artistIndex = headers.indexOf('Artist Name(s)');
  const albumImageIndex = headers.indexOf('Album Image URL');
  const previewIndex = headers.indexOf('Track Preview URL');

  if (trackNameIndex === -1 || artistIndex === -1 || albumImageIndex === -1 || previewIndex === -1) {
    throw new Error('Required CSV headers not found');
  }

  const tracks = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= headers.length) {
      tracks.push({
        trackName: values[trackNameIndex] || '',
        artistNames: values[artistIndex] || '',
        albumImageUrl: values[albumImageIndex] || '',
        previewUrl: values[previewIndex] || '',
      });
    }
  }
  return tracks;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}