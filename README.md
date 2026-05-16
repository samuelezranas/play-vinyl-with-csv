# Play Vinyl CSV

🎵 **TECH-FUSION Cyber Vinyl Audio Portal** — A visually stunning React application that transforms Spotify Exportify CSV playlists into an interactive vinyl record player with Blade Runner/Iron Man HUD aesthetics.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-19.2.6-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.1-38b2ac)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.38.0-ff1461)

## ✨ Features

### Empty State
- **Glowing Upload Portal**: Animated entry point with pulsing magenta gradient glow
- **Breathing Animation**: Upload icon rotates with halo glow effect
- **Backdrop Blur**: Ultra-glassmorphism with 64px blur (blur-3xl)
- **Loading States**: Rotating spinner with gradient border during CSV parsing

### Vinyl Player Interface
- **Pure CSS Vinyl Record**: 
  - Rotating turntable with neon cyan glow
  - SVG groove texture (12 concentric circles)
  - Metallic reflection gradient overlay
  - Animated center label with track info
  - Pulsing indicator dot on label
  - Bouncing needle arm during playback

- **Floating Controller Pill** (Desktop):
  - Symmetric 5-button layout: [Prev] [-5s] [Play/Pause] [+5s] [Next]
  - Center play/pause button with **breathing scale animation** (1→1.05→1)
  - Magenta→Pink gradient with pulsing glow shadow
  - Hover effects and disabled state styling

- **Ultra-Glassmorphism**:
  - 40px+ backdrop blur (`backdrop-blur-3xl`)
  - Semi-transparent backgrounds (`rgba(15, 15, 35, 0.8)`)
  - Neon purple/pink borders with inset shadow glow
  - Subtle transparency overlays

### Playlist Management
- **Slide-Out Drawer**:
  - Desktop: Slides from right with `border-left-2 border-purple-500/30`
  - Mobile: Slides from bottom with `border-top-2 border-purple-500/30`
  - Glassmorphic panel with neon borders

- **Pagination System**:
  - 10 tracks per page with prev/next controls
  - Page indicator (e.g., "1-10 / 250")
  - Active track highlighted with pink left border + pulsing indicator
  - Smooth hover animations

- **Track Selection**: Click any track to play instantly

### Background & Aesthetics
- **Cyber-Matrix Background**:
  - Deep slate-950→purple-950→slate-950 gradient base
  - 3 animated floating orbs (purple, blue, pink) with infinite motion
  - Horizontal grid lines with gradient fades
  - No standard grey/blue colors — pure cyberpunk aesthetic

### Audio Playback
- **HTML5 Audio API**: Full control over preview playback
- **Seek Controls**: -5s and +5s buttons for quick navigation
- **Next/Prev**: Navigate through playlist with disabled state at edges
- **Auto-Advance**: Automatically plays next track when current ends
- **Responsive Preview URLs**: Support for Spotify preview URLs

### CSV Parsing
- **Spotify Exportify Format**: Parse CSV exports from Spotify
- **Robust Handling**: Quoted values, escaped commas, multi-line support
- **Track Metadata**: Extracts Track Name, Artist Names, Album, URI
- **Preview URLs**: Integrates with Spotify preview system

### Responsive Design
- **Desktop Layout** (≥768px):
  - Centered vinyl turntable (320px diameter)
  - Large track info display
  - Floating controller pill
  - Side-sliding playlist drawer
  
- **Mobile Layout** (<768px):
  - Fixed glassmorphic top navbar
  - Compact mini controls (play/pause + playlist toggle)
  - Bottom-sliding drawer
  - Touch-optimized buttons

### Animations (Framer Motion)
- **Vinyl Rotation**: Smooth 3s infinite spin during playback
- **Breathing Glow**: 2.5s pulse cycle on play button and portal glow
- **Drawer Slide**: Spring damping (30) + stiffness (300) for smooth entrance
- **Icon Animations**: Floating, rotating, and bouncing effects
- **Track Hover**: Stagger animations on playlist items
- **Layout Transitions**: Responsive design changes with smooth morphing

## 🚀 Quick Start

### As a Demo App

```bash
# Clone the repository
git clone https://github.com/yourusername/play-vinyl-csv.git
cd play-vinyl-csv

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

**Usage:**
1. **Open the app**: Navigate to `http://localhost:5177/`
2. **Upload CSV**: Click the glowing portal or drag a Spotify Exportify CSV file
3. **Play**: Click the center play/pause button to start the vinyl
4. **Navigate**: Use prev/next buttons to skip tracks
5. **Seek**: Use ±5s buttons to jump through tracks
6. **View Playlist**: Click "Playlist ►" to see all tracks with pagination

### As Reusable Components

#### Import the Vinyl Player Component

```jsx
import { PlayVinylCSV, parseSpotifyCSV } from 'play-vinyl-csv';
import { useState } from 'react';

function MyApp() {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    }
  };

  return (
    <PlayVinylCSV
      tracks={tracks}
      currentTrackIndex={currentTrackIndex}
      isPlaying={isPlaying}
      paginatedTracks={tracks.slice(0, 10)}
      playlistPage={0}
      totalPages={1}
      showPlaylist={false}
      isDesktop={true}
      onPlayPause={handlePlayPause}
      onNext={handleNext}
      onPrev={() => setCurrentTrackIndex(Math.max(0, currentTrackIndex - 1))}
      onSeekBack={() => {}}
      onSeekForward={() => {}}
      onSelectTrack={(index) => setCurrentTrackIndex(index)}
      onTogglePlaylist={() => {}}
      onPrevPage={() => {}}
      onNextPage={() => {}}
      onUpload={() => {}}
    />
  );
}

export default MyApp;
```

#### Use CSV Parser Utility

```jsx
import { parseSpotifyCSV } from 'play-vinyl-csv';

async function uploadPlaylist(file) {
  const csvText = await file.text();
  const tracks = parseSpotifyCSV(csvText);
  console.log('Parsed tracks:', tracks);
  return tracks;
}
```

#### Import Styles

```jsx
// In your main app file:
import 'play-vinyl-csv/styles';
```

### Component Props

#### PlayVinylCSV Component

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tracks` | Array | ✓ | Array of track objects with `{trackName, artistNames, album, previewUrl}` |
| `currentTrackIndex` | Number | ✓ | Index of currently playing track |
| `isPlaying` | Boolean | ✓ | Whether vinyl is rotating |
| `paginatedTracks` | Array | ✓ | Subset of tracks for current page |
| `playlistPage` | Number | ✓ | Current page number (0-indexed) |
| `totalPages` | Number | ✓ | Total number of pages |
| `showPlaylist` | Boolean | ✓ | Show/hide playlist drawer |
| `isDesktop` | Boolean | ✓ | Desktop layout (true) or mobile (false) |
| `onPlayPause` | Function | ✓ | Callback for play/pause button |
| `onNext` | Function | ✓ | Callback for next button |
| `onPrev` | Function | ✓ | Callback for prev button |
| `onSeekBack` | Function | ✓ | Callback for seek -5s button |
| `onSeekForward` | Function | ✓ | Callback for seek +5s button |
| `onSelectTrack` | Function | ✓ | Callback for track selection |
| `onTogglePlaylist` | Function | ✓ | Callback for playlist toggle |
| `onPrevPage` | Function | ✓ | Callback for prev page button |
| `onNextPage` | Function | ✓ | Callback for next page button |
| `onUpload` | Function | ✓ | Callback for upload button |

#### parseSpotifyCSV Function

```javascript
import { parseSpotifyCSV } from 'play-vinyl-csv';

// Input: CSV text from Spotify Exportify
const csvText = `Track Name,Artist Name(s),Album,Track Preview URL
"Song 1","Artist 1","Album 1","https://..."
"Song 2","Artist 2","Album 2","https://..."`;

// Output: Array of track objects
const tracks = parseSpotifyCSV(csvText);
// [
//   {
//     trackName: "Song 1",
//     artistNames: "Artist 1",
//     album: "Album 1",
//     uri: "...",
//     previewUrl: "https://...",
//     index: 0
//   },
//   ...
// ]
```

### Spotify Exportify CSV Format

Your CSV file should have these columns:
```csv
Track Name,Artist Name(s),Album,Track Preview URL
Everlong,Foo Fighters,There Is Nothing Left to Lose,https://p.scdn.co/...
The Pretender,Foo Fighters,Echoes Silence Patience & Grace,https://p.scdn.co/...
```

**Note**: You can export playlists from Spotify using the [Exportify](https://www.exportify.net/) tool.

## 🎨 Architecture

### Project Structure
```
play-vinyl-csv/
├── src/
│   ├── App.jsx              # Main app + empty state + background
│   ├── PlayVinylCSV.jsx     # Vinyl player + controller + playlist drawer
│   ├── SpotifyParser.js     # CSV parsing utility
│   ├── index.css            # Global styles + animations
│   └── main.jsx             # React entry point
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── index.html               # HTML template
```

### Component Flow
```
App.jsx (State Management)
├── Empty State (Upload Portal)
│   └── Glowing button + file input
├── Loaded State (Vinyl Player)
│   └── PlayVinylCSV.jsx
│       ├── Vinyl Turntable
│       │   ├── SVG Grooves
│       │   ├── Center Label
│       │   └── Needle Arm
│       ├── Track Info
│       ├── Controller Pill
│       │   └── 5 Buttons
│       └── Playlist Drawer
│           └── Paginated Tracks
└── Background (Animated Gradient Orbs)
```

## 📊 State Management

**App.jsx** manages:
- `tracks`: Array of parsed track objects
- `currentTrackIndex`: Current playing position
- `isPlaying`: Playback state
- `showPlaylist`: Playlist drawer visibility
- `playlistPage`: Current page in playlist
- `isDesktop`: Responsive layout flag
- `isLoading`: CSV parsing state

**PlayVinylCSV.jsx** receives props for all controls and displays responsively.

## 🎬 Key Animations

### Breathing Glow (@keyframes breathe)
```css
@keyframes breathe {
  0%, 100% {
    box-shadow: 0 0 20px rgba(180, 77, 255, 0.6), 
                0 0 40px rgba(236, 72, 153, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(180, 77, 255, 1), 
                0 0 80px rgba(236, 72, 153, 0.7);
  }
}
```
- **Duration**: 2.5 seconds
- **Applied to**: Upload portal, play/pause button, vinyl glow ring
- **Effect**: Creates pulsing neon glow that cycles between bright and dim

### Vinyl Spin (@keyframes vinyl-spin)
```css
@keyframes vinyl-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```
- **Duration**: 3 seconds (linear, infinite)
- **Applied to**: Vinyl record, center label, groove texture
- **Condition**: Only rotates when `isPlaying === true`

### Framer Motion Animations

**Upload Portal (Empty State)**:
```javascript
animate={{
  boxShadow: [
    '0 0 60px rgba(180,77,255,0.6), 0 0 100px rgba(236,72,153,0.4)',
    '0 0 100px rgba(180,77,255,1), 0 0 150px rgba(236,72,153,0.8)',
    '0 0 60px rgba(180,77,255,0.6), 0 0 100px rgba(236,72,153,0.4)',
  ]
}}
transition={{ duration: 2.5, repeat: Infinity }}
```

**Play Button (Breathing Scale)**:
```javascript
animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
transition={isPlaying ? { duration: 1.5, repeat: Infinity } : {}}
```

**Playlist Drawer (Slide-In)**:
```javascript
initial={{ y: isMobileDevice ? '100%' : 0, x: isMobileDevice ? 0 : '100%' }}
animate={{ y: 0, x: 0 }}
exit={{ y: isMobileDevice ? '100%' : 0, x: isMobileDevice ? 0 : '100%' }}
transition={{ type: 'spring', damping: 30, stiffness: 300 }}
```

**Background Orbs (Infinite Motion)**:
```javascript
animate={{ y: [-100, 100], opacity: [0.2, 0.5, 0.2] }}
transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
```

## 🎨 Color Palette

| Color | Value | Usage |
|-------|-------|-------|
| **Neon Purple** | `#b44dff` | Primary glow, borders, buttons |
| **Neon Pink** | `#ec4899` | Secondary glow, gradients |
| **Neon Cyan** | `#00ffff` | Vinyl border, grid lines |
| **Dark Background** | `#0a0a1a` | Base dark color |
| **Slate-950** | `#030712` | Gradient base |
| **Slate-900** | `#111827` | Vinyl surface |

## 💻 Technology Stack

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.6 | UI framework |
| Tailwind CSS | 3.4.1 | Utility-first styling |
| Framer Motion | 12.38.0 | Advanced animations |
| Lucide React | 1.14.0 | Icon library |
| Vite | 8.0.12 | Build tool & dev server |

## 📱 Responsive Breakpoints

- **Desktop**: `≥768px` (md breakpoint)
  - Centered vinyl player
  - Floating controller pill
  - Side-sliding playlist drawer
  - Full animations
  
- **Mobile**: `<768px`
  - Fixed top navbar with mini controls
  - Bottom-sliding playlist drawer
  - Compact layout optimized for touch

## 🔧 Configuration

### Tailwind Config
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Vite Config
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

## 🎵 Audio Integration

- **HTML5 Audio Element**: Native playback control
- **Preview URLs**: Spotify preview URLs (30-second clips)
- **Auto-Advance**: Automatically plays next track on end
- **Seek Control**: ±5 second seek buttons
- **Error Handling**: Graceful fallback for playback errors

## 🚀 Performance Optimizations

- **Pure CSS Vinyl**: No image files, all CSS gradients and SVG
- **Lazy Animations**: Only animate when `isPlaying === true`
- **Efficient Re-renders**: `useMemo` for device detection
- **CSS Classes**: Tailwind utility classes for minimal CSS
- **Gzip Size**: ~106KB (minified)

## 📝 CSV Parsing Details

**SpotifyParser.js** extracts:
- `Track Name`: Song title
- `Artist Name(s)`: Artist(s) comma-separated
- `Album`: Album name
- `Track URI`: Spotify URI for track
- `Track Preview URL`: 30-second preview link

**Example Parsed Output**:
```javascript
{
  trackName: "Everlong",
  artistNames: "Foo Fighters",
  album: "There Is Nothing Left to Lose",
  uri: "spotify:track:...",
  previewUrl: "https://p.scdn.co/mp3-preview/...",
  index: 0
}
```

## 🐛 Troubleshooting

### CSV Not Loading
- Ensure file has `Track Name`, `Artist Name(s)`, and column headers
- Check that preview URLs are valid Spotify URLs

### No Audio Playing
- Verify browser supports HTML5 Audio element
- Check browser console for CORS errors
- Ensure Spotify preview URLs haven't expired

### Animation Stuttering
- Disable hardware acceleration (if on low-end device)
- Check for browser extensions interfering with rendering
- Try a different browser

### Mobile Layout Issues
- Ensure viewport meta tag is present
- Clear browser cache
- Check that window resize event is firing

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes!

## 🙏 Credits

- **Spotify Exportify**: CSV export tool
- **Framer Motion**: Animation library
- **Tailwind CSS**: Styling framework
- **Lucide React**: Icon set
