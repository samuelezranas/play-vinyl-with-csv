import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Upload } from 'lucide-react';

const PlayVinylCSV = ({
  tracks = [],
  currentTrackIndex = 0,
  isPlaying = false,
  discImage = null,
  onPlayPause,
  onNext,
  onChangeDisc,
  className = '',
}) => {
  const currentTrack = tracks[currentTrackIndex] || {};

  return (
    <div className={`fixed z-[9999] ${className}`}>
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <motion.div
          layout
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/30 px-4 py-2 flex items-center space-x-4 ${
            isPlaying ? 'w-80' : 'w-16'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Vinyl Disc */}
          <motion.div
            className="w-12 h-12 rounded-full bg-black relative flex-shrink-0"
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={isPlaying ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
            style={{
              background: `
                radial-gradient(circle at center, #000 30%, #333 50%, #000 70%),
                repeating-radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.1) 1%, transparent 2%),
                conic-gradient(from 0deg, rgba(255,255,255,0.3) 0deg, transparent 90deg, rgba(255,255,255,0.3) 180deg, transparent 270deg)
              `,
            }}
          >
            <div className="absolute inset-2 rounded-full bg-gray-800 flex items-center justify-center">
              {discImage ? (
                <img src={discImage} alt="Disc" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-gray-600"></div>
              )}
            </div>
          </motion.div>

          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center space-x-2 flex-1"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{currentTrack.trackName}</div>
                <div className="text-xs text-gray-600 truncate">{currentTrack.artistNames}</div>
              </div>
              <button onClick={onPlayPause} className="p-1 rounded-full hover:bg-white/20">
                <Pause size={16} />
              </button>
              <button onClick={onNext} className="p-1 rounded-full hover:bg-white/20">
                <SkipForward size={16} />
              </button>
            </motion.div>
          )}

          {!isPlaying && (
            <button onClick={onPlayPause} className="p-1 rounded-full hover:bg-white/20">
              <Play size={16} />
            </button>
          )}
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white/20 backdrop-blur-md border-b border-white/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-8 h-8 rounded-full bg-black relative"
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={isPlaying ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
            style={{
              background: `
                radial-gradient(circle at center, #000 30%, #333 50%, #000 70%),
                repeating-radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.1) 1%, transparent 2%),
                conic-gradient(from 0deg, rgba(255,255,255,0.3) 0deg, transparent 90deg, rgba(255,255,255,0.3) 180deg, transparent 270deg)
              `,
            }}
          >
            <div className="absolute inset-1 rounded-full bg-gray-800 flex items-center justify-center">
              {discImage ? (
                <img src={discImage} alt="Disc" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              )}
            </div>
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">{currentTrack.trackName}</div>
            <div className="text-xs text-gray-600 truncate">{currentTrack.artistNames}</div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={onPlayPause} className="p-1 rounded-full hover:bg-white/20">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={onNext} className="p-1 rounded-full hover:bg-white/20">
            <SkipForward size={16} />
          </button>
          <button onClick={onChangeDisc} className="p-1 rounded-full hover:bg-white/20">
            <Upload size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayVinylCSV;