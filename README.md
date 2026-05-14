# Play Vinyl CSV

A premium, reusable React component that visualizes Spotify Exportify CSV data as a rotating vinyl record with playback controls.

## Features

- **CSS-Only Vinyl Design**: Realistic grooves using `repeating-radial-gradient` and shimmer effects with `conic-gradient`
- **Responsive Layouts**: Floating glassmorphism pill on desktop, slim navbar on mobile
- **Smooth Animations**: 360-degree rotation during playback using Framer Motion
- **Audio Playback**: HTML5 Audio API integration for track previews
- **File Upload**: Dynamic CSV loading with FileReader API
- **Customizable**: Optional disc image prop for center labels

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
| `onChangeDisc` | Function | - | Callback for change disc button |
| `className` | String | `''` | Additional CSS classes |

## CSV Format

The component expects CSV data from Spotify Exportify with these headers:
- `Track Name`
- `Artist Name(s)`
- `Album Image URL`
- `Track Preview URL`

## Dependencies

- React 16+
- Framer Motion
- Tailwind CSS
- Lucide React

## Demo

Run the included demo:

```bash
npm install
npm run dev
```

Upload a Spotify Exportify CSV file to see the vinyl player in action!
