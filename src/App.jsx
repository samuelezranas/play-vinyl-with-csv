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
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragRef = useRef(null);

  const TRACKS_PER_PAGE = 10;
  const totalPages = Math.ceil(tracks.length / TRACKS_PER_PAGE);
  const paginatedTracks = tracks.slice(
    playlistPage * TRACKS_PER_PAGE,
    (playlistPage + 1) * TRACKS_PER_PAGE
  );

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Audio playback logic
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

  const handleNext = () => {
    if (currentTrackIndex + 1 < tracks.length) {
      setCurrentTrackIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error('Playback error:', err));
      }
    }
    setIsPlaying(!isPlaying);
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

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const parsedTracks = await parseSpotifyCSV(text);
      setTracks(parsedTracks);
      setCurrentTrackIndex(0);
      setPlaylistPage(0);
      setIsPlaying(false);
      setShowPlaylist(false);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please ensure it\'s a valid Spotify Exportify CSV.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drag container
    if (e.target === dragRef.current) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = Array.from(files).find(f => f.type === 'text/csv' || f.name.endsWith('.csv'));
    if (!file) {
      alert('Please drop a CSV file');
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      const parsedTracks = await parseSpotifyCSV(text);
      setTracks(parsedTracks);
      setCurrentTrackIndex(0);
      setPlaylistPage(0);
      setIsPlaying(false);
      setShowPlaylist(false);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please ensure it\'s a valid Spotify Exportify CSV.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTrack = (index) => {
    const globalIndex = playlistPage * TRACKS_PER_PAGE + index;
    setCurrentTrackIndex(globalIndex);
    setIsPlaying(true);
  };

  const handlePrevPage = () => {
    setPlaylistPage(Math.max(0, playlistPage - 1));
  };

  const handleNextPage = () => {
    setPlaylistPage(Math.min(totalPages - 1, playlistPage + 1));
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative">
      {/* Premium Cyber Matrix Background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" />
        
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ y: [-100, 100], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-purple-700/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [100, -100], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-blue-600/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: 360, opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/3 right-0 w-1/2 h-1/2 bg-gradient-to-l from-pink-600/20 to-transparent rounded-full blur-3xl"
        />

        {/* Cyber grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={handleNext} />
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* EMPTY STATE: Glowing Upload Portal */}
      <AnimatePresence mode="wait">
        {tracks.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center z-10"
            ref={dragRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-full max-w-md px-6 md:px-0">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-20"
              >
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-4">
                  !p VINYL CSV
                </h1>
                <p className="text-sm md:text-base text-gray-400 tracking-widest uppercase font-light">
                  Let's turn your playlists into a different experience
                </p>
              </motion.div>

              {/* Glowing Upload Portal */}
              <motion.button
                onClick={handleUploadClick}
                disabled={isLoading}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: isDraggingOver ? 1.15 : 1, 
                  opacity: 1,
                }}
                transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 80 }}
                whileHover={{ scale: isLoading ? 1 : (isDraggingOver ? 1.15 : 1.05) }}
                className="w-full relative group cursor-pointer"
              >
                {/* Portal glow container */}
                <div className="relative w-full aspect-square flex items-center justify-center rounded-3xl overflow-hidden">
                  {/* Animated background gradient - more intense when dragging */}
                  <motion.div
                    animate={{ 
                      opacity: isDraggingOver ? [0.9, 1, 0.9] : [0.6, 1, 0.6],
                    }}
                    transition={{ duration: isDraggingOver ? 1.5 : 2.5, repeat: Infinity }}
                    className={`absolute inset-0 ${
                      isDraggingOver 
                        ? 'bg-gradient-to-br from-cyan-600/50 via-purple-600/40 to-pink-600/30' 
                        : 'bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-blue-600/10'
                    }`}
                  />

                  {/* Pulsing border glow - more intense when dragging */}
                  <motion.div
                    animate={{
                      boxShadow: isDraggingOver
                        ? [
                            '0 0 80px rgba(0,255,255,0.8), 0 0 120px rgba(180,77,255,0.6)',
                            '0 0 120px rgba(0,255,255,1), 0 0 180px rgba(180,77,255,0.9)',
                            '0 0 80px rgba(0,255,255,0.8), 0 0 120px rgba(180,77,255,0.6)',
                          ]
                        : [
                            '0 0 60px rgba(180,77,255,0.6), 0 0 100px rgba(236,72,153,0.4)',
                            '0 0 100px rgba(180,77,255,1), 0 0 150px rgba(236,72,153,0.8)',
                            '0 0 60px rgba(180,77,255,0.6), 0 0 100px rgba(236,72,153,0.4)',
                          ]
                    }}
                    transition={{ duration: isDraggingOver ? 1.5 : 2.5, repeat: Infinity }}
                    className={`absolute inset-0 rounded-3xl border-2 ${
                      isDraggingOver ? 'border-cyan-500/80' : 'border-purple-500/50'
                    }`}
                  />

                  {/* Backdrop blur */}
                  <div className="absolute inset-0 backdrop-blur-3xl rounded-3xl" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center gap-6">
                    {/* Icon */}
                    <motion.div
                      animate={{ 
                        y: isDraggingOver ? [0, -20, 0] : [0, -12, 0], 
                        scale: isDraggingOver ? [1, 1.15, 1] : [1, 1.1, 1]
                      }}
                      transition={{ duration: isDraggingOver ? 1.2 : 2, repeat: Infinity }}
                      className="relative"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: isDraggingOver ? 4 : 8, repeat: Infinity, ease: 'linear' }}
                        className={`absolute inset-0 rounded-full blur-lg opacity-50 ${
                          isDraggingOver 
                            ? 'bg-gradient-to-br from-cyan-500 to-purple-500' 
                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                        }`}
                        style={{ width: 120, height: 120 }}
                      />
                      <motion.div 
                        animate={{
                          boxShadow: isDraggingOver
                            ? '0 0 40px rgba(0,255,255,1), inset 0 0 30px rgba(0,255,255,0.3)'
                            : '0 0 30px rgba(180,77,255,0.8), inset 0 0 20px rgba(255,255,255,0.2)'
                        }}
                        className={`relative w-20 h-20 flex items-center justify-center rounded-full border-2 ${
                          isDraggingOver
                            ? 'bg-gradient-to-br from-cyan-600 to-purple-600 border-cyan-400/80'
                            : 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400/50'
                        }`}
                      >
                        <Upload 
                          size={40} 
                          className={`${isDraggingOver ? 'text-cyan-200' : 'text-white'}`}
                          strokeWidth={1.5} 
                        />
                      </motion.div>
                    </motion.div>

                    {/* Text */}
                    <div className="text-center">
                      <motion.h2
                        animate={{
                          color: isDraggingOver ? '#00ffff' : '#ffffff'
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-xl md:text-2xl font-black mb-2"
                      >
                        {isLoading ? 'Parsing CSV...' : (isDraggingOver ? 'Drop Your Playlist!' : 'Upload Your Playlist')}
                      </motion.h2>
                      <motion.p
                        animate={{
                          color: isDraggingOver ? '#7ffff0' : '#d1d5db'
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-xs md:text-sm leading-relaxed"
                      >
                        {isLoading
                          ? 'Loading your Spotify playlist'
                          : (isDraggingOver ? 'Release to load playlist' : 'Drag or click to load your Spotify Exportify CSV')
                        }
                      </motion.p>
                    </div>

                    {/* Loading indicator */}
                    {isLoading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 border-2 border-transparent border-t-pink-400 border-r-purple-400 rounded-full"
                      />
                    )}

                    {/* Drag indicator particles */}
                    {isDraggingOver && (
                      <>
                        <motion.div
                          animate={{ y: [0, -40], opacity: [1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full blur-sm"
                        />
                        <motion.div
                          animate={{ y: [0, -50], opacity: [1, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                          className="absolute top-10 right-10 w-2 h-2 bg-purple-400 rounded-full blur-sm"
                        />
                        <motion.div
                          animate={{ y: [0, -45], opacity: [1, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }}
                          className="absolute bottom-20 left-1/4 w-2 h-2 bg-pink-400 rounded-full blur-sm"
                        />
                      </>
                    )}
                  </div>
                </div>
              </motion.button>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-xs text-gray-500 mt-8 font-mono tracking-wide"
              >
                Supports Spotify Exportify CSV Format
              </motion.p>
            </div>
          </motion.div>
        ) : (
          /* LOADED STATE: Vinyl Player Interface */
          <motion.div
            key="loaded-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full"
          >
            <LayoutGroup>
              <PlayVinylCSV
                tracks={tracks}
                currentTrackIndex={currentTrackIndex}
                isPlaying={isPlaying}
                paginatedTracks={paginatedTracks}
                playlistPage={playlistPage}
                totalPages={totalPages}
                showPlaylist={showPlaylist}
                isDesktop={isDesktop}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onPrev={handlePrev}
                onSeekBack={handleSeekBack}
                onSeekForward={handleSeekForward}
                onSelectTrack={handleSelectTrack}
                onTogglePlaylist={() => setShowPlaylist(!showPlaylist)}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onUpload={handleUploadClick}
              />
            </LayoutGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
