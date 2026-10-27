import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  formatTanggalIndo,
  calculateFinancialSummary,
  filterTransactionsByScope,
  generateMonthlyAggregation,
  canCreateFinancialEntry,
  canApproveDocument,
  filterProducts,
  filterReports,
} from './civicLogic.ts';
import { FinancialTransaction, ProductItem, EmergencyReport } from '../types/index.ts';

test('formatRupiah correctly formats Indonesian currency', () => {
  assert.equal(formatRupiah(15000), 'Rp15.000');
  assert.equal(formatRupiah(350000), 'Rp350.000');
  assert.equal(formatRupiah(3500000), 'Rp3.500.000');
  assert.equal(formatRupiah(0), 'Rp0');
});

test('formatTanggalIndo correctly converts YYYY-MM-DD to Indonesian format', () => {
  assert.equal(formatTanggalIndo('2026-10-28'), '28 Okt 2026');
  assert.equal(formatTanggalIndo('2026-05-15'), '15 Mei 2026');
});

test('financial calculation correctly aggregates income, expenses, and balance', () => {
  const sampleTransactions: FinancialTransaction[] = [
    {
      id: 'tx-1',
      date: '2026-10-10',
      description: 'Iuran Bulanan RT 03',
      category: 'Iuran Warga',
      type: 'pemasukan',
      amount: 1200000,
      rt: 'RT 03',
      rw: 'RW 05',
      recordedBy: 'Budi Santoso',
    },
    {
      id: 'tx-2',
      date: '2026-10-12',
      description: 'Perbaikan Lampu Jalan',
      category: 'Infrastruktur',
      type: 'pengeluaran',
      amount: 450000,
      rt: 'RT 03',
      rw: 'RW 05',
      recordedBy: 'Budi Santoso',
    },
    {
      id: 'tx-3',
      date: '2026-10-15',
      description: 'Iuran Warga RT 01',
      category: 'Iuran Warga',
      type: 'pemasukan',
      amount: 900000,
      rt: 'RT 01',
      rw: 'RW 05',
      recordedBy: 'Siti Rahma',
    },
  ];

  // For RW 05 (all RTs)
  const allSummary = calculateFinancialSummary(sampleTransactions, 'RW 05');
  assert.equal(allSummary.totalPemasukan, 2100000);
  assert.equal(allSummary.totalPengeluaran, 450000);
  assert.equal(allSummary.saldoAkhir, 1650000);

  // Filtered by RT 03
  const rt3Summary = calculateFinancialSummary(sampleTransactions, 'RT 03');
  assert.equal(rt3Summary.totalPemasukan, 1200000);
  assert.equal(rt3Summary.totalPengeluaran, 450000);
  assert.equal(rt3Summary.saldoAkhir, 750000);
});

test('RBAC checks allow only officers to mutate official records', () => {
  assert.equal(canCreateFinancialEntry('penduduk'), false);
  assert.equal(canCreateFinancialEntry('ketua_rt'), true);
  assert.equal(canCreateFinancialEntry('pengurus_rw'), true);

  assert.equal(canApproveDocument('penduduk'), false);
  assert.equal(canApproveDocument('ketua_rt'), true);
});

test('filterProducts handles categories and search queries accurately', () => {
  const sampleProducts: ProductItem[] = [
    {
      id: 'p-1',
      title: 'Nasi Uduk & Lauk Rumahan',
      category: 'warung',
      price: 15000,
      condition: 'Segar & Hangat',
      seller: 'Bu Sri',
      rt: 'RT 03',
      rw: 'RW 05',
      phone: '081234567890',
      description: 'Paket nasi uduk komplit',
    },
    {
      id: 'p-2',
      title: 'Sepatu Sneakers Pria',
      category: 'barang_baru',
      price: 350000,
      condition: 'Baru dalam Box',
      seller: 'Dimas',
      rt: 'RT 02',
      rw: 'RW 05',
      phone: '081298765432',
      description: 'Ukuran 42 warna putih',
    },
  ];

  assert.equal(filterProducts(sampleProducts, '', 'warung').length, 1);
  assert.equal(filterProducts(sampleProducts, 'sneakers', 'semua').length, 1);
  assert.equal(filterProducts(sampleProducts, 'tidak ada', 'semua').length, 0);
});
