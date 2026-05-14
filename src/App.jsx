import { useState, useRef, useEffect } from 'react';
import PlayVinylCSV from './PlayVinylCSV';
import { parseSpotifyCSV } from './SpotifyParser';

const defaultCSV = `"Track Name","Artist Name(s)","Album Image URL","Track Preview URL"
"Bohemian Rhapsody","Queen","https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b","https://p.scdn.co/mp3-preview/1234567890abcdef"
"Stairway to Heaven","Led Zeppelin","https://i.scdn.co/image/ab67616d0000b2731234567890abcdef","https://p.scdn.co/mp3-preview/abcdef1234567890"
"Hotel California","Eagles","https://i.scdn.co/image/ab67616d0000b273fedcba0987654321","https://p.scdn.co/mp3-preview/fedcba0987654321"`;

function App() {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load default CSV
    try {
      const parsedTracks = parseSpotifyCSV(defaultCSV);
      setTracks(parsedTracks);
    } catch (error) {
      console.error('Error parsing default CSV:', error);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      const currentTrack = tracks[currentTrackIndex];
      if (currentTrack?.previewUrl) {
        audioRef.current.src = currentTrack.previewUrl;
        if (isPlaying) {
          audioRef.current.play();
        }
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvString = e.target.result;
          const parsedTracks = parseSpotifyCSV(csvString);
          setTracks(parsedTracks);
          setCurrentTrackIndex(0);
          setIsPlaying(false);
        } catch (error) {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleChangeDisc = () => {
    document.getElementById('csv-upload').click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-xl">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Play Vinyl CSV</h1>
        <p className="text-white/80 text-center mb-8">
          Upload your Spotify Exportify CSV to play your favorite tracks with a vintage vinyl experience.
        </p>

        <div className="flex justify-center mb-8">
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={handleChangeDisc}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Change Disc
          </button>
        </div>

        {tracks.length > 0 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Current Playlist</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tracks.map((track, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentTrackIndex
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  onClick={() => setCurrentTrackIndex(index)}
                >
                  <div className="font-medium">{track.trackName}</div>
                  <div className="text-sm">{track.artistNames}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <audio ref={audioRef} onEnded={handleNext} />

      <PlayVinylCSV
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        discImage={tracks[currentTrackIndex]?.albumImageUrl}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onChangeDisc={handleChangeDisc}
      />
    </div>
  );
}

export default App;
