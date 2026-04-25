import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  X,
  CreditCard,
  MapPin,
  Smartphone,
  Mail,
  Box
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import api from '@/src/lib/api';


interface OrderItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  weight: number;
  sku: string;
}


// Initial empty catalog, will be populated from API
const initialProductCatalog: OrderItem[] = [];


export const CreateOrder: React.FC = () => {
  const [step, setStep] = useState(1);
  const [showAddItem, setShowAddItem] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [items, setItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });
  const [productCatalog, setProductCatalog] = useState<OrderItem[]>([]);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');

  // Fetch products on mount
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProductCatalog(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load product catalog');
      }
    };
    fetchProducts();
  }, []);


  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalWeight = items.reduce((acc, item) => acc + item.weight * item.quantity, 0);

  const updateQuantity = (id: number | string, delta: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number | string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };


  const addProduct = (product: OrderItem) => {
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      updateQuantity(existing.id, 1);
    } else {
      setItems(prev => [...prev, { ...product, quantity: 1 }]);
    }

    setShowAddItem(false);
  };

  const handleConfirm = async () => {
    if (items.length === 0) return toast.error('Please add at least one item');
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) return toast.error('Please fill all customer fields');
    
    setIsSubmitting(true);
    try {
      const response = await api.post('/orders', {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,

        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))
      });

      setPlacedOrderId(response.data.order_id);
      setIsSuccess(true);
      toast.success('Order placed successfully');
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fraudScore = 12; // Mock score for this demo

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface-container-low p-12 rounded-3xl border border-outline-variant/10 text-center max-w-md shadow-2xl"
        >
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-secondary" size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Order Placed</h2>
          <p className="text-on-surface-variant mb-8">Order #{placedOrderId} has been processed successfully.</p>
          <button 
            onClick={() => window.location.href = '/orders'}
            className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            Go to Orders
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-40 pt-6 px-4 md:px-12 max-w-7xl mx-auto"
    >
      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        {[
          { id: 1, label: 'Customer', icon: User },
          { id: 2, label: 'Items', icon: Package },
          { id: 3, label: 'Payment', icon: CreditCard },
        ].map((s, i) => (
          <React.Fragment key={s.id}>
            <div 
              onClick={() => setStep(s.id)}
              className={cn(
                "flex flex-col items-center gap-2 transition-opacity cursor-pointer",
                step < s.id && "opacity-50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                step >= s.id ? "bg-primary text-white ring-4 ring-primary/20" : "bg-surface-container-high text-on-surface-variant"
              )}>
                <s.icon size={20} />
              </div>
              <span className={cn(
                "text-[10px] uppercase font-bold tracking-widest",
                step >= s.id ? "text-primary" : "text-on-surface-variant"
              )}>{s.label}</span>
            </div>
            {i < 2 && (
              <div className={cn(
                "flex-1 h-[2px] mx-4 mb-6 transition-colors",
                step > s.id ? "bg-primary" : "bg-surface-container-high"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {step === 1 && (
            <motion.section 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">Customer Details</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Step 01 / 03</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-1 flex items-center gap-2">
                    <User size={12} /> Full Name
                  </label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all" 
                    placeholder="e.g. Shihab Shoron" 
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-1 flex items-center gap-2">
                    <Smartphone size={12} /> Phone Number
                  </label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all" 
                    placeholder="+880 1XXX XXXXXX" 
                    value={customerInfo.phone}
                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-1 flex items-center gap-2">
                    <Mail size={12} /> Email Address
                  </label>
                  <input 
                    type="email"
                    className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all" 
                    placeholder="customer@example.com" 
                    value={customerInfo.email}
                    onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-1 flex items-center gap-2">
                    <MapPin size={12} /> Shipping Address
                  </label>
                  <textarea 
                    className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all resize-none" 
                    placeholder="Full delivery address..." 
                    rows={4}
                    value={customerInfo.address}
                    onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                  />
                </div>
              </div>
            </motion.section>
          )}

          {(step === 2 || step === 1) && (
            <motion.section 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-6 pt-6 border-t border-outline-variant/10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">Order Items</h2>
                <button 
                  onClick={() => setShowAddItem(true)}
                  className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-xl transition-all"
                >
                  <Plus size={14} />
                  Add Product
                </button>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group flex flex-wrap md:flex-nowrap items-center gap-4 p-5 bg-surface-container-low border border-outline-variant/10 rounded-2xl transition-all hover:bg-surface-container hover:shadow-lg"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                        <Package className="text-primary" size={24} />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <p className="text-sm font-bold">{item.name}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest mt-1">{item.sku}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-surface-container-highest/50 p-1 rounded-xl">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-primary hover:text-white rounded-lg transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-black">{item.quantity.toString().padStart(2, '0')}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-primary hover:text-white rounded-lg transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right px-4 min-w-[120px]">
                        <p className="text-sm font-black text-primary">৳ {((item.price || 0) * (item.quantity || 0)).toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase">{(item.weight * item.quantity).toFixed(2)} kg</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-error/10 rounded-full transition-colors"
                      >
                        <Trash2 size={18} className="text-error" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {items.length === 0 && (
                  <div className="py-20 text-center bg-surface-container-low border border-dashed border-outline-variant/30 rounded-3xl">
                    <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-4">
                      <Box className="text-on-surface-variant/40" size={32} />
                    </div>
                    <p className="text-on-surface-variant font-medium">Your order is currently empty</p>
                    <button 
                      onClick={() => setShowAddItem(true)}
                      className="mt-4 text-xs font-bold text-primary uppercase tracking-widest hover:underline"
                    >
                      Browse product catalog
                    </button>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </div>

        {/* Right Column: Calculation & Risk */}
        <div className="space-y-8">
          <div className="sticky top-24 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-8">Order Summary</h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Subtotal ({items.length} items)</span>
                  <span className="font-bold">৳ {(subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Total Weight</span>
                  <span className="font-bold">{(totalWeight || 0).toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="font-bold text-secondary tracking-widest uppercase text-[10px]">Free</span>
                </div>
                <div className="pt-6 border-t border-outline-variant/10">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Total Amount</span>
                    <div className="text-right">
                      <p className="text-3xl font-black text-primary tracking-tighter">৳ {(subtotal || 0).toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase mt-1">VAT Included where applicable</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-5 bg-surface-container rounded-2xl flex items-center gap-4 border border-outline-variant/10">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Fraud Check</p>
                  <p className="text-xs font-bold">Fraud Score: {fraudScore}/100 (Safe)</p>
                </div>
              </div>
            </div>

            {/* Quick Preview Image */}
            <div className="rounded-3xl overflow-hidden h-44 relative group border border-outline-variant/10">
              <img 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=800&auto=format&fit=crop" 
                alt="Logistics"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-5 left-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Next-Day Delivery Eligible</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAddItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddItem(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-surface-container-low rounded-3xl z-[110] shadow-[0_40px_120px_rgba(0,0,0,0.6)] border border-outline-variant/10 overflow-hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
                <h3 className="font-black text-lg uppercase tracking-tight">Products</h3>
                <button onClick={() => setShowAddItem(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {productCatalog.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className="w-full flex items-center gap-4 p-4 bg-surface-container-low hover:bg-surface-container border border-outline-variant/10 rounded-2xl transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Package className="text-on-surface-variant group-hover:text-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">{product.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-tighter mt-0.5">{product.sku} • {product.weight} kg</p>
                    </div>
                    <span className="text-sm font-black text-primary">৳ {(product.price || 0).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Bar */}
      <footer className="fixed bottom-0 left-0 md:left-72 right-0 bg-background/80 backdrop-blur-2xl border-t border-outline-variant/10 px-8 py-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="hidden lg:flex items-center gap-4">
            {/* Session Info Removed */}
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-all">Save as Draft</button>
            <button 
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 lg:px-16 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-sm font-black uppercase tracking-[0.15em] shadow-[0_12px_32px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Place Order
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};
