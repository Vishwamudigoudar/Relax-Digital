import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useCart } from '../../context/CartContext';
import {
  Search,
  ShoppingBag,
  Star,
  Check,
  Eye,
  SlidersHorizontal,
  X,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
} from 'lucide-react';

const UserDashboard = () => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [loading, setLoading] = useState(true);
  const [addedNotice, setAddedNotice] = useState('');

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/products/categories/list');
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products', {
        params: {
          category: selectedCategory,
          search,
          sort,
          limit: 20,
        },
      });
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, search, sort]);

  const handleAddToCart = (product, qty = 1) => {
    addToCart(product, qty);
    setAddedNotice(`Added "${product.name}" to your cart!`);
    setTimeout(() => setAddedNotice(''), 3000);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Hero Promotional Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Curated High-End Tech & Essentials</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Discover Tomorrow&apos;s Tech Today
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-lg">
            Shop the newest premium audio, smart wearables, minimalist displays, and ergonomic workspaces with immediate checkout and rapid tracked delivery.
          </p>
        </div>

        {/* Decorative graphic glow */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center space-x-2.5 animate-bounce">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center font-bold">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              <option value="-createdAt">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
          <p className="text-xs font-medium">Fetching curated collections...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn&apos;t find any items matching your filters. Try selecting a different category or clearing your search term.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearch('');
            }}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm border border-slate-200/60">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900 shadow-sm">
                      ★ Featured
                    </span>
                  )}
                </div>

                {/* Stock Tag */}
                <div className="absolute top-3 right-3">
                  {product.stock > 10 ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow">
                      In Stock
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow">
                      Only {product.stock} left
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-700 text-white shadow">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Hover Quick View Trigger */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <button
                    onClick={() => {
                      setQuickViewProduct(product);
                      setModalQty(1);
                    }}
                    className="px-4 py-2 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold rounded-xl shadow-lg flex items-center space-x-1.5 transition transform translate-y-2 group-hover:translate-y-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick Details</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Rating */}
                  <div className="flex items-center space-x-1 text-amber-400 text-xs mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-slate-700">{product.rating || 4.8}</span>
                    <span className="text-slate-400 text-[11px]">(Verified)</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price and Cart Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Price</span>
                    <span className="text-lg font-black text-slate-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    disabled={product.stock <= 0}
                    onClick={() => handleAddToCart(product, 1)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{product.stock <= 0 ? 'Sold Out' : 'Add'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-slate-500 hover:text-slate-800 shadow"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image */}
              <div className="aspect-square md:aspect-auto bg-slate-100">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Specifications */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {quickViewProduct.category}
                    </span>
                    <div className="flex items-center text-amber-400 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      <span className="font-bold text-slate-800">{quickViewProduct.rating || 4.8} / 5.0</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900">{quickViewProduct.name}</h2>
                  <p className="text-2xl font-black text-emerald-600">
                    ${quickViewProduct.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  <div className="text-xs space-y-1 text-slate-500 pt-2 border-t border-slate-100">
                    <p className="flex justify-between">
                      <span>Availability:</span>
                      <span className="font-semibold text-emerald-700">
                        {quickViewProduct.stock > 0 ? `${quickViewProduct.stock} units ready to ship` : 'Out of stock'}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Delivery:</span>
                      <span className="font-semibold text-slate-700">Free Priority Express (2-3 days)</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {quickViewProduct.stock > 0 && (
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button
                          onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                          className="p-1.5 hover:bg-slate-100 text-slate-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-800">{modalQty}</span>
                        <button
                          onClick={() => setModalQty(Math.min(quickViewProduct.stock, modalQty + 1))}
                          className="p-1.5 hover:bg-slate-100 text-slate-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    disabled={quickViewProduct.stock <= 0}
                    onClick={() => {
                      handleAddToCart(quickViewProduct, modalQty);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {quickViewProduct.stock > 0
                        ? `Add to Cart &bull; $${(quickViewProduct.price * modalQty).toFixed(2)}`
                        : 'Out of Stock'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
