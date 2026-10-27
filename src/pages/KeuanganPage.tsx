import React, { useState } from 'react';
import {
  FinancialTransaction,
  UserProfile,
} from '../types/index.ts';
import { Modal } from '../components/common/Modal.tsx';
import {
  formatRupiah,
  formatTanggalIndo,
  calculateFinancialSummary,
  filterTransactionsByScope,
  generateMonthlyAggregation,
  canCreateFinancialEntry,
} from '../utils/civicLogic.ts';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Download,
  Plus,
  Search,
  Filter,
  BarChart2,
  Calendar,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface KeuanganPageProps {
  transactions: FinancialTransaction[];
  currentUser: UserProfile;
  activeRtFilter: string;
  onChangeRtFilter: (scope: string) => void;
  onAddTransaction: (txn: Omit<FinancialTransaction, 'id'>) => void;
}

export const KeuanganPage: React.FC<KeuanganPageProps> = ({
  transactions,
  currentUser,
  activeRtFilter,
  onChangeRtFilter,
  onAddTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<FinancialTransaction | null>(null);

  // New Transaction Form State
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Iuran Warga');
  const [type, setType] = useState<'pemasukan' | 'pengeluaran'>('pemasukan');
  const [amount, setAmount] = useState<number | ''>('');
  const [txnRt, setTxnRt] = useState(currentUser.rt);
  const [date, setDate] = useState('2026-10-25');

  const scopeTabs = ['RW 05', 'RT 01', 'RT 02', 'RT 03', 'RT 04'];

  const { totalPemasukan, totalPengeluaran, saldoAkhir } = calculateFinancialSummary(
    transactions,
    activeRtFilter
  );

  const monthlyChartData = generateMonthlyAggregation(transactions, activeRtFilter);

  // Filtered transactions for the table
  const scopedTransactions = filterTransactionsByScope(transactions, activeRtFilter);
  const filteredTransactions = scopedTransactions.filter(t => {
    const matchesCategory =
      categoryFilter === 'Semua' || t.category === categoryFilter;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.recordedBy.toLowerCase().includes(q)
    );
  });

  const isOfficer = canCreateFinancialEntry(currentUser.role);

  const handleExportCSV = () => {
    const headers = 'ID,Tanggal,Keterangan,Kategori,Jenis,Jumlah,Wilayah,Pencatat\n';
    const rows = filteredTransactions
      .map(
        t =>
          `"${t.id}","${t.date}","${t.description.replace(/"/g, '""')}","${t.category}","${
            t.type
          }",${t.amount},"${t.rt}","${t.recordedBy}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Kas_${activeRtFilter.replace(' ', '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount) return;

    onAddTransaction({
      date,
      description: desc,
      category,
      type,
      amount: Number(amount),
      rt: txnRt,
      rw: 'RW 05',
      recordedBy: currentUser.name,
    });

    setIsAddModalOpen(false);
    setDesc('');
    setAmount('');
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#20242B] tracking-tight">
            Keuangan RT/RW
          </h1>
          <p className="text-xs sm:text-sm text-[#737B87] mt-0.5">
            Transparansi keuangan untuk lingkungan yang lebih baik dan akuntabel.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E9EBEF] bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Unduh Laporan</span>
          </button>

          {isOfficer && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white text-xs font-semibold shadow-sm transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Transaksi</span>
            </button>
          )}
        </div>
      </div>

      {/* Scope Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9EBEF] pb-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">
          Wilayah Kas:
        </span>
        {scopeTabs.map(scope => {
          const isSelected = activeRtFilter === scope;
          return (
            <button
              key={scope}
              onClick={() => onChangeRtFilter(scope)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-[#B5121B] text-white font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-[#E9EBEF]'
              }`}
            >
              {scope}
            </button>
          );
        })}
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Pemasukan */}
        <div className="p-4 rounded-xl bg-white border border-[#E9EBEF] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pemasukan</span>
            <div className="w-7 h-7 rounded-lg bg-[#EBF7F0] text-[#24865B] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#24865B] mt-2 tabular-nums">
            {formatRupiah(totalPemasukan)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Akumulasi iuran warga & donasi {activeRtFilter}
          </p>
        </div>

        {/* Total Pengeluaran */}
        <div className="p-4 rounded-xl bg-white border border-[#E9EBEF] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pengeluaran</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFF0F0] text-[#B5121B] flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#B5121B] mt-2 tabular-nums">
            {formatRupiah(totalPengeluaran)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Biaya operasional, kebersihan & perbaikan
          </p>
        </div>

        {/* Saldo Akhir */}
        <div className="p-4 rounded-xl bg-white border border-[#E9EBEF] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saldo Kas Tersedia</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#3478C8] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#20242B] mt-2 tabular-nums">
            {formatRupiah(saldoAkhir)}
          </p>
          <p className="text-[10px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Status kas sehat & terverifikasi
          </p>
        </div>
      </div>

      {/* Monthly Chart Visual */}
      <div className="p-4 rounded-xl bg-white border border-[#E9EBEF] shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#20242B]">
              Tren Arus Kas Bulanan ({activeRtFilter})
            </h3>
            <p className="text-[11px] text-[#737B87]">
              Perbandingan pemasukan vs pengeluaran kas periode Mei – Oktober 2026
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#24865B]" />
              <span className="text-slate-600 font-medium">Pemasukan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#E5242A]" />
              <span className="text-slate-600 font-medium">Pengeluaran</span>
            </div>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#737B87' }} axisLine={{ stroke: '#E9EBEF' }} />
              <YAxis
                tickFormatter={val => `${val / 1000000} jt`}
                tick={{ fontSize: 10, fill: '#737B87' }}
                axisLine={{ stroke: '#E9EBEF' }}
              />
              <Tooltip
                formatter={(value: any) => [formatRupiah(Number(value) || 0), '']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E9EBEF',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="pemasukan" name="Pemasukan" fill="#24865B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#E5242A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail Transaksi Table */}
      <div className="rounded-xl bg-white border border-[#E9EBEF] shadow-2xs overflow-hidden">
        {/* Table Header & Search Filter */}
        <div className="p-4 border-b border-[#E9EBEF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#20242B]">Detail Catatan Transaksi</h3>
            <p className="text-xs text-[#737B87]">
              Buku kas umum wilayah {activeRtFilter}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E9EBEF] text-xs text-[#20242B] placeholder:text-slate-400 focus:outline-none focus:border-[#B5121B] w-40 sm:w-48"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#E9EBEF] bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Iuran Warga">Iuran Warga</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Donasi">Donasi</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#20242B]">
            <thead className="bg-slate-50/70 border-b border-[#E9EBEF] text-[11px] font-semibold text-[#737B87] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Wilayah</th>
                <th className="py-3 px-4 text-right">Jumlah (Rp)</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EBEF]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada catatan transaksi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(txn => {
                  const isIncome = txn.type === 'pemasukan';
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {formatTanggalIndo(txn.date)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {txn.description}
                        </div>
                        <div className="text-[10px] text-slate-400">Dicatat: {txn.recordedBy}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {txn.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {txn.rt}
                      </td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums">
                        <span className={isIncome ? 'text-[#24865B]' : 'text-[#B5121B]'}>
                          {isIncome ? '+ ' : '- '}
                          {formatRupiah(txn.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedTxn(txn)}
                          className="px-2.5 py-1 rounded border border-[#E9EBEF] hover:border-[#B5121B] hover:text-[#B5121B] text-slate-700 font-medium transition-colors"
                        >
                          Rincian
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTxn && (
        <Modal
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          title="Bukti & Rincian Transaksi Kas"
          subtitle={`No. Referensi: ${selectedTxn.id} · ${formatTanggalIndo(selectedTxn.date)}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Keterangan:</span>
                <span className="font-bold text-slate-900">{selectedTxn.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kategori:</span>
                <span className="font-medium text-slate-800">{selectedTxn.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jenis Transaksi:</span>
                <span className={`font-bold uppercase ${selectedTxn.type === 'pemasukan' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {selectedTxn.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nominal:</span>
                <span className="font-extrabold text-base text-slate-900 tabular-nums">
                  {formatRupiah(selectedTxn.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wilayah Buku Kas:</span>
                <span className="font-medium text-slate-800">{selectedTxn.rt} / {selectedTxn.rw}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Petugas Pencatat:</span>
                <span className="font-medium text-slate-800">{selectedTxn.recordedBy}</span>
              </div>
            </div>

            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Transaksi telah diverifikasi dan masuk dalam buku kas resmi warga.</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Catat Transaksi Modal (For Officers) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Catat Transaksi Buku Kas Baru"
        subtitle={`Wewenang: ${currentUser.roleTitle} · Pencatatan kas lingkungan`}
      >
        <form onSubmit={handleSaveTransaction} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Jenis Transaksi <span className="text-[#E5242A]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('pemasukan')}
                  className={`py-2 rounded-lg font-bold border text-xs transition-colors ${
                    type === 'pemasukan'
                      ? 'bg-[#EBF7F0] text-[#24865B] border-[#24865B]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  + Pemasukan
                </button>
                <button
                  type="button"
                  onClick={() => setType('pengeluaran')}
                  className={`py-2 rounded-lg font-bold border text-xs transition-colors ${
                    type === 'pengeluaran'
                      ? 'bg-[#FFF0F0] text-[#B5121B] border-[#B5121B]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  - Pengeluaran
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Tanggal Transaksi <span className="text-[#E5242A]">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Keterangan Transaksi <span className="text-[#E5242A]">*</span>
            </label>
            <input
              type="text"
              required
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Contoh: Iuran Kas Warga Bulan Oktober RT 03"
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Kategori <span className="text-[#E5242A]">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              >
                <option value="Iuran Warga">Iuran Warga</option>
                <option value="Kebersihan">Kebersihan</option>
                <option value="Keamanan">Keamanan</option>
                <option value="Infrastruktur">Infrastruktur</option>
                <option value="Donasi">Donasi</option>
                <option value="Kegiatan Warga">Kegiatan Warga</option>
                <option value="Kesehatan">Kesehatan</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Jumlah Nominal (Rp) <span className="text-[#E5242A]">*</span>
              </label>
              <input
                type="number"
                required
                min={1000}
                value={amount}
                onChange={e => setAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="Contoh: 500000"
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs font-mono text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Wilayah Buku Kas <span className="text-[#E5242A]">*</span>
            </label>
            <select
              value={txnRt}
              onChange={e => setTxnRt(e.target.value)}
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            >
              <option value="RW 05">Kas Induk RW 05</option>
              <option value="RT 01">Kas RT 01</option>
              <option value="RT 02">Kas RT 02</option>
              <option value="RT 03">Kas RT 03</option>
              <option value="RT 04">Kas RT 04</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E9EBEF] text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white font-semibold shadow-sm"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
