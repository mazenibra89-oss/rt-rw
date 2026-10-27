import React, { useState } from 'react';
import {
  ProductItem,
  ProductCategory,
  UserProfile,
} from '../types/index.ts';
import { Modal } from '../components/common/Modal.tsx';
import {
  Search,
  Plus,
  Heart,
  Store,
  Tag,
  Phone,
  MapPin,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Package,
} from 'lucide-react';
import { formatRupiah, filterProducts } from '../utils/civicLogic.ts';

interface JualBeliPageProps {
  products: ProductItem[];
  currentUser: UserProfile;
  onCreateProduct: (product: Omit<ProductItem, 'id'>) => void;
  onToggleFavorite: (productId: string) => void;
}

export const JualBeliPage: React.FC<JualBeliPageProps> = ({
  products,
  currentUser,
  onCreateProduct,
  onToggleFavorite,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Listing Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'warung' | 'barang_baru' | 'barang_bekas'>('warung');
  const [price, setPrice] = useState<number | ''>('');
  const [condition, setCondition] = useState('Baru');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(currentUser.phone);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'semua', label: 'Semua Produk' },
    { id: 'warung', label: 'Warung & Kuliner' },
    { id: 'barang_baru', label: 'Barang Baru' },
    { id: 'barang_bekas', label: 'Barang Bekas' },
  ];

  const filteredProducts = filterProducts(products, searchQuery, activeCategory);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    onCreateProduct({
      title,
      category,
      price: Number(price),
      condition,
      seller: currentUser.name,
      rt: currentUser.rt,
      rw: currentUser.rw,
      phone,
      description,
      isFavorite: false,
    });

    setIsListingModalOpen(false);
    setTitle('');
    setPrice('');
    setDescription('');
  };

  // Helper icons / colors based on category
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'warung':
        return { bg: 'bg-amber-500/10 text-amber-700', icon: Store, label: 'Warung' };
      case 'barang_baru':
        return { bg: 'bg-emerald-500/10 text-emerald-700', icon: Package, label: 'Baru' };
      case 'barang_bekas':
        return { bg: 'bg-blue-500/10 text-blue-700', icon: Tag, label: 'Preloved' };
      default:
        return { bg: 'bg-slate-100 text-slate-700', icon: ShoppingBag, label: 'Produk' };
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#20242B] tracking-tight">
            Jual Beli Warga
          </h1>
          <p className="text-xs sm:text-sm text-[#737B87] mt-0.5">
            Dukung ekonomi warga dengan jual beli antar tetangga di lingkungan {currentUser.rw}.
          </p>
        </div>

        <button
          onClick={() => setIsListingModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white text-xs font-semibold shadow-sm transition-all active:scale-98 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Pasang Iklan</span>
        </button>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E9EBEF] shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari produk, nama penjual, atau kategori..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E9EBEF] text-xs text-[#20242B] placeholder:text-slate-400 focus:outline-none focus:border-[#B5121B]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#FFF0F0] text-[#B5121B] border border-[#FCDADA] font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Six Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-[#E9EBEF] p-6">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada produk ditemukan</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Coba ganti kata kunci pencarian atau kategori filter.
            </p>
          </div>
        ) : (
          filteredProducts.map(product => {
            const theme = getCategoryTheme(product.category);
            const CategoryIcon = theme.icon;

            return (
              <div
                key={product.id}
                className="rounded-xl bg-white border border-[#E9EBEF] hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden shadow-2xs group"
              >
                {/* Visual Image / Gradient Container */}
                <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 relative flex items-center justify-center p-4 overflow-hidden">
                  {/* Stylized background watermark pattern */}
                  <div className="absolute -right-4 -bottom-4 text-slate-300/40 transform rotate-12">
                    <CategoryIcon className="w-28 h-28" />
                  </div>

                  {/* Top Badge & Favorite Button */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${theme.bg}`}>
                      {product.condition || theme.label}
                    </span>
                    <button
                      onClick={() => onToggleFavorite(product.id)}
                      aria-label="Favorit"
                      className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-[#E5242A] transition-colors shadow-2xs"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          product.isFavorite ? 'fill-[#E5242A] text-[#E5242A]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Centered Graphic Icon */}
                  <div className="relative z-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto text-[#B5121B]">
                      <CategoryIcon className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#20242B] group-hover:text-[#B5121B] transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-[#737B87] mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E9EBEF]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[120px]">
                          {product.seller} ({product.rt})
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#24865B] tabular-nums">
                        {formatRupiah(product.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full py-1.5 rounded-lg border border-[#E9EBEF] hover:bg-[#FFF0F0] hover:text-[#B5121B] hover:border-[#FCDADA] text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Lihat Detail</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.title}
          subtitle={`Dijual oleh ${selectedProduct.seller} · ${selectedProduct.rt} / ${selectedProduct.rw}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div>
                <span className="text-[10px] text-emerald-700 block font-medium">Harga Warga</span>
                <span className="text-base font-extrabold text-[#24865B] tabular-nums">
                  {formatRupiah(selectedProduct.price)}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-white text-emerald-800 font-semibold border border-emerald-200">
                {selectedProduct.condition}
              </span>
            </div>

            <div>
              <span className="block font-semibold text-slate-700 mb-1">Deskripsi Produk:</span>
              <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Penjual:</span>
                <span className="font-semibold text-slate-800">{selectedProduct.seller}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Domisili:</span>
                <span className="text-slate-800">{selectedProduct.rt} / {selectedProduct.rw}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kontak WhatsApp:</span>
                <span className="font-mono text-slate-800">{selectedProduct.phone}</span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-100 p-2.5 text-[11px] text-slate-500 text-center">
              *Transaksi dikoordinasikan langsung antar warga sekitar. Pastikan cek barang sebelum membayar.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9EBEF]">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-lg border border-[#E9EBEF] text-slate-600 hover:bg-slate-50 font-medium"
              >
                Tutup
              </button>
              <a
                href={`https://wa.me/${selectedProduct.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-[#24865B] hover:bg-emerald-700 text-white font-semibold transition-colors inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi Penjual</span>
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* Pasang Iklan Modal */}
      <Modal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        title="Pasang Iklan Jual Beli Warga"
        subtitle="Promosikan produk kuliner, barang baru, atau bekas ke tetangga lingkungan RT/RW."
      >
        <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Nama Produk / Jasa <span className="text-[#E5242A]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Contoh: Nasi Uduk Komplit Bu Sri"
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
                onChange={e =>
                  setCategory(e.target.value as 'warung' | 'barang_baru' | 'barang_bekas')
                }
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              >
                <option value="warung">Warung & Kuliner</option>
                <option value="barang_baru">Barang Baru</option>
                <option value="barang_bekas">Barang Bekas</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Kondisi <span className="text-[#E5242A]">*</span>
              </label>
              <input
                type="text"
                required
                value={condition}
                onChange={e => setCondition(e.target.value)}
                placeholder="Contoh: Baru / Bekas 95%"
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Harga (Rupiah) <span className="text-[#E5242A]">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={e => setPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="Contoh: 15000"
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs tabular-nums text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Nomor Kontak WhatsApp <span className="text-[#E5242A]">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Deskripsi Produk & Ketersediaan <span className="text-[#E5242A]">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Jelaskan spesifikasi, porsi, rasa, atau tata cara pemesanan / COD antar tetangga..."
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsListingModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E9EBEF] text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white font-semibold shadow-sm"
            >
              Terbitkan Iklan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
