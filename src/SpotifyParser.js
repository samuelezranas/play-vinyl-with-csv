import { getSpotifyTracks } from './SpotifyAPI.js';

/**
 * Extract Spotify track ID from URI
 * Format: spotify:track:XXXXX or https://open.spotify.com/track/XXXXX
 */
const extractTrackId = (uri) => {
  if (!uri) return null;
  const match = uri.match(/(?:spotify:track:|\/track\/)([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};

/**
 * Parse CSV line with proper quoted field handling
 * Handles fields enclosed in double quotes that may contain commas
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());

  // Remove surrounding quotes from fields
  return result.map(field => {
    if (field.startsWith('"') && field.endsWith('"')) {
      return field.slice(1, -1);
    }
    return field;
  });
};

/**
 * Parse Spotify Exportify CSV format
 * Expected columns: Track URI, Track Name, Artist Name(s), Album Name, etc.
 * Supports both Spotify API and direct preview URLs in CSV
 */
export const parseSpotifyCSV = async (csvText) => {
  try {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file is empty or invalid');
    }

    const headerLine = parseCSVLine(lines[0]);
    const headers = headerLine.map(h => h.trim().toLowerCase());
    const trackNameIndex = headers.findIndex(h => h.includes('track name'));
    const artistIndex = headers.findIndex(h => h.includes('artist name'));
    const albumIndex = headers.findIndex(h => h.includes('album'));
    const uriIndex = headers.findIndex(h => h.includes('uri'));
    const previewIndex = headers.findIndex(h => h.includes('preview'));
    const durationIndex = headers.findIndex(h => h.includes('duration'));

    if (trackNameIndex === -1 || artistIndex === -1) {
      throw new Error('Invalid CSV format: Missing required columns');
    }

    const tracks = [];
    const trackIds = [];

    // First pass: parse CSV
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cells = parseCSVLine(line);
      const trackName = cells[trackNameIndex] || 'Unknown';
      const artistNames = cells[artistIndex] || 'Unknown Artist';
      const album = albumIndex !== -1 ? cells[albumIndex] : 'Unknown Album';
      const uri = uriIndex !== -1 ? cells[uriIndex] : '';
      const csvPreviewUrl = previewIndex !== -1 ? cells[previewIndex] : '';
      const duration = durationIndex !== -1 ? parseInt(cells[durationIndex]) : null;
      const trackId = extractTrackId(uri);

      tracks.push({
        trackName,
        artistNames,
        album,
        uri,
        trackId,
        previewUrl: csvPreviewUrl || null,
        albumImageUrl: null,
        duration: duration,
        index: tracks.length
      });

      if (trackId && !csvPreviewUrl) {
        // Only query API if CSV doesn't have preview URL
        trackIds.push({ index: tracks.length - 1, trackId });
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎵 SPOTIFY PLAYLIST LOADER`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Total tracks: ${tracks.length}`);
    
    // Second pass: fetch missing preview URLs from Spotify API
    if (trackIds.length > 0) {
      console.log(`\nFetching ${trackIds.length} tracks from Spotify API...`);
      
      try {
        const spotifyTrackIds = trackIds.map(t => t.trackId);
        const spotifyTracks = await getSpotifyTracks(spotifyTrackIds);
        console.log(`✓ Retrieved ${spotifyTracks.length} tracks from Spotify API\n`);

        spotifyTracks.forEach(spotifyTrack => {
          const trackIdEntry = trackIds.find(t => t.trackId === spotifyTrack.id);
          if (trackIdEntry) {
            const trackIndex = trackIdEntry.index;
            
            if (spotifyTrack.preview_url) {
              tracks[trackIndex].previewUrl = spotifyTrack.preview_url;
              console.log(`  ✓ Track ${trackIndex + 1}: "${tracks[trackIndex].trackName}"`);
            } else {
              console.warn(`  ⚠ Track ${trackIndex + 1}: "${tracks[trackIndex].trackName}" - No preview`);
            }

            if (spotifyTrack.album?.images?.[0]?.url) {
              tracks[trackIndex].albumImageUrl = spotifyTrack.album.images[0].url;
            }
            if (spotifyTrack.duration_ms) {
              tracks[trackIndex].duration = spotifyTrack.duration_ms;
            }
          }
        });
      } catch (error) {
        console.warn('⚠ Spotify API error:', error.message);
        console.warn('Continuing with CSV preview URLs only (if available)...\n');
      }
    }

    const previewCount = tracks.filter(t => t.previewUrl).length;
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✓ Playlist ready: ${previewCount}/${tracks.length} tracks with audio`);
    if (previewCount < tracks.length) {
      console.log(`⚠ ${tracks.length - previewCount} tracks without preview URLs`);
    }
    console.log(`${'='.repeat(60)}\n`);

    return tracks;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
};
