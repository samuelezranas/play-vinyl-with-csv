import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Upload } from 'lucide-react';
import PlayVinylCSV from './PlayVinylCSV';
import { parseSpotifyCSV } from './SpotifyParser';

function App() {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playlistPage, setPlaylistPage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const TRACKS_PER_PAGE = 10;
  const totalPages = Math.ceil(tracks.length / TRACKS_PER_PAGE);
  const paginatedTracks = tracks.slice(
    playlistPage * TRACKS_PER_PAGE,
    (playlistPage + 1) * TRACKS_PER_PAGE
  );

  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      const currentTrack = tracks[currentTrackIndex];
      if (currentTrack?.previewUrl) {
        audioRef.current.src = currentTrack.previewUrl;
        if (isPlaying) {
          audioRef.current.play().catch(err => console.error('Playback error:', err));
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
    if (currentTrackIndex + 1 < tracks.length) {
      setCurrentTrackIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prev) => prev - 1);
    }
  };

  const handleSeekBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  const handleSeekForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration || 30,
        audioRef.current.currentTime + 5
      );
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvString = e.target?.result;
          if (typeof csvString === 'string') {
            const parsedTracks = parseSpotifyCSV(csvString);
            setTracks(parsedTracks);
            setCurrentTrackIndex(0);
            setIsPlaying(false);
            setPlaylistPage(0);
            setShowDrawer(false);
          }
        } catch (error) {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file. Please check the format.');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleChangeDisc = () => {
    fileInputRef.current?.click();
  };

  const handleSelectTrack = (index) => {
    const globalIndex = playlistPage * TRACKS_PER_PAGE + index;
    setCurrentTrackIndex(globalIndex);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-black">
      {/* Premium Cyber Matrix Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" />
        
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ y: [-50, 50], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-purple-700/40 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [50, -50], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-blue-700/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: 360, opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-gradient-to-l from-pink-600/30 to-transparent rounded-full blur-3xl"
        />
        
        {/* Cyber particles - Grid effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        </div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} onEnded={handleNext} />

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* EMPTY STATE: Show only Upload UI */}
      <AnimatePresence mode="wait">
        {tracks.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8"
          >
            <div className="w-full max-w-2xl">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-24"
              >
                <div className="mb-8">
                  <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-rose-400 bg-clip-text text-transparent tracking-tighter leading-tight">
                    play-vinyl-csv
                  </h1>
                </div>
                <p className="text-gray-400 text-lg md:text-xl font-light tracking-widest uppercase">Analog Cyber Vinyl Player</p>
              </motion.div>

              {/* Upload Dropzone Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="rounded-3xl p-16 md:p-24 relative"
                style={{
                  background: 'rgba(15,15,35,0.7)',
                  backdropFilter: 'blur(40px)',
                  border: '2px solid rgba(255,255,255,0.25)',
                  boxShadow: `
                    0 0 150px rgba(180,77,255,0.6),
                    0 0 80px rgba(236,72,153,0.4),
                    inset 0 0 50px rgba(255,255,255,0.1)
                  `
                }}
              >
                <div className="flex flex-col items-center gap-12">
                  {/* Upload Icon Container */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 80, damping: 12 }}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-3xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(180,77,255,0.5) 0%, rgba(236,72,153,0.4) 100%)',
                      border: '3px solid rgba(255,255,255,0.35)',
                      boxShadow: `
                        0 0 80px rgba(180,77,255,0.6),
                        inset 0 0 40px rgba(255,255,255,0.15)
                      `
                    }}
                  >
                    <Upload size={80} className="text-pink-300" strokeWidth={1.2} />
                  </motion.div>

                  {/* Title & Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">Upload Your Playlist</h2>
                    <p className="text-gray-300 text-lg md:text-xl font-light">Import a Spotify Exportify CSV to start playing</p>
                  </motion.div>

                  {/* Upload Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleChangeDisc}
                    disabled={isLoading}
                    className="px-14 py-6 rounded-full font-black text-white transition-all duration-300 text-2xl flex items-center gap-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(236,72,153,1) 0%, rgba(190,30,120,1) 100%)',
                      border: '2px solid rgba(255,255,255,0.4)',
                      boxShadow: `
                        0 0 60px rgba(236,72,153,0.8),
                        0 0 120px rgba(180,77,255,0.5)
                      `
                    }}
                  >
                    <Upload size={28} strokeWidth={1.5} />
                    <span>{isLoading ? 'Loading...' : 'Select CSV File'}</span>
                  </motion.button>

                  {/* Loading Indicator */}
                  {isLoading && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 border-3 border-transparent border-t-pink-400 border-r-purple-400 rounded-full"
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* LOADED STATE: Show full player interface */
          <motion.div
            key="loaded-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 min-h-screen pt-20 md:pt-8 pb-32 md:pb-12"
          >
            {/* Main Content Area */}
            <div className="flex flex-col items-center justify-center px-4 md:px-8 py-8">
              <div className="w-full max-w-4xl">
                {/* Current Track Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="rounded-3xl p-10 md:p-12 mb-16 relative"
                  style={{
                    background: 'rgba(20,20,50,0.6)',
                    backdropFilter: 'blur(35px)',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    boxShadow: `
                      0 0 100px rgba(180,77,255,0.5),
                      inset 0 0 40px rgba(255,255,255,0.08)
                    `
                  }}
                >
                  <div className="flex items-center gap-10">
                    {tracks[currentTrackIndex]?.albumImageUrl && (
                      <motion.img
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        src={tracks[currentTrackIndex].albumImageUrl}
                        alt="Album"
                        className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover flex-shrink-0 border-2 border-white/20"
                        style={{
                          boxShadow: '0 0 60px rgba(180,77,255,0.6)'
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="text-xs text-pink-400 font-black tracking-widest mb-4 uppercase"
                      >
                        Now Playing
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl md:text-4xl font-black text-white truncate mb-2 tracking-tight"
                      >
                        {tracks[currentTrackIndex]?.trackName}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="text-lg text-gray-300 truncate font-light"
                      >
                        {tracks[currentTrackIndex]?.artistNames}
                      </motion.p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                      className="font-mono text-pink-400 text-right flex-shrink-0"
                    >
                      <div className="text-3xl md:text-4xl font-black tracking-tighter">{currentTrackIndex + 1}</div>
                      <div className="text-sm text-gray-400 font-light">/ {tracks.length}</div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Track Count & Change Disc Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center gap-6">
                    <motion.div
                      className="px-8 py-4 rounded-full border-2 border-pink-500/70 backdrop-blur font-black text-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(236,72,153,0.1) 100%)',
                        boxShadow: '0 0 40px rgba(236,72,153,0.6)',
                        color: '#f472b6'
                      }}
                    >
                      [Total: {tracks.length}]
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleChangeDisc}
                      className="px-8 py-4 rounded-full border-2 border-purple-500/70 backdrop-blur font-black text-lg flex items-center gap-3 transition-all"
                      style={{
                        background: 'linear-gradient(135deg, rgba(180,77,255,0.2) 0%, rgba(180,77,255,0.15) 100%)',
                        boxShadow: '0 0 40px rgba(180,77,255,0.6)',
                        color: '#c084fc'
                      }}
                    >
                      <Upload size={20} strokeWidth={2} />
                      <span className="hidden sm:inline">Change Disc</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDrawer(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-3xl overflow-hidden"
              style={{
                background: 'rgba(15,15,35,0.8)',
                backdropFilter: 'blur(25px)',
                borderTop: '1.5px solid rgba(255,255,255,0.2)',
                boxShadow: '0 -30px 80px rgba(180,77,255,0.5)'
              }}
            >
              {/* Drawer Header */}
              <div className="sticky top-0 border-b border-white/20 p-6 flex items-center justify-between" style={{
                background: 'rgba(15,15,35,0.9)',
                backdropFilter: 'blur(20px)'
              }}>
                <div>
                  <h3 className="text-xl font-black text-white">Playlist</h3>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    Page {playlistPage + 1} of {totalPages}
                  </p>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="overflow-y-auto max-h-[calc(80vh-100px)]">
                <div className="p-4 space-y-2">
                  {paginatedTracks.map((track, index) => {
                    const globalIndex = playlistPage * TRACKS_PER_PAGE + index;
                    const isActive = globalIndex === currentTrackIndex;
                    return (
                      <motion.button
                        key={globalIndex}
                        whileHover={{ x: 4 }}
                        onClick={() => handleSelectTrack(index)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'border border-pink-500/50'
                            : 'border border-white/10 hover:border-white/20'
                        }`}
                        style={{
                          background: isActive
                            ? 'linear-gradient(135deg, rgba(180,77,255,0.3) 0%, rgba(236,72,153,0.3) 100%)'
                            : 'rgba(255,255,255,0.03)'
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-sm font-black font-mono w-8 text-center ${isActive ? 'text-pink-400' : 'text-gray-500'}`}>
                            {globalIndex + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`font-bold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                              {track.trackName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{track.artistNames}</p>
                          </div>
                          {isActive && (
                            <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="sticky bottom-0 border-t border-white/20 p-4 flex items-center justify-between" style={{
                  background: 'rgba(15,15,35,0.9)',
                  backdropFilter: 'blur(20px)'
                }}>
                  <button
                    onClick={() => setPlaylistPage(Math.max(0, playlistPage - 1))}
                    disabled={playlistPage === 0}
                    className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50 transition-colors"
                  >
                    <ChevronUp size={20} className="text-white" />
                  </button>
                  <span className="text-xs text-gray-400 font-mono">
                    {playlistPage * TRACKS_PER_PAGE + 1}-
                    {Math.min((playlistPage + 1) * TRACKS_PER_PAGE, tracks.length)} / {tracks.length}
                  </span>
                  <button
                    onClick={() => setPlaylistPage(Math.min(totalPages - 1, playlistPage + 1))}
                    disabled={playlistPage === totalPages - 1}
                    className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50 transition-colors"
                  >
                    <ChevronDown size={20} className="text-white" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vinyl Player Component */}
      {tracks.length > 0 && (
        <PlayVinylCSV
          tracks={tracks}
          currentTrackIndex={currentTrackIndex}
          isPlaying={isPlaying}
          discImage={tracks[currentTrackIndex]?.albumImageUrl}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeekBack={handleSeekBack}
          onSeekForward={handleSeekForward}
          onToggleDrawer={() => setShowDrawer(!showDrawer)}
        />
      )}
    </div>
  );
}

export default App;
