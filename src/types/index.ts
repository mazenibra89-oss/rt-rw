export type UserRole = 'penduduk' | 'ketua_rt' | 'pengurus_rw';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  phone: string;
  email: string;
  nik: string;
}

export type IncidentCategory = 'kematian' | 'pencurian' | 'kecelakaan' | 'bencana_alam' | 'lainnya';

export type ReportStatus = 'baru' | 'diproses' | 'selesai';

export interface EmergencyReport {
  id: string;
  type: IncidentCategory;
  title: string;
  reporter: string;
  location: string;
  time: string;
  date: string;
  status: ReportStatus;
  description: string;
  phone: string;
  assignedOfficer?: string;
  resolutionNotes?: string;
}

export type DocumentType = 
  | 'KTP' 
  | 'Kartu Keluarga' 
  | 'Surat Pindah' 
  | 'Akta Kelahiran' 
  | 'Akta Kematian' 
  | 'Lainnya';

export type RequestStatus = 'Baru' | 'Diproses' | 'Selesai' | 'Ditolak';

export interface DocumentRequest {
  id: string;
  serviceType: DocumentType;
  applicantName: string;
  nik: string;
  requestNumber: string;
  requestDate: string;
  status: RequestStatus;
  notes: string;
  phone: string;
  rt: string;
  rw: string;
  estimatedCompletion: string;
}

export type ProductCategory = 'semua' | 'warung' | 'barang_baru' | 'barang_bekas';

export interface ProductItem {
  id: string;
  title: string;
  category: 'warung' | 'barang_baru' | 'barang_bekas';
  price: number;
  condition: string;
  seller: string;
  rt: string;
  rw: string;
  phone: string;
  description: string;
  isFavorite?: boolean;
  badge?: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'pemasukan' | 'pengeluaran';
  amount: number;
  rt: string; // e.g. "RT 01", "RT 02", "RT 03", "RT 04", "RW 05"
  rw: string;
  recordedBy: string;
}

export interface MonthlyChartData {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  scope: 'RT' | 'RW' | 'Kelurahan' | 'Kota';
  publishedAt: string;
  category: string;
  readCount: number;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  scope: string;
  date: string;
  urgent?: boolean;
  author: string;
}

export interface WeatherData {
  city: string;
  condition: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  uvIndex: string;
  forecast: string;
}

export interface ComplaintItem {
  id: string;
  title: string;
  category: 'Infrastruktur' | 'Kebersihan' | 'Keamanan' | 'Sosial' | 'Lainnya';
  location: string;
  reporter: string;
  date: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai';
  upvotes: number;
  userUpvoted?: boolean;
  description: string;
  responseNotes?: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  date: string;
  category: string;
  content: string;
  repliesCount: number;
  upvotes: number;
  userUpvoted?: boolean;
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
    userVote?: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'darurat' | 'info' | 'dokumen' | 'keuangan';
  read: boolean;
}
