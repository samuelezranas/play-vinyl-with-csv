# 📖 Usage Guide & Documentation — play-vinyl-csv

This official documentation provides comprehensive instructions on how to export your playlist data from Spotify using **Exportify** and integrate it seamlessly into the **Play Vinyl CSV** application.

---

## 🛠️ Step 1: Exporting Playlists via Exportify

To generate a `.csv` file that is fully compatible with this component, you need to use a third-party tool called **Exportify**.

1. **Open the Web App**: Navigate to the official [Exportify](https://watsonbox.github.io/exportify/) website.
2. **Authorize Your Account**: Click the **"Log In With Spotify"** button. Log in using your Spotify credentials and agree to the read-only playlist permissions.
3. **Select Your Playlist**: Once logged in, a full list of your personal and followed Spotify playlists will be displayed on the dashboard.
4. **Export the Data**: 
   - Find the specific playlist you want to display (e.g., your favorite rock hits or portfolio theme tracks).
   - Click the **"Export"** button on the right-hand side of that playlist row.
5. **Save the File**: A `.csv` file (e.g., `MyPlaylist.csv`) will automatically download to your local machine.

> ⚠️ **IMPORTANT**: Do not alter, rename, or rearrange the header columns of the downloaded `.csv` file. The `SpotifyParser.js` module relies heavily on the default structure to extract metadata cleanly.

---

## 💿 Step 2: Valid CSV Header Structure

The `play-vinyl-csv` parsing engine is strictly mapped to read the standard output columns provided by Exportify:

| Column Header Name | Data Description | UI Output Mapping |
| :--- | :--- | :--- |
| `Track Name` | The title of the song (e.g., "My Hero") | Main Title & Center Vinyl Label |
| `Artist Name(s)` | The name of the artist/band (e.g., "Foo Fighters") | Subtitle Artist Display |
| `Album` | Name of the recorded album | Playlist Drawer Metadata |
| `Track Preview URL` | A link to the 30-second audio stream | HTML5 Audio Playback Engine |

---

## 🚀 Step 3: Integrating the Component

Once you have your `.csv` data, you can implement it using two different workflows inside your React (Vite) project:

### Method A: Dynamic Client-Side Upload (User-Facing)
Prompt users to click the dropzone portal or the **"Load CSV"** button on the main showcase page. The app handles this instantly using the browser's native `FileReader API` with zero server overhead or latency.

### Method B: Hard-Coded Playlist (Developer-Facing)
If you want to bake a specific playlist permanently into your website or portfolio:
1. Move the `.csv` file into your project's asset folder (e.g., `src/assets/my-playlist.csv`).
2. Import the file using Vite's custom `?raw` suffix to evaluate it as a plain text string block.

```jsx
import React, { useState } from 'react';
import { PlayVinylCSV } from './components/PlayVinylCSV';
import rawPlaylistData from './assets/my-playlist.csv?raw';
import { parseSpotifyCSV } from './utils/SpotifyParser';

export default function PortfolioMusic() {
  // Parse the raw string block directly during state initialization
  const [tracks] = useState(() => parseSpotifyCSV(rawPlaylistData));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="music-section-wrapper">
      <PlayVinylCSV 
        tracks={tracks}
        currentTrackIndex={currentIndex}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => setCurrentIndex(i => Math.min(tracks.length - 1, i + 1))}
        onPrev={() => setCurrentIndex(i => Math.max(0, i - 1))}
        isDesktop={true}
      />
    </div>
  );
}
