# Play Vinyl CSV

A premium, production-ready React component that visualizes Spotify Exportify CSV data as a rotating vinyl record with full playback controls.

## Features

- **Glassmorphism UI**: Premium backdrop-blur effects with purple neon glow shadows
- **Pure CSS Vinyl**: Realistic grooves using `repeating-radial-gradient` and shimmer effects with `conic-gradient`
- **Full Controller Suite**: SkipBack, Seek -5s, Play/Pause, Seek +5s, SkipForward with tooltips
- **Responsive Design**: Floating pill on desktop (expands/contracts with Framer Motion), top navbar on mobile
- **Smooth Animations**: Infinite 360-degree rotation during playback
- **Dynamic CSV Loading**: File uploader with loading states and instant playlist updates
- **Audio Streaming**: HTML5 Audio API for 30-second Spotify previews
- **Robust Parsing**: Handles quoted CSV values and escaped commas

## Installation

```bash
npm install @jet/play-vinyl-csv
```

## Usage

```jsx
import { PlayVinylCSV, parseSpotifyCSV } from '@jet/play-vinyl-csv';

function MyApp() {
  const csvString = `"Track Name","Artist Name(s)","Album Image URL","Track Preview URL"
"Bohemian Rhapsody","Queen","https://example.com/image.jpg","https://example.com/preview.mp3"`;

  const tracks = parseSpotifyCSV(csvString);

  return (
    <PlayVinylCSV
      tracks={tracks}
      currentTrackIndex={0}
      isPlaying={false}
      discImage="https://example.com/disc.jpg"
      onPlayPause={() => {}}
      onNext={() => {}}
      onPrev={() => {}}
      onSeekBack={() => {}}
      onSeekForward={() => {}}
      onChangeDisc={() => {}}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tracks` | Array | `[]` | Array of track objects from `parseSpotifyCSV` |
| `currentTrackIndex` | Number | `0` | Index of currently playing track |
| `isPlaying` | Boolean | `false` | Whether the vinyl is rotating |
| `discImage` | String | `null` | URL for center disc image |
| `onPlayPause` | Function | - | Callback for play/pause button |
| `onNext` | Function | - | Callback for next track button |
| `onPrev` | Function | - | Callback for previous track button |
| `onSeekBack` | Function | - | Callback for seek -5s button |
| `onSeekForward` | Function | - | Callback for seek +5s button |
| `onChangeDisc` | Function | - | Callback for change disc button |
| `className` | String | `''` | Additional CSS classes |

## CSV Format

Expects CSV data from Spotify Exportify with these headers:
- `Track Name`
- `Artist Name(s)`
- `Album Image URL`
- `Track Preview URL`

## Demo

Run the included demo:

```bash
npm install
npm run dev
```

Upload a Spotify Exportify CSV file to experience the full vinyl player with all controls!

## Technical Details

- **CSS-Only Vinyl**: No images, pure gradients for maximum performance
- **Glassmorphism**: `backdrop-blur-xl`, `bg-white/5`, thin borders, neon shadows
- **Responsive**: Desktop pill expands on play, mobile snaps to top navbar
- **Audio**: HTML5 Audio with seek controls and auto-advancement
- **Parsing**: Robust CSV handling for quoted fields and commas
