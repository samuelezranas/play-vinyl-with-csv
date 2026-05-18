import { useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';

export default function PlayVinylCSV({
  tracks,
  currentTrackIndex,
  isPlaying,
  paginatedTracks,
  playlistPage,
  totalPages,
  showPlaylist,
  isDesktop,
  onPlayPause,
  onNext,
  onPrev,
  onSeekBack,
  onSeekForward,
  onSelectTrack,
  onTogglePlaylist,
  onPrevPage,
  onNextPage,
  onUpload,
}) {
  const isMobileDevice = useMemo(() => !isDesktop, [isDesktop]);

  return (
    <LayoutGroup>
      {/* Desktop Layout */}
      {isDesktop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 flex items-center justify-center p-8 z-10"
        >
          <div className="w-full max-w-5xl h-full flex flex-col items-center justify-center gap-12">
            {/* Vinyl Turntable Section */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 100 }}
              className="relative w-80 h-80 rounded-full flex items-center justify-center"
            >
              {/* Vinyl Record Container */}
              <div className="relative w-full h-full">
                {/* Outer turntable base */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-cyan-400/30"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(180,77,255,0.05) 100%)',
                    boxShadow: '0 0 60px rgba(0,255,255,0.3), inset 0 0 40px rgba(0,255,255,0.1)',
                  }}
                />

                {/* Vinyl Record (Pure CSS) */}
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : {}}
                  transition={isPlaying ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}
                  className="absolute inset-4 rounded-full overflow-hidden"
                >
                  {/* Matte black base */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-950 rounded-full" />

                  {/* Vinyl groove texture */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
                    <defs>
                      <radialGradient id="vinyl-groove">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.005)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
                      </radialGradient>
                    </defs>
                    {[...Array(12)].map((_, i) => (
                      <circle
                        key={i}
                        cx="100"
                        cy="100"
                        r={20 + i * 14}
                        fill="none"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="1"
                      />
                    ))}
                  </svg>

                  {/* Vinyl reflection */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 via-transparent to-cyan-600/20" />
                </motion.div>

                {/* Center label */}
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : {}}
                  transition={isPlaying ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}
                  className="absolute inset-20 rounded-full flex flex-col items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #b44dff 0%, #ec4899 50%, #b44dff 100%)',
                    boxShadow: '0 0 40px rgba(180,77,255,0.8), inset 0 0 20px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="text-center px-4">
                    <p className="text-white font-black text-xs tracking-widest uppercase mb-1">Now Playing</p>
                    <p className="text-white font-black text-sm line-clamp-2">
                      {tracks[currentTrackIndex]?.trackName || 'No Track'}
                    </p>
                    <p className="text-white/70 font-light text-xs mt-2 line-clamp-1">
                      {tracks[currentTrackIndex]?.artistNames || 'Unknown Artist'}
                    </p>
                  </div>

                  {/* Spinning center dot */}
                  <motion.div
                    animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                    transition={isPlaying ? { duration: 1, repeat: Infinity } : {}}
                    className="absolute w-3 h-3 bg-white rounded-full top-6 opacity-80"
                  />
                </motion.div>

                {/* Needle arm */}
                <motion.div
                  animate={isPlaying ? { rotate: [0, 5, 0] } : {}}
                  transition={isPlaying ? { duration: 0.5, repeat: Infinity, repeatType: 'mirror' } : {}}
                  className="absolute top-0 right-1/4 w-16 h-24 origin-top"
                  style={{
                    transformOrigin: '50% 0%',
                  }}
                >
                  <div className="w-1 h-full bg-gradient-to-b from-gray-300 to-gray-600 rounded-full" />
                  <div className="absolute -bottom-3 -right-1 w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-700 rounded-full border border-gray-300" />
                </motion.div>
              </div>

              {/* Glow ring around vinyl */}
              <motion.div
                animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : {}}
                transition={isPlaying ? { duration: 2, repeat: Infinity } : {}}
                className="absolute -inset-8 rounded-full border-2 border-purple-500/30"
                style={{
                  boxShadow: isPlaying
                    ? '0 0 60px rgba(180,77,255,0.6), 0 0 120px rgba(236,72,153,0.4)'
                    : '0 0 20px rgba(180,77,255,0.3)',
                }}
              />
            </motion.div>

            {/* Track Info & Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-purple-400 font-black text-sm tracking-widest uppercase mb-2">
                {currentTrackIndex + 1} / {tracks.length}
              </p>
              <h2 className="text-3xl font-black text-white mb-2 line-clamp-2">
                {tracks[currentTrackIndex]?.trackName}
              </h2>
              <p className="text-gray-400 text-sm">
                {tracks[currentTrackIndex]?.artistNames}
              </p>
              {tracks[currentTrackIndex]?.previewUrl ? (
                <p className="text-green-400 text-xs mt-2 font-semibold tracking-widest uppercase">
                  ✓ Preview Available
                </p>
              ) : (
                <p className="text-orange-400 text-xs mt-2 font-semibold tracking-widest uppercase">
                  ⚠ Preview Unavailable
                </p>
              )}
            </motion.div>

            {/* Floating Controller Pill */}
            <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, type: 'spring', stiffness: 100 }}
            className="glass neon-border rounded-full px-8 py-6 flex items-center gap-8"
            >
            {/* Prev Button */}
            <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onPrev}
                disabled={currentTrackIndex === 0}
                title="Previous Track"
                aria-label="Previous Track"
                className="p-3 rounded-full hover:bg-purple-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
                <SkipBack size={24} className="text-purple-400" />
            </motion.button>

            {/* Seek Back (-5s) */}
            <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSeekBack}
                title="Rewind 5 Seconds"
                aria-label="Rewind 5 Seconds"
                className="p-3 rounded-full hover:bg-purple-500/20 transition-all relative flex items-center justify-center cursor-pointer"
            >
                <RotateCcw size={20} className="text-gray-400" />
                <span className="absolute text-[9px] font-mono font-bold text-gray-400 top-[17px]">
                5
                </span>
            </motion.button>

            {/* Play/Pause - Center */}
            <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 1.0 }}
            onClick={onPlayPause}
            title={isPlaying ? "Pause" : "Play"}
            className="relative p-4 rounded-full"
            style={{
                background: 'linear-gradient(135deg, #b44dff 0%, #ec4899 100%)',
                boxShadow: isPlaying
                ? '0 0 40px rgba(180,77,255,0.8), 0 0 80px rgba(236,72,153,0.6)'
                : '0 0 20px rgba(180,77,255,0.4)',
            }}
            animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
            transition={isPlaying ? { duration: 1.5, repeat: Infinity } : {}}
            >
            {isPlaying ? (
                <Pause size={28} className="text-white" fill="white" />
            ) : (
                <Play size={28} className="text-white" fill="white" />
            )}
            </motion.button>

            {/* Seek Forward (+5s) */}
            <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSeekForward}
                title="Forward 5 Seconds"
                aria-label="Forward 5 Seconds"
                className="p-3 rounded-full hover:bg-purple-500/20 transition-all relative flex items-center justify-center cursor-pointer"
            >
                {/* Menggunakan RotateCcw yang di-rotate 180 derajat untuk fungsi Forward (searah jarum jam) */}
                <RotateCcw size={20} className="text-gray-400 transform rotate-180 scale-x-[-1]" />
                <span className="absolute text-[9px] font-mono font-bold text-gray-400 top-[17px]">
                5
                </span>
            </motion.button>

            {/* Next Button */}
            <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onNext}
                disabled={currentTrackIndex === tracks.length - 1}
                title="Next Track"
                aria-label="Next Track"
                className="p-3 rounded-full hover:bg-purple-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
                <SkipForward size={24} className="text-purple-400" />
            </motion.button>
            </motion.div>

            {/* Playlist Toggle & Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onTogglePlaylist}
                className="glass neon-border rounded-full px-6 py-3 font-black text-sm uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-all"
              >
                {showPlaylist ? '◄ Hide' : 'Playlist ►'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onUpload}
                className="glass rounded-full px-6 py-3 font-black text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-all border border-gray-600/30"
              >
                Load CSV
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Mobile Layout - Turntable Preview */}
      {isMobileDevice && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 pt-8"
        >
          {/* Compact Mobile Turntable */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, type: 'spring', stiffness: 100 }}
            className="relative w-48 h-48 rounded-full flex items-center justify-center mb-8"
          >
            {/* Vinyl Record Container */}
            <div className="relative w-full h-full">
              {/* Outer turntable base */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-cyan-400/30"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(180,77,255,0.05) 100%)',
                  boxShadow: '0 0 40px rgba(0,255,255,0.2), inset 0 0 30px rgba(0,255,255,0.1)',
                }}
              />

              {/* Vinyl Record */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={isPlaying ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}
                className="absolute inset-3 rounded-full overflow-hidden"
              >
                {/* Matte black base */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-950 rounded-full" />

                {/* Vinyl groove texture */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="vinyl-groove-mobile">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,0.005)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
                    </radialGradient>
                  </defs>
                  {[...Array(10)].map((_, i) => (
                    <circle
                      key={i}
                      cx="100"
                      cy="100"
                      r={15 + i * 10}
                      fill="none"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="0.5"
                    />
                  ))}
                </svg>

                {/* Vinyl reflection */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 via-transparent to-cyan-600/20" />
              </motion.div>

              {/* Center label - Compact */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={isPlaying ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}
                className="absolute inset-12 rounded-full flex flex-col items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #b44dff 0%, #ec4899 50%, #b44dff 100%)',
                  boxShadow: '0 0 30px rgba(180,77,255,0.8), inset 0 0 15px rgba(0,0,0,0.5)',
                }}
              >
                <p className="text-white font-black text-xs tracking-widest uppercase text-center line-clamp-1">
                  {currentTrackIndex + 1}/{tracks.length}
                </p>

                {/* Spinning center dot */}
                <motion.div
                  animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                  transition={isPlaying ? { duration: 1, repeat: Infinity } : {}}
                  className="w-2 h-2 bg-white rounded-full mt-2 opacity-80"
                />
              </motion.div>

              {/* Compact needle */}
              <motion.div
                animate={isPlaying ? { rotate: [0, 3, 0] } : {}}
                transition={isPlaying ? { duration: 0.5, repeat: Infinity, repeatType: 'mirror' } : {}}
                className="absolute top-0 right-1/3 w-8 h-16 origin-top"
                style={{
                  transformOrigin: '50% 0%',
                }}
              >
                <div className="w-0.5 h-full bg-gradient-to-b from-gray-300 to-gray-600 rounded-full" />
                <div className="absolute -bottom-2 -right-0.5 w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-700 rounded-full border border-gray-300" />
              </motion.div>
            </div>

            {/* Glow ring */}
            <motion.div
              animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={isPlaying ? { duration: 2, repeat: Infinity } : {}}
              className="absolute -inset-6 rounded-full border-2 border-purple-500/30"
              style={{
                boxShadow: isPlaying
                  ? '0 0 40px rgba(180,77,255,0.6), 0 0 80px rgba(236,72,153,0.4)'
                  : '0 0 15px rgba(180,77,255,0.3)',
              }}
            />
          </motion.div>

          {/* Track Info - Below Turntable */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 w-full max-w-sm"
          >
            <p className="text-purple-400 font-black text-xs tracking-widest uppercase mb-2 line-clamp-1">
              {tracks[currentTrackIndex]?.trackName}
            </p>
            <p className="text-gray-300 font-bold text-sm mb-1 line-clamp-1">
              {tracks[currentTrackIndex]?.artistNames}
            </p>
            <p className={`text-xs font-semibold tracking-widest uppercase ${
              tracks[currentTrackIndex]?.previewUrl ? 'text-green-400' : 'text-orange-400'
            }`}>
              {tracks[currentTrackIndex]?.previewUrl ? '✓ Preview Available' : '⚠ Preview Unavailable'}
            </p>
          </motion.div>

          {/* Mobile Controls */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 100 }}
            className="glass neon-border rounded-full px-6 py-4 flex items-center gap-6 mb-6"
          >
            {/* Prev Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPrev}
              disabled={currentTrackIndex === 0}
              className="p-2 rounded-full hover:bg-purple-500/20 disabled:opacity-30 transition-all"
            >
              <SkipBack size={20} className="text-purple-400" />
            </motion.button>

            {/* Play/Pause - Center */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPlayPause}
              className="relative p-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #b44dff 0%, #ec4899 100%)',
                boxShadow: isPlaying
                  ? '0 0 30px rgba(180,77,255,0.8), 0 0 60px rgba(236,72,153,0.6)'
                  : '0 0 15px rgba(180,77,255,0.4)',
              }}
              animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
              transition={isPlaying ? { duration: 1.5, repeat: Infinity } : {}}
            >
              {isPlaying ? (
                <Pause size={22} className="text-white" fill="white" />
              ) : (
                <Play size={22} className="text-white" fill="white" />
              )}
            </motion.button>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={onNext}
              disabled={currentTrackIndex === tracks.length - 1}
              className="p-2 rounded-full hover:bg-purple-500/20 disabled:opacity-30 transition-all"
            >
              <SkipForward size={20} className="text-purple-400" />
            </motion.button>
          </motion.div>

          {/* Playlist Toggle & Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 w-full max-w-sm"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTogglePlaylist}
              className="flex-1 glass neon-border rounded-lg px-4 py-3 font-bold text-xs uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-all"
            >
              {showPlaylist ? '◄ Close' : 'Playlist ►'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onUpload}
              className="flex-1 glass rounded-lg px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-300 hover:text-white transition-all border border-gray-600/30"
            >
              Load CSV
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Playlist Drawer */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onTogglePlaylist}
            className="fixed inset-0 z-10 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: isMobileDevice ? '100%' : 0, x: isMobileDevice ? 0 : '100%', opacity: 0 }}
              animate={{ y: 0, x: 0, opacity: 1 }}
              exit={{ y: isMobileDevice ? '100%' : 0, x: isMobileDevice ? 0 : '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`fixed glass rounded-t-3xl overflow-hidden flex flex-col ${
                isMobileDevice
                  ? 'bottom-0 left-0 right-0 h-3/4'
                  : 'right-0 top-0 bottom-0 w-96'
              }`}
              style={{
                borderTop: isMobileDevice ? '2px solid rgba(180,77,255,0.3)' : 'none',
                borderLeft: !isMobileDevice ? '2px solid rgba(180,77,255,0.3)' : 'none',
              }}
            >
              {/* Header */}
              <div className="border-b border-purple-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white">Playlist</h3>
                    <p className="text-xs text-purple-400 font-mono mt-1">
                      {playlistPage * 10 + 1}-{Math.min((playlistPage + 1) * 10, tracks.length)} / {tracks.length}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={onTogglePlaylist}
                    className="p-2 rounded-full hover:bg-purple-500/10 transition-all"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              {/* Tracks List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                  {paginatedTracks.map((track, index) => {
                    const globalIndex = playlistPage * 10 + index;
                    const isActive = globalIndex === currentTrackIndex;

                    return (
                      <motion.button
                        key={globalIndex}
                        whileHover={{ x: 4 }}
                        onClick={() => onSelectTrack(index)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'border-l-2 border-pink-500 bg-gradient-to-r from-purple-500/20 to-transparent'
                            : 'border-l-2 border-transparent hover:border-purple-500/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-black font-mono w-6 ${
                              isActive ? 'text-pink-400' : 'text-gray-500'
                            }`}
                          >
                            {globalIndex + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-bold text-sm truncate ${
                                isActive ? 'text-white' : 'text-gray-300'
                              }`}
                            >
                              {track.trackName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {track.artistNames}
                            </p>
                          </div>
                          {isActive && (
                            <motion.div
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-2 h-2 rounded-full bg-pink-400"
                            />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Footer - Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-purple-500/20 p-4 flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={onPrevPage}
                    disabled={playlistPage === 0}
                    className="p-2 rounded-full hover:bg-purple-500/20 disabled:opacity-30 transition-all"
                  >
                    <ChevronUp size={20} className="text-purple-400" />
                  </motion.button>

                  <span className="text-xs text-purple-400 font-mono">
                    Page {playlistPage + 1} / {totalPages}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={onNextPage}
                    disabled={playlistPage === totalPages - 1}
                    className="p-2 rounded-full hover:bg-purple-500/20 disabled:opacity-30 transition-all"
                  >
                    <ChevronDown size={20} className="text-purple-400" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
