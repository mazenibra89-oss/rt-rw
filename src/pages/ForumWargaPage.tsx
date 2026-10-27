import React, { useState } from 'react';
import { ForumTopic, UserProfile } from '../types/index.ts';
import { Modal } from '../components/common/Modal.tsx';
import {
  MessageSquare,
  Plus,
  ThumbsUp,
  BarChart,
  User,
  Send,
  Calendar,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface ForumWargaPageProps {
  topics: ForumTopic[];
  currentUser: UserProfile;
  onCreateTopic: (topic: Omit<ForumTopic, 'id' | 'repliesCount' | 'upvotes' | 'date'>) => void;
  onToggleUpvote: (topicId: string) => void;
  onVotePoll: (topicId: string, optionIndex: number) => void;
}

export const ForumWargaPage: React.FC<ForumWargaPageProps> = ({
  topics,
  currentUser,
  onCreateTopic,
  onToggleUpvote,
  onVotePoll,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);

  // New Topic Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Keamanan');
  const [content, setContent] = useState('');
  const [hasPoll, setHasPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOpt1, setPollOpt1] = useState('');
  const [pollOpt2, setPollOpt2] = useState('');

  // Comment input inside detail modal
  const [newComment, setNewComment] = useState('');
  const [commentsMap, setCommentsMap] = useState<Record<string, { author: string; role: string; text: string; time: string }[]>>({
    'FRM-01': [
      { author: 'Pak Joko Subagyo', role: 'Warga RT 01', text: 'Sangat setuju, terutama di gerbang timur yang sering sepi saat tengah malam.', time: 'Kemarin, 20:15' },
      { author: 'Budi Santoso', role: 'Ketua RT 03', text: 'Terima kasih usulannya Pak Aris, akan kita masukkan sebagai agenda utama rapat RW malam ini.', time: 'Kemarin, 21:00' },
    ],
  });

  const categories = ['Semua', 'Keamanan', 'Kesehatan & Olahraga', 'Lingkungan', 'Sosial', 'Umum'];

  const filteredTopics = topics.filter(t => {
    return activeCategory === 'Semua' || t.category === activeCategory;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onCreateTopic({
      title,
      author: currentUser.name,
      authorRole: currentUser.roleTitle,
      category,
      content,
      poll: hasPoll && pollQuestion && pollOpt1 && pollOpt2
        ? {
            question: pollQuestion,
            options: [
              { text: pollOpt1, votes: 1 },
              { text: pollOpt2, votes: 0 },
            ],
            totalVotes: 1,
            userVote: 0,
          }
        : undefined,
    });

    setIsNewTopicModalOpen(false);
    setTitle('');
    setContent('');
    setHasPoll(false);
    setPollQuestion('');
    setPollOpt1('');
    setPollOpt2('');
  };

  const handleSendComment = (topicId: string) => {
    if (!newComment.trim()) return;
    const existing = commentsMap[topicId] || [];
    setCommentsMap({
      ...commentsMap,
      [topicId]: [
        ...existing,
        {
          author: currentUser.name,
          role: currentUser.roleTitle,
          text: newComment,
          time: 'Baru saja',
        },
      ],
    });
    setNewComment('');
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#20242B] tracking-tight">
            Forum Warga
          </h1>
          <p className="text-xs sm:text-sm text-[#737B87] mt-0.5">
            Ruang diskusi santai, musyawarah digital, dan polling suara bersama warga lingkungan {currentUser.rw}.
          </p>
        </div>

        <button
          onClick={() => setIsNewTopicModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white text-xs font-semibold shadow-sm transition-all active:scale-98 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Topik Diskusi</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-xl border border-[#E9EBEF] shadow-2xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-[#FFF0F0] text-[#B5121B] border border-[#FCDADA] font-semibold'
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {filteredTopics.map(topic => (
          <div
            key={topic.id}
            className="p-5 rounded-xl bg-white border border-[#E9EBEF] hover:border-slate-300 transition-all shadow-2xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#B5121B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {topic.author
                    .split(' ')
                    .map(n => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {topic.author}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {topic.authorRole} · {topic.date}
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                {topic.category}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#20242B] hover:text-[#B5121B] transition-colors leading-snug">
                {topic.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {topic.content}
              </p>
            </div>

            {/* Interactive Community Poll (if present) */}
            {topic.poll && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <BarChart className="w-3.5 h-3.5 text-[#B5121B]" />
                    <span>Polling Warga: {topic.poll.question}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 tabular-nums">
                    {topic.poll.totalVotes} suara terkumpul
                  </span>
                </div>

                <div className="space-y-2">
                  {topic.poll.options.map((opt, oIdx) => {
                    const percent =
                      topic.poll && topic.poll.totalVotes > 0
                        ? Math.round((opt.votes / topic.poll.totalVotes) * 100)
                        : 0;
                    const isVoted = topic.poll?.userVote === oIdx;

                    return (
                      <button
                        key={oIdx}
                        onClick={() => onVotePoll(topic.id, oIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs relative overflow-hidden transition-all ${
                          isVoted
                            ? 'border-[#B5121B] bg-red-50/50 font-semibold'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        {/* Progress Bar background */}
                        <div
                          className={`absolute top-0 bottom-0 left-0 transition-all ${
                            isVoted ? 'bg-[#FFF0F0]' : 'bg-slate-100'
                          }`}
                          style={{ width: `${percent}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between">
                          <span className="text-slate-800 flex items-center gap-1.5">
                            {isVoted && <CheckCircle2 className="w-3.5 h-3.5 text-[#B5121B]" />}
                            <span>{opt.text}</span>
                          </span>
                          <span className="font-bold text-slate-700 tabular-nums text-[11px]">
                            {percent}% ({opt.votes})
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onToggleUpvote(topic.id)}
                  className={`flex items-center gap-1.5 font-semibold transition-colors ${
                    topic.userUpvoted ? 'text-[#B5121B]' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${topic.userUpvoted ? 'fill-[#B5121B]' : ''}`} />
                  <span className="tabular-nums">{topic.upvotes} Dukung</span>
                </button>

                <button
                  onClick={() => setSelectedTopic(topic)}
                  className="flex items-center gap-1.5 font-semibold text-slate-500 hover:text-slate-800"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    {(commentsMap[topic.id]?.length || 0) + topic.repliesCount} Tanggapan
                  </span>
                </button>
              </div>

              <button
                onClick={() => setSelectedTopic(topic)}
                className="text-xs font-semibold text-[#B5121B] hover:underline"
              >
                Ikuti Diskusi →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Discussion & Comments Detail Modal */}
      {selectedTopic && (
        <Modal
          isOpen={!!selectedTopic}
          onClose={() => setSelectedTopic(null)}
          title={selectedTopic.title}
          subtitle={`Oleh ${selectedTopic.author} · ${selectedTopic.date}`}
        >
          <div className="space-y-4 text-xs">
            <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
              {selectedTopic.content}
            </p>

            {/* Comments List */}
            <div className="space-y-2.5 pt-2">
              <h4 className="font-bold text-slate-900">
                Tanggapan Warga ({(commentsMap[selectedTopic.id] || []).length}):
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto divide-y divide-slate-100">
                {(commentsMap[selectedTopic.id] || []).map((c, cIdx) => (
                  <div key={cIdx} className="pt-2 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-bold text-slate-700">{c.author} ({c.role})</span>
                      <span>{c.time}</span>
                    </div>
                    <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <div className="pt-3 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                placeholder="Tulis tanggapan atau saran Anda..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendComment(selectedTopic.id)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#B5121B] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSendComment(selectedTopic.id)}
                className="px-4 py-2 rounded-lg bg-[#B5121B] hover:bg-[#8F0D16] text-white font-semibold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Topic Modal */}
      <Modal
        isOpen={isNewTopicModalOpen}
        onClose={() => setIsNewTopicModalOpen(false)}
        title="Buat Topik Diskusi Warga Baru"
        subtitle="Awali musyawarah digital mengenai kemajuan lingkungan bersama tetangga."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Judul Topik Diskusi <span className="text-[#E5242A]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Contoh: Rencana Penanaman Pohon Peneduh di Sepanjang Gang"
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Kategori <span className="text-[#E5242A]">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            >
              <option value="Keamanan">Keamanan & Siskamling</option>
              <option value="Kesehatan & Olahraga">Kesehatan & Olahraga</option>
              <option value="Lingkungan">Kebersihan & Lingkungan</option>
              <option value="Sosial">Sosial & Keagamaan</option>
              <option value="Umum">Umum</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Isi Diskusi / Usulan <span className="text-[#E5242A]">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Jelaskan gagasan atau pertanyaan musyawarah yang ingin didiskusikan..."
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            />
          </div>

          {/* Polling Option */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={hasPoll}
                onChange={e => setHasPoll(e.target.checked)}
                className="rounded text-[#B5121B]"
              />
              <span>Sertakan Polling Pilihan Suara Warga</span>
            </label>

            {hasPoll && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Pertanyaan Polling (misal: Apakah setuju iuran sukarela Rp10.000?)"
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-200 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Pilihan 1 (misal: Ya, Sangat Setuju)"
                  value={pollOpt1}
                  onChange={e => setPollOpt1(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-200 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Pilihan 2 (misal: Tidak, Pertahankan Sistem Lama)"
                  value={pollOpt2}
                  onChange={e => setPollOpt2(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-200 text-xs bg-white"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsNewTopicModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E9EBEF] text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white font-semibold shadow-sm"
            >
              Kirim Topik
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
