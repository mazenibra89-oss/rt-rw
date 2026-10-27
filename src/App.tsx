import React, { useState, useEffect } from 'react';
import { Sidebar, NavPage } from './components/common/Sidebar.tsx';
import { TopHeader } from './components/common/TopHeader.tsx';
import { EmergencyModal } from './components/common/EmergencyModal.tsx';
import { ToastContainer, ToastMessage } from './components/common/Toast.tsx';

// Pages
import { BerandaPage } from './pages/BerandaPage.tsx';
import { NotifikasiDaruratPage } from './pages/NotifikasiDaruratPage.tsx';
import { AdministrasiKependudukanPage } from './pages/AdministrasiKependudukanPage.tsx';
import { JualBeliPage } from './pages/JualBeliPage.tsx';
import { KeuanganPage } from './pages/KeuanganPage.tsx';
import { BeritaInformasiPage } from './pages/BeritaInformasiPage.tsx';
import { LayananWargaPage } from './pages/LayananWargaPage.tsx';
import { ForumWargaPage } from './pages/ForumWargaPage.tsx';
import { PengaturanPage } from './pages/PengaturanPage.tsx';

// Mock Data
import {
  INITIAL_USERS,
  INITIAL_EMERGENCY_REPORTS,
  INITIAL_DOCUMENT_REQUESTS,
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
  INITIAL_NEWS,
  INITIAL_ANNOUNCEMENTS,
  WEATHER_DATA,
  INITIAL_COMPLAINTS,
  INITIAL_FORUM_TOPICS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData.ts';

import {
  UserProfile,
  UserRole,
  EmergencyReport,
  IncidentCategory,
  DocumentRequest,
  ProductItem,
  FinancialTransaction,
  AnnouncementItem,
  ComplaintItem,
  ForumTopic,
  NotificationItem,
  ReportStatus,
  RequestStatus,
} from './types/index.ts';

export default function App() {
  // Navigation & Role State
  const [currentPage, setCurrentPage] = useState<NavPage>('beranda');
  const [currentRole, setCurrentRole] = useState<UserRole>('ketua_rt');
  const [activeRtFilter, setActiveRtFilter] = useState<string>('RT 03');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global Emergency Modal State
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyInitialCategory, setEmergencyInitialCategory] = useState<IncidentCategory>('lainnya');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      type,
      title,
      message,
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Persistent / Reactive Mock State
  const [users, setUsers] = useState<Record<string, UserProfile>>(() => {
    const saved = localStorage.getItem('lapor_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const currentUser = users[currentRole] || INITIAL_USERS.ketua_rt;

  const [emergencyReports, setEmergencyReports] = useState<EmergencyReport[]>(() => {
    const saved = localStorage.getItem('lapor_emergency');
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_REPORTS;
  });

  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>(() => {
    const saved = localStorage.getItem('lapor_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENT_REQUESTS;
  });

  const [products, setProducts] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem('lapor_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('lapor_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    const saved = localStorage.getItem('lapor_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [complaints, setComplaints] = useState<ComplaintItem[]>(() => {
    const saved = localStorage.getItem('lapor_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(() => {
    const saved = localStorage.getItem('lapor_forum');
    return saved ? JSON.parse(saved) : INITIAL_FORUM_TOPICS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('lapor_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lapor_emergency', JSON.stringify(emergencyReports));
      localStorage.setItem('lapor_documents', JSON.stringify(documentRequests));
      localStorage.setItem('lapor_products', JSON.stringify(products));
      localStorage.setItem('lapor_transactions', JSON.stringify(transactions));
      localStorage.setItem('lapor_announcements', JSON.stringify(announcements));
      localStorage.setItem('lapor_complaints', JSON.stringify(complaints));
      localStorage.setItem('lapor_forum', JSON.stringify(forumTopics));
      localStorage.setItem('lapor_notifications', JSON.stringify(notifications));
      localStorage.setItem('lapor_users', JSON.stringify(users));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [
    emergencyReports,
    documentRequests,
    products,
    transactions,
    announcements,
    complaints,
    forumTopics,
    notifications,
    users,
  ]);

  // Handlers
  const handleOpenEmergencyModal = (cat?: IncidentCategory) => {
    setEmergencyInitialCategory(cat || 'lainnya');
    setIsEmergencyModalOpen(true);
  };

  const handleCreateEmergencyReport = (
    reportData: Omit<EmergencyReport, 'id' | 'time' | 'date' | 'status'>
  ) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateStr = now.toISOString().split('T')[0];

    const newReport: EmergencyReport = {
      ...reportData,
      id: `EMG-${now.getFullYear()}-${String(emergencyReports.length + 1).padStart(3, '0')}`,
      time: `${hours}:${minutes} WIB`,
      date: dateStr,
      status: 'baru',
    };

    setEmergencyReports(prev => [newReport, ...prev]);

    // Also add to notifications
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Laporan Darurat Baru: ${newReport.title}`,
      message: `${newReport.reporter} melaporkan insiden di ${newReport.location}`,
      time: 'Baru saja',
      type: 'darurat',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    addToast(
      'success',
      'Laporan Darurat Terkirim',
      `Informasi telah diteruskan ke Pengurus RT & Tim Keamanan Lingkungan.`
    );
  };

  const handleUpdateReportStatus = (reportId: string, status: ReportStatus, notes?: string) => {
    setEmergencyReports(prev =>
      prev.map(r =>
        r.id === reportId
          ? {
              ...r,
              status,
              resolutionNotes: notes || r.resolutionNotes,
              assignedOfficer: r.assignedOfficer || currentUser.name,
            }
          : r
      )
    );
    addToast('success', 'Status Laporan Diperbarui', `Laporan ${reportId} telah ditandai ${status}.`);
  };

  const handleCreateDocumentRequest = (
    reqData: Omit<DocumentRequest, 'id' | 'requestNumber' | 'status' | 'requestDate'>
  ) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const newRequest: DocumentRequest = {
      ...reqData,
      id: `REQ-${Date.now().toString().slice(-4)}`,
      requestNumber: `PM-${now.getFullYear()}-${String(documentRequests.length + 1).padStart(4, '0')}`,
      requestDate: dateStr,
      status: 'Baru',
    };

    setDocumentRequests(prev => [newRequest, ...prev]);
    addToast(
      'success',
      'Permohonan Terkirim',
      `Surat pengantar ${newRequest.serviceType} berhasil diajukan untuk verifikasi Ketua RT.`
    );
  };

  const handleUpdateDocStatus = (requestId: string, status: RequestStatus) => {
    setDocumentRequests(prev =>
      prev.map(d => (d.id === requestId ? { ...d, status } : d))
    );
    addToast('success', 'Status Dokumen Diperbarui', `Permohonan ${requestId} ditandai ${status}.`);
  };

  const handleCreateProduct = (prodData: Omit<ProductItem, 'id'>) => {
    const newProd: ProductItem = {
      ...prodData,
      id: `PROD-${Date.now().toString().slice(-4)}`,
    };
    setProducts(prev => [newProd, ...prev]);
    addToast('success', 'Iklan Berhasil Diterbitkan', `Produk "${newProd.title}" kini tampil di bursa warga.`);
  };

  const handleToggleFavoriteProduct = (productId: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const handleAddTransaction = (txnData: Omit<FinancialTransaction, 'id'>) => {
    const newTxn: FinancialTransaction = {
      ...txnData,
      id: `TXN-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(4, '0')}`,
    };
    setTransactions(prev => [newTxn, ...prev]);
    addToast('success', 'Transaksi Kas Tersimpan', `Catatan kas ${newTxn.category} berhasil diverifikasi.`);
  };

  const handleAddAnnouncement = (annData: Omit<AnnouncementItem, 'id'>) => {
    const newAnn: AnnouncementItem = {
      ...annData,
      id: `ANN-${Date.now().toString().slice(-4)}`,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addToast('success', 'Pengumuman Diterbitkan', `Pengumuman "${newAnn.title}" telah disiarkan ke warga.`);
  };

  const handleCreateComplaint = (
    cData: Omit<ComplaintItem, 'id' | 'upvotes' | 'status' | 'date'>
  ) => {
    const now = new Date().toISOString().split('T')[0];
    const newComplaint: ComplaintItem = {
      ...cData,
      id: `CMP-${Date.now().toString().slice(-4)}`,
      status: 'Menunggu',
      date: now,
      upvotes: 1,
      userUpvoted: true,
    };
    setComplaints(prev => [newComplaint, ...prev]);
    addToast('success', 'Pengaduan Terkirim', 'Laporan masalah fasilitas telah dicatat dalam sistem.');
  };

  const handleToggleComplaintUpvote = (complaintId: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          const upvoted = !c.userUpvoted;
          return {
            ...c,
            userUpvoted: upvoted,
            upvotes: upvoted ? c.upvotes + 1 : c.upvotes - 1,
          };
        }
        return c;
      })
    );
  };

  const handleUpdateComplaintStatus = (
    complaintId: string,
    status: 'Menunggu' | 'Diproses' | 'Selesai',
    note: string
  ) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === complaintId ? { ...c, status, responseNotes: note } : c
      )
    );
    addToast('success', 'Tindak Lanjut Diperbarui', `Status pengaduan ${complaintId} menjadi ${status}.`);
  };

  const handleCreateForumTopic = (
    tData: Omit<ForumTopic, 'id' | 'repliesCount' | 'upvotes' | 'date'>
  ) => {
    const newTopic: ForumTopic = {
      ...tData,
      id: `FRM-${Date.now().toString().slice(-4)}`,
      date: 'Baru saja',
      repliesCount: 0,
      upvotes: 1,
      userUpvoted: true,
    };
    setForumTopics(prev => [newTopic, ...prev]);
    addToast('success', 'Topik Terbuka', 'Topik diskusi baru telah dimulai di Forum Warga.');
  };

  const handleToggleTopicUpvote = (topicId: string) => {
    setForumTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const upvoted = !t.userUpvoted;
          return {
            ...t,
            userUpvoted: upvoted,
            upvotes: upvoted ? t.upvotes + 1 : t.upvotes - 1,
          };
        }
        return t;
      })
    );
  };

  const handleVotePoll = (topicId: string, optionIndex: number) => {
    setForumTopics(prev =>
      prev.map(t => {
        if (t.id === topicId && t.poll) {
          const oldVote = t.poll.userVote;
          if (oldVote === optionIndex) return t; // already voted same

          const newOptions = t.poll.options.map((opt, idx) => {
            if (idx === optionIndex) return { ...opt, votes: opt.votes + 1 };
            if (oldVote !== undefined && idx === oldVote) return { ...opt, votes: Math.max(0, opt.votes - 1) };
            return opt;
          });

          const totalVotes = newOptions.reduce((acc, curr) => acc + curr.votes, 0);

          return {
            ...t,
            poll: {
              ...t.poll,
              options: newOptions,
              totalVotes,
              userVote: optionIndex,
            },
          };
        }
        return t;
      })
    );
    addToast('success', 'Suara Tercatat', 'Terima kasih telah berpartisipasi dalam polling warga!');
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUsers(prev => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        ...updated,
      },
    }));
    addToast('success', 'Profil Diperbarui', 'Perubahan identitas kontak berhasil disimpan.');
  };

  const handleMarkNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('info', 'Notifikasi Dibaca', 'Semua notifikasi telah ditandai telah dibaca.');
  };

  // Header Title mapping
  const getHeaderTitle = () => {
    switch (currentPage) {
      case 'beranda':
        return `Selamat Pagi, ${currentUser.name}`;
      case 'darurat':
        return 'Notifikasi & Darurat Lingkungan';
      case 'berita':
        return 'Berita & Informasi Wilayah';
      case 'administrasi':
        return 'Administrasi Kependudukan';
      case 'jualbeli':
        return 'Jual Beli Warga';
      case 'keuangan':
        return 'Keuangan Kas RT/RW';
      case 'layanan':
        return 'Layanan & Pengaduan Warga';
      case 'forum':
        return 'Forum & Musyawarah Warga';
      case 'pengaturan':
        return 'Profil & Pengaturan';
      default:
        return 'Lapor RT/RW';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        currentUser={currentUser}
        onChangeRole={setCurrentRole}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport (Desktop offset: lg:pl-[200px]) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[200px]">
        {/* Top Header */}
        <TopHeader
          pageTitle={getHeaderTitle()}
          currentUser={currentUser}
          activeRtFilter={activeRtFilter}
          onChangeRtFilter={setActiveRtFilter}
          notifications={notifications}
          onMarkNotificationsRead={handleMarkNotificationsRead}
          onChangeRole={setCurrentRole}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenEmergencyModal={() => handleOpenEmergencyModal('lainnya')}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {currentPage === 'beranda' && (
            <BerandaPage
              currentUser={currentUser}
              news={INITIAL_NEWS}
              announcements={announcements}
              weather={WEATHER_DATA}
              onNavigate={setCurrentPage}
              onOpenEmergencyModal={handleOpenEmergencyModal}
            />
          )}

          {currentPage === 'darurat' && (
            <NotifikasiDaruratPage
              reports={emergencyReports}
              currentUser={currentUser}
              onOpenReportModal={handleOpenEmergencyModal}
              onUpdateReportStatus={handleUpdateReportStatus}
            />
          )}

          {currentPage === 'administrasi' && (
            <AdministrasiKependudukanPage
              requests={documentRequests}
              currentUser={currentUser}
              onCreateRequest={handleCreateDocumentRequest}
              onUpdateStatus={handleUpdateDocStatus}
            />
          )}

          {currentPage === 'jualbeli' && (
            <JualBeliPage
              products={products}
              currentUser={currentUser}
              onCreateProduct={handleCreateProduct}
              onToggleFavorite={handleToggleFavoriteProduct}
            />
          )}

          {currentPage === 'keuangan' && (
            <KeuanganPage
              transactions={transactions}
              currentUser={currentUser}
              activeRtFilter={activeRtFilter}
              onChangeRtFilter={setActiveRtFilter}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {currentPage === 'berita' && (
            <BeritaInformasiPage
              news={INITIAL_NEWS}
              announcements={announcements}
              currentUser={currentUser}
              onAddAnnouncement={handleAddAnnouncement}
            />
          )}

          {currentPage === 'layanan' && (
            <LayananWargaPage
              complaints={complaints}
              currentUser={currentUser}
              onCreateComplaint={handleCreateComplaint}
              onToggleUpvote={handleToggleComplaintUpvote}
              onUpdateComplaintStatus={handleUpdateComplaintStatus}
            />
          )}

          {currentPage === 'forum' && (
            <ForumWargaPage
              topics={forumTopics}
              currentUser={currentUser}
              onCreateTopic={handleCreateForumTopic}
              onToggleUpvote={handleToggleTopicUpvote}
              onVotePoll={handleVotePoll}
            />
          )}

          {currentPage === 'pengaturan' && (
            <PengaturanPage
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              onChangeRole={setCurrentRole}
            />
          )}
        </main>
      </div>

      {/* Global Emergency Report Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onSubmit={handleCreateEmergencyReport}
        initialCategory={emergencyInitialCategory}
        defaultLocation={`Jl. Melati ${currentUser.rt}`}
        defaultPhone={currentUser.phone}
        reporterName={currentUser.name}
      />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
