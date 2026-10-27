import { FinancialTransaction, MonthlyChartData, ProductItem, EmergencyReport, UserRole } from '../types/index.ts';

/**
 * Format numbers into standard Indonesian Rupiah currency format
 * Example: 350000 -> "Rp350.000"
 */
export function formatRupiah(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString('id-ID');
  return `Rp${formatted}`;
}

/**
 * Format date string (YYYY-MM-DD) into Indonesian human readable format
 * Example: "2026-10-28" -> "28 Okt 2026"
 */
export function formatTanggalIndo(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  
  const bulan = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const day = parseInt(parts[2], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const year = parts[0];

  if (monthIdx >= 0 && monthIdx < 12) {
    return `${day} ${bulan[monthIdx]} ${year}`;
  }
  return dateStr;
}

/**
 * Calculate totals and remaining balance for a given RT/RW filter
 */
export function calculateFinancialSummary(
  transactions: FinancialTransaction[],
  filterScope: string
): { totalPemasukan: number; totalPengeluaran: number; saldoAkhir: number } {
  const filtered = filterTransactionsByScope(transactions, filterScope);

  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  for (const t of filtered) {
    if (t.type === 'pemasukan') {
      totalPemasukan += t.amount;
    } else {
      totalPengeluaran += t.amount;
    }
  }

  const saldoAkhir = totalPemasukan - totalPengeluaran;
  return { totalPemasukan, totalPengeluaran, saldoAkhir };
}

/**
 * Filter transactions by RT or RW scope
 */
export function filterTransactionsByScope(
  transactions: FinancialTransaction[],
  filterScope: string
): FinancialTransaction[] {
  if (!filterScope || filterScope === 'RW 05' || filterScope === 'Semua') {
    return transactions;
  }
  return transactions.filter(t => t.rt === filterScope);
}

/**
 * Generate monthly financial aggregated data for charts
 */
export function generateMonthlyAggregation(
  transactions: FinancialTransaction[],
  filterScope: string
): MonthlyChartData[] {
  const filtered = filterTransactionsByScope(transactions, filterScope);
  const months = ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'];
  
  const map: Record<string, { pemasukan: number; pengeluaran: number }> = {
    'Mei': { pemasukan: 0, pengeluaran: 0 },
    'Jun': { pemasukan: 0, pengeluaran: 0 },
    'Jul': { pemasukan: 0, pengeluaran: 0 },
    'Agu': { pemasukan: 0, pengeluaran: 0 },
    'Sep': { pemasukan: 0, pengeluaran: 0 },
    'Okt': { pemasukan: 0, pengeluaran: 0 },
  };

  filtered.forEach(t => {
    // determine month from date (YYYY-MM-DD)
    const monthNum = parseInt(t.date.split('-')[1], 10);
    let monthName = 'Okt';
    if (monthNum === 5) monthName = 'Mei';
    else if (monthNum === 6) monthName = 'Jun';
    else if (monthNum === 7) monthName = 'Jul';
    else if (monthNum === 8) monthName = 'Agu';
    else if (monthNum === 9) monthName = 'Sep';
    else if (monthNum === 10) monthName = 'Okt';

    if (map[monthName]) {
      if (t.type === 'pemasukan') {
        map[monthName].pemasukan += t.amount;
      } else {
        map[monthName].pengeluaran += t.amount;
      }
    }
  });

  return months.map(m => ({
    month: m,
    pemasukan: map[m].pemasukan,
    pengeluaran: map[m].pengeluaran,
  }));
}

/**
 * Role-Based Access Control logic
 */
export function canCreateFinancialEntry(role: UserRole): boolean {
  return role === 'ketua_rt' || role === 'pengurus_rw';
}

export function canApproveDocument(role: UserRole): boolean {
  return role === 'ketua_rt' || role === 'pengurus_rw';
}

export function canPublishAnnouncement(role: UserRole): boolean {
  return role === 'ketua_rt' || role === 'pengurus_rw';
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'pengurus_rw';
}

/**
 * Search and category filtering for marketplace products
 */
export function filterProducts(
  products: ProductItem[],
  query: string,
  category: string
): ProductItem[] {
  return products.filter(product => {
    const matchesCategory =
      category === 'semua' || product.category === category;
    
    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    return (
      product.title.toLowerCase().includes(q) ||
      product.seller.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.condition.toLowerCase().includes(q)
    );
  });
}

/**
 * Search and filter for emergency incident reports
 */
export function filterReports(
  reports: EmergencyReport[],
  filterType: string,
  search: string
): EmergencyReport[] {
  return reports.filter(report => {
    const matchesType =
      filterType === 'semua' || report.type === filterType;

    if (!matchesType) return false;

    if (!search.trim()) return true;

    const s = search.toLowerCase();
    return (
      report.title.toLowerCase().includes(s) ||
      report.location.toLowerCase().includes(s) ||
      report.reporter.toLowerCase().includes(s) ||
      report.description.toLowerCase().includes(s)
    );
  });
}
