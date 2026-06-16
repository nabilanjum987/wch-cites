import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, Newspaper } from 'lucide-react';
import { timeAgo } from '../../lib/apis/news';
import type { NewsArticle } from '../../types/city';
import { getSourceName } from '../../types/city';

interface WeekInReviewProps {
  cityName: string;
  articles: NewsArticle[];
}

export default function WeekInReview({ cityName, articles }: WeekInReviewProps) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div>
      {/* Week summary card */}
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-5 mb-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-200" />
            <h3 className="text-sm font-bold">This Week's Summary</h3>
          </div>
          <span className="text-xs text-emerald-200">
            {formatDate(weekStart)} - {formatDate(weekEnd)}
          </span>
        </div>
        <p className="text-emerald-100 text-sm leading-relaxed">
          The 5 biggest stories in {cityName} this week
        </p>
      </div>

      {/* Stories list */}
      <div className="space-y-3">
        {articles.map((article, idx) => (
          <motion.a
            key={idx}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow no-underline group"
          >
            {/* Rank number */}
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0 border border-emerald-100">
              {idx + 1}
            </span>

            {/* Thumbnail */}
            <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden">
              {article.image ? (
                <img
                  src={article.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                  <Newspaper className="w-4 h-4 text-emerald-300" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-semibold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                {article.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                <span className="font-medium text-emerald-700">{getSourceName(article.source)}</span>
                <span>&#183;</span>
                <Clock className="w-3 h-3" />
                <span>{timeAgo(article.publishedAt)}</span>
              </div>
            </div>

            <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-1" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
