import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Youtube } from 'lucide-react';
import { fetchYouTubeVideos } from '../../lib/apis/news';
import { timeAgo } from '../../lib/apis/news';
import type { VideoItem } from '../../types/city';

interface VideoNewsProps {
  countrySlug: string;
}

export default function VideoNews({ countrySlug }: VideoNewsProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchYouTubeVideos(countrySlug);
      setVideos(data);
      setLoading(false);
    }
    load();
  }, [countrySlug]);

  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-28 bg-gray-200 rounded-xl" />
              <div className="mt-2 h-3 bg-gray-200 rounded w-3/4" />
              <div className="mt-1 h-2.5 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {videos.map((video, idx) => (
            <motion.a
              key={idx}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group no-underline"
            >
              <div className="relative rounded-xl overflow-hidden aspect-video">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                    <Youtube className="w-8 h-8 text-red-300" />
                  </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                </div>
                {/* Channel badge */}
                <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Youtube className="w-2.5 h-2.5" />
                  {video.channel}
                </span>
              </div>
              <h4 className="mt-2 text-xs font-semibold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                {video.title}
              </h4>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                <Clock className="w-2.5 h-2.5" />
                <span>{timeAgo(video.publishedAt)}</span>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
