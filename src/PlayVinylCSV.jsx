import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, Menu } from 'lucide-react';

/**
 * Vinyl Disc Component - High-Fidelity CSS Record with Realistic Grooves
 */
const VinylDisc = ({ isPlaying, discImage, albumTitle, artistName }) => {
  return (
    <motion.div
      animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
      transition={isPlaying ? { duration: 3, repeat: Infinity, ease: 'linear' } : { duration: 0.6 }}
      className="relative flex-shrink-0"
      style={{ width: '220px', height: '220px' }}
    >
      {/* Vinyl Record - Premium CSS */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
            repeating-radial-gradient(
              circle at center,
              #0a0a0a 0px,
              #111111 0.5px,
              #0f0f0f 1px,
              #0a0a0a 1.5px,
              #080808 2px
            ),
            radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 30%, #000000 100%)
          `,
          boxShadow: `
            inset 0 0 80px rgba(0,0,0,1),
            inset 0 -40px 80px rgba(0,0,0,0.95),
            inset 20px 20px 60px rgba(255,255,255,0.05),
            0 0 120px rgba(180,77,255,0.7),
            0 0 200px rgba(236,72,153,0.5),
            0 40px 100px rgba(0,0,0,0.98)
          `,
          filter: 'drop-shadow(0 0 60px rgba(180,77,255,0.4))'
        }}
      >
        {/* Center Label - Album Art */}
        <div className="absolute inset-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-950 to-black border-4 border-gray-800/50 flex items-center justify-center shadow-2xl">
          {discImage ? (
            <img
              src={discImage}
              alt="album"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <p className="text-xs font-black text-white/70 uppercase tracking-wider">
                {albumTitle?.substring(0, 12) || 'Vinyl'}
              </p>
              <p className="text-xs text-white/50 mt-2">
                {artistName?.substring(0, 15) || 'Album'}
              </p>
            </div>
          )}
        </div>

        {/* Center Spindle */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '28px',
            height: '28px',
            background: 'radial-gradient(circle at 30% 30%, rgba(200,200,200,0.3), #1a1a1a)',
            border: '3px solid rgba(100,100,100,0.6)',
            boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.1), 0 0 30px rgba(180,77,255,0.3)'
          }}
        />

        {/* Realistic Light Reflection */}
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `
              conic-gradient(
                from 30deg at 25% 25%,
                rgba(255,255,255,0.4) 0deg,
                rgba(255,255,255,0.15) 80deg,
                rgba(255,255,255,0) 160deg,
                transparent 270deg
              )
            `
          }}
        />
      </div>
    </motion.div>
  );
};

/**
 * Play/Pause Button - Large Prominent Center Control with Neon Glow
 */
const PlayPauseButton = ({ isPlaying, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      className="relative flex items-center justify-center"
      style={{ width: '100px', height: '100px' }}
    >
      {/* Outer Glow Ring */}
      <motion.div
        animate={isPlaying ? { scale: [0.95, 1.1, 0.95], opacity: [0.8, 0.4, 0.8] } : { scale: 1, opacity: 0.3 }}
        transition={isPlaying ? { duration: 2, repeat: Infinity } : {}}
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(236,72,153,0.8) 0%,
              rgba(236,72,153,0.3) 50%,
              transparent 100%
            )
          `,
          boxShadow: `
            0 0 60px rgba(236,72,153,1),
            0 0 100px rgba(180,77,255,0.6),
            inset 0 0 30px rgba(255,255,255,0.15)
          `,
          filter: 'blur(1px)'
        }}
      />

      {/* Button Surface */}
      <div
        className="relative flex items-center justify-center rounded-full font-black text-white z-10"
        style={{
          width: '100px',
          height: '100px',
          background: `
            linear-gradient(135deg, 
              rgba(236,72,153,0.95) 0%,
              rgba(190,30,120,1) 100%
            )
          `,
          boxShadow: `
            inset 0 2px 15px rgba(255,255,255,0.3),
            inset 0 -3px 15px rgba(0,0,0,0.4),
            0 0 50px rgba(236,72,153,0.9),
            0 0 100px rgba(180,77,255,0.5),
            0 15px 40px rgba(0,0,0,0.6)
          `,
          border: '2px solid rgba(255,255,255,0.4)'
        }}
      >
        {isPlaying ? (
          <Pause size={48} className="text-white fill-white" />
        ) : (
          <Play size={48} className="text-white fill-white ml-2" />
        )}
      </div>
    </motion.button>
  );
};

/**
 * Control Button with Premium Styling
 */
const ControlButton = ({ Icon, onClick, tooltip, size = 22 }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.2, y: -4 }}
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      title={tooltip}
      className="p-3 rounded-full transition-all duration-300 group relative"
      style={{
        background: 'linear-gradient(135deg, rgba(180,77,255,0.3) 0%, rgba(236,72,153,0.2) 100%)',
        border: '1.5px solid rgba(255,255,255,0.3)',
        boxShadow: '0 0 25px rgba(180,77,255,0.4), inset 0 0 15px rgba(255,255,255,0.1)'
      }}
    >
      <Icon size={size} className="text-white group-hover:text-pink-300 transition-colors" strokeWidth={1.5} />
    </motion.button>
  );
};

/**
 * Seek Button with Directional Styling
 */
const SeekButton = ({ direction, onClick }) => {
  const Icon = direction === 'back' ? RotateCcw : RotateCw;
  return (
    <motion.button
      whileHover={{ scale: 1.2, y: -4 }}
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      className="p-3 rounded-full transition-all duration-300 relative group"
      style={{
        background: 'linear-gradient(135deg, rgba(180,77,255,0.3) 0%, rgba(236,72,153,0.2) 100%)',
        border: '1.5px solid rgba(255,255,255,0.3)',
        boxShadow: '0 0 25px rgba(180,77,255,0.4), inset 0 0 15px rgba(255,255,255,0.1)'
      }}
    >
      <Icon size={22} className="text-white group-hover:text-pink-300 transition-colors" strokeWidth={1.5} />
      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-black text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {direction === 'back' ? '-5s' : '+5s'}
      </span>
    </motion.button>
  );
};

/**
 * Main PlayVinylCSV Component - Premium Vinyl Player
 */
const PlayVinylCSV = ({
  tracks = [],
  currentTrackIndex = 0,
  isPlaying = false,
  discImage = null,
  onPlayPause,
  onNext,
  onPrev,
  onSeekBack,
  onSeekForward,
  onToggleDrawer,
  className = '',
}) => {
  const currentTrack = tracks[currentTrackIndex] || {};

  return (
    <div className={`fixed z-[9999] ${className}`}>
      {/* Desktop Layout - Floating Pill */}
      <div className="hidden md:block">
        <motion.div
          className="fixed bottom-12 left-1/2 transform -translate-x-1/2"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Premium Glassmorphism Floating Pill */}
          <motion.div
            layout
            className="rounded-full px-2 py-2 flex items-center gap-6"
            style={{
              background: 'rgba(20,20,40,0.75)',
              backdropFilter: 'blur(30px)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              boxShadow: `
                0 0 150px rgba(180,77,255,0.6),
                0 0 100px rgba(236,72,153,0.4),
                inset 0 0 40px rgba(255,255,255,0.08),
                0 20px 60px rgba(0,0,0,0.7)
              `,
              padding: '16px 24px'
            }}
          >
            {/* Vinyl Disc */}
            <div className="flex-shrink-0">
              <VinylDisc
                isPlaying={isPlaying}
                discImage={discImage}
                albumTitle={currentTrack.trackName}
                artistName={currentTrack.artistNames}
              />
            </div>

            {/* Controls Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-8"
            >
              {/* Track Info */}
              <div className="hidden lg:flex flex-col min-w-max pr-6 border-r border-white/20">
                <p className="text-sm font-black text-white/95 truncate max-w-xs">
                  {currentTrack.trackName}
                </p>
                <p className="text-xs text-white/60 truncate max-w-xs font-light">
                  {currentTrack.artistNames}
                </p>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-5">
                {/* Previous */}
                <ControlButton Icon={SkipBack} onClick={onPrev} tooltip="Previous Track" size={24} />

                {/* Seek Back */}
                <SeekButton direction="back" onClick={onSeekBack} />

                {/* Play/Pause - Center Large Button */}
                <div className="px-1">
                  <PlayPauseButton isPlaying={isPlaying} onClick={onPlayPause} />
                </div>

                {/* Seek Forward */}
                <SeekButton direction="forward" onClick={onSeekForward} />

                {/* Next */}
                <ControlButton Icon={SkipForward} onClick={onNext} tooltip="Next Track" size={24} />

                {/* Menu */}
                <ControlButton Icon={Menu} onClick={onToggleDrawer} tooltip="Show Playlist" size={24} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Layout - Top Navbar */}
      <motion.div
        className="md:hidden fixed top-0 left-0 w-full"
        style={{
          background: 'rgba(20,20,40,0.85)',
          backdropFilter: 'blur(25px)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 0 60px rgba(180,77,255,0.5)'
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          {/* Left: Vinyl + Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <motion.div animate={isPlaying ? { rotate: 360 } : {}} transition={isPlaying ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}>
              <div
                className="rounded-full flex-shrink-0"
                style={{
                  width: '56px',
                  height: '56px',
                  background: discImage ? `url(${discImage})` : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), repeating-radial-gradient(circle at center, #0a0a0a 0px, #111 0.5px, #0f0f0f 1px), radial-gradient(circle at center, #1a1a1a 0%, #000 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: `
                    inset 0 0 20px rgba(0,0,0,0.8),
                    0 0 30px rgba(180,77,255,0.5)
                  `,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              />
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-white truncate">{currentTrack.trackName}</p>
              <p className="text-xs text-white/60 truncate font-light">{currentTrack.artistNames}</p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <ControlButton Icon={SkipBack} onClick={onPrev} tooltip="Previous" size={18} />
            <div style={{ width: '64px', height: '64px' }} className="flex items-center justify-center">
              <PlayPauseButton isPlaying={isPlaying} onClick={onPlayPause} />
            </div>
            <ControlButton Icon={SkipForward} onClick={onNext} tooltip="Next" size={18} />
            <ControlButton Icon={Menu} onClick={onToggleDrawer} tooltip="Playlist" size={18} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayVinylCSV;