import React from 'react';
import {
  Newspaper,
  BellRing,
  CloudSun,
  Droplets,
  Wind,
  SunMedium,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { NewsItem, AnnouncementItem, WeatherData } from '../../types/index.ts';
import { NavPage } from '../common/Sidebar.tsx';

interface NewsAnnounceWeatherProps {
  news: NewsItem[];
  announcements: AnnouncementItem[];
  weather: WeatherData;
  onNavigate: (page: NavPage) => void;
  onSelectNews: (item: NewsItem) => void;
  onSelectAnnouncement: (item: AnnouncementItem) => void;
}

export const NewsAnnounceWeather: React.FC<NewsAnnounceWeatherProps> = ({
  news,
  announcements,
  weather,
  onNavigate,
  onSelectNews,
  onSelectAnnouncement,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Column 1: Berita Terbaru */}
      <div className="rounded-xl bg-white border border-[#E9EBEF] p-4 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#E9EBEF]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#FFF0F0] text-[#B5121B] flex items-center justify-center">
                <Newspaper className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-[#20242B]">Berita Terbaru</h3>
            </div>
            <button
              onClick={() => onNavigate('berita')}
              className="text-[11px] font-semibold text-[#B5121B] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-1">
            {news.slice(0, 3).map((item, idx) => (
              <button
                key={item.id}
                onClick={() => onSelectNews(item)}
                className="w-full py-2.5 flex items-start gap-3 hover:bg-slate-50/80 rounded-lg px-1 transition-colors text-left group"
              >
                {/* Clean stylized thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center font-bold text-xs text-slate-500 overflow-hidden relative">
                  <div
                    className={`absolute inset-0 opacity-20 ${
                      idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                  />
                  <Newspaper className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#20242B] group-hover:text-[#B5121B] line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#737B87] mt-1">
                    <span className="font-medium text-slate-600">{item.source}</span>
                    <span>·</span>
                    <span>{item.publishedAt}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Pengumuman Penting */}
      <div className="rounded-xl bg-white border border-[#E9EBEF] p-4 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#E9EBEF]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#FFF0F0] text-[#B5121B] flex items-center justify-center">
                <BellRing className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-[#20242B]">Pengumuman Penting</h3>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-50 text-[#B5121B]">
              Resmi RW/RT
            </span>
          </div>

          <div className="divide-y divide-slate-100 mt-1">
            {announcements.slice(0, 3).map(item => (
              <button
                key={item.id}
                onClick={() => onSelectAnnouncement(item)}
                className="w-full py-2.5 flex items-start gap-2.5 hover:bg-slate-50/80 rounded-lg px-1 transition-colors text-left group"
              >
                <div className="w-2 h-2 rounded-full bg-[#E5242A] shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#20242B] group-hover:text-[#B5121B] line-clamp-1 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#737B87] line-clamp-1 mt-0.5 leading-tight">
                    {item.content}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-[#737B87] mt-1">
                    <span className="font-medium text-[#B5121B]">{item.scope}</span>
                    <span>·</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column 3: Cuaca Hari Ini */}
      <div className="rounded-xl bg-gradient-to-br from-white to-slate-50 border border-[#E9EBEF] p-4 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#E9EBEF]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                <CloudSun className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-[#20242B]">Cuaca Hari Ini</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Perkiraan BMKG</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">{weather.city}</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-[#20242B] tabular-nums tracking-tight">
                  {weather.temp}°
                </span>
                <span className="text-xs text-slate-500 font-medium">C</span>
              </div>
              <p className="text-xs font-semibold text-[#3478C8] mt-0.5">
                {weather.condition}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-600 shadow-inner">
              <CloudSun className="w-8 h-8" />
            </div>
          </div>

          {/* Weather indicators */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100">
              <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">Kelembapan</span>
                <span className="font-semibold text-slate-800 text-xs tabular-nums">
                  {weather.humidity}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100">
              <Wind className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">Angin</span>
                <span className="font-semibold text-slate-800 text-xs tabular-nums">
                  {weather.windSpeed} km/j
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-2 italic text-center">
          *Data cuaca ilustratif untuk pemantauan lingkungan warga
        </p>
      </div>
    </div>
  );
};
