import { motion } from "framer-motion";
import Image from "next/image";

interface Track {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  audio: string;
  authorUrl?: string;
}

interface TrackPlaylistProps {
  readonly tracks: Track[];
  readonly currentTrack: number;
  readonly onTrackSelect: (index: number) => void;
}

export default function TrackPlaylist({
  tracks,
  currentTrack,
  onTrackSelect,
}: TrackPlaylistProps) {
  if (tracks.length <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="border-t-2 border-retro-black pt-4"
    >
      <p className="text-xs font-bold mb-3 uppercase">Playlist</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {tracks.map((track, index) => (
          <motion.button
            key={track.id}
            onClick={() => onTrackSelect(index)}
            className={`text-left p-2 border-2 transition-all ${
              index === currentTrack
                ? "border-retro-black bg-retro-black text-retro-white"
                : "border-retro-black bg-retro-white hover:bg-retro-gray"
            }`}
            style={{
              boxShadow: "2px 2px 0px #000000",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 border border-retro-black flex-shrink-0">
                <Image
                  src={track.thumbnail}
                  alt={track.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate">{track.title}</p>
                <p className="text-xs opacity-70 truncate">by {track.author}</p>
                <p className="text-xs opacity-50 text-[10px]">
                  {index === currentTrack
                    ? "Now Playing"
                    : `Track ${index + 1}`}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
