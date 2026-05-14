/**
 * Parse Spotify Exportify CSV format
 * Expected columns: Track URI, Track Name, Artist Name(s), Album Name, etc.
 */
export const parseSpotifyCSV = (csvText) => {
  try {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file is empty or invalid');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const trackNameIndex = headers.findIndex(h => h.includes('track name'));
    const artistIndex = headers.findIndex(h => h.includes('artist'));
    const albumIndex = headers.findIndex(h => h.includes('album'));
    const uriIndex = headers.findIndex(h => h.includes('uri'));

    if (trackNameIndex === -1 || artistIndex === -1) {
      throw new Error('Invalid CSV format: Missing required columns');
    }

    const tracks = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cells = line.split(',').map(cell => cell.trim());
      const trackName = cells[trackNameIndex] || 'Unknown';
      const artistNames = cells[artistIndex] || 'Unknown Artist';
      const album = albumIndex !== -1 ? cells[albumIndex] : 'Unknown Album';
      const uri = uriIndex !== -1 ? cells[uriIndex] : '';

      // Get preview URL from Spotify API (if available)
      // For now, we'll use a placeholder and fetch dynamically if needed
      tracks.push({
        trackName,
        artistNames,
        album,
        uri,
        previewUrl: null,
        albumImageUrl: null,
        index: tracks.length
      });
    }

    return tracks;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
};
