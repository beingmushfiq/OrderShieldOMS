import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  ChevronRight, 
  Tag,
  Box,
  DollarSign,
  X
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  sku: string;
  stock: number;
}

const initialProducts: Product[] = [];

import api from "@/src/lib/api";
import { Category, Product } from "@/src/types";
import { useAuth } from "@/src/context/AuthContext";

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [stock, setStock] = useState<number>(0);
  
  // New Category State
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const fallbackCategories = [
        { id: 1, name: 'Books', slug: 'books' },
        { id: 2, name: 'Electronics', slug: 'electronics' }
      ];

      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !category) {
        setCategoryId(catRes.data[0].id);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      // Fallback for demo
      setProducts(initialProducts);
      setCategories([
        { id: 1, name: 'Books', slug: 'books' },
        { id: 2, name: 'Electronics', slug: 'electronics' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const resetForm = () => {
    setName("");
    setPrice(0);
    setDescription("");
    setCategoryId(categories[0]?.id || "");
    setStock(0);
    setEditingProduct(null);
    setShowNewCategory(false);
    setNewCategoryName("");
  };

  const handleEdit = (p: Product) => {
    if (!isAdmin) return;
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setDescription(p.description);
    setCategoryId(p.category_id || "");
    setStock(p.stock);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    try {
      let finalCategoryId = categoryId;

      // Handle New Category Creation
      if (showNewCategory && newCategoryName) {
        const catRes = await api.post('/categories', { name: newCategoryName });
        const newCat = catRes.data;
        setCategories([...categories, newCat]);
        finalCategoryId = newCat.id;
      }

      const productData = {
        name,
        price,
        description,
        category_id: finalCategoryId,
        stock,
        sku: editingProduct?.sku || `P-SENT-${Math.floor(1000 + Math.random() * 9000)}`
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct.id}`, productData);
        setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
      } else {
        const res = await api.post('/products', productData);
        setProducts([res.data, ...products]);
      }
      
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to save product. Please ensure the backend is running.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) return;
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8"
    >
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or SKU..."
            className="w-full bg-surface-container-low border-none rounded-lg pl-12 pr-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-high transition-all"
          />
        </div>
        {isAdmin && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} />
            Add New Product
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 hover:bg-surface-container transition-all group shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Box className="text-primary" size={24} />
                </div>
                {isAdmin && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-error/10 rounded-full text-on-surface-variant hover:text-error transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {product.sku}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                    {product.category || categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">{product.name}</h3>
                <p className="text-sm text-on-surface-variant line-clamp-2 h-10">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-outline-variant/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Price</p>
                  <p className="text-lg font-black text-primary">BDT {product.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Stock</p>
                  <p className={cn(
                    "text-sm font-bold",
                    product.stock < 15 ? "text-error" : "text-secondary"
                  )}>{product.stock} units</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center">
          <Package className="mx-auto mb-4 text-on-surface-variant/20" size={64} />
          <h3 className="text-xl font-bold mb-2">No products found</h3>
          <p className="text-on-surface-variant">Try adjusting your search terms</p>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-xl mx-auto bg-surface-container-low/95 backdrop-blur-2xl rounded-2xl z-[110] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-outline-variant/10 overflow-hidden"
            >
              <form onSubmit={handleSubmit}>
                <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
                  <h3 className="font-bold text-lg">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                  <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-surface-container-high rounded-full">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Product Name</label>
                      <input 
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 transition-all" 
                        placeholder="e.g. Premium Hardware Case"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
                        <button 
                          type="button"
                          onClick={() => setShowNewCategory(!showNewCategory)}
                          className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                        >
                          {showNewCategory ? 'Select Existing' : '+ Add New Category'}
                        </button>
                      </div>
                      
                      {showNewCategory ? (
                        <div className="flex gap-3">
                          <input 
                            required
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            className="flex-1 bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 transition-all" 
                            placeholder="New category name..."
                          />
                        </div>
                      ) : (
                        <select 
                          required
                          value={categoryId}
                          onChange={e => setCategoryId(e.target.value)}
                          className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all appearance-none"
                        >
                          <option value="" disabled>Select a category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Price (BDT)</label>
                      <input 
                        required
                        type="number"
                        value={price || ''}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all" 
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Initial Stock</label>
                      <input 
                        required
                        type="number"
                        value={stock || ''}
                        onChange={e => setStock(Number(e.target.value))}
                        className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all" 
                        placeholder="0"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Description</label>
                      <textarea 
                        required
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 transition-all resize-none" 
                        placeholder="Detailed product information..."
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-surface-container/50 border-t border-outline-variant/10 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 rounded-lg text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-10 py-3 bg-primary text-on-primary rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
