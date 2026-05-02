import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import api from '@/src/lib/api';
import { 
  Check, 
  Truck, 
  MapPin, 
  Phone, 
  MessageSquare,
  Clock,
  Package,
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Shipment {
  id: string;
  name: string;
  status: 'delivered' | 'in-transit' | 'pending';
  eta: string;
  courier: string;
  location: string;
  lastUpdate: string;
}

export const Tracking: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  React.useEffect(() => {
    const fetchShipments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/shipments');
        setShipments(response.data);
        if (response.data.length > 0) {
          setSelectedShipment(response.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch shipments:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const statusStyle = {
    'delivered': { color: 'text-secondary', bg: 'bg-secondary/10', label: 'Delivered', icon: Check },
    'in-transit': { color: 'text-primary', bg: 'bg-primary/10', label: 'In Transit', icon: Truck },
    'pending': { color: 'text-tertiary', bg: 'bg-tertiary/10', label: 'Pending', icon: Clock },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32"
    >
      {/* Left Column: Shipment List */}
      <div className="lg:col-span-4 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-2">Live Tracking</h2>
          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Active Deliveries</p>
        </div>

        <div className="space-y-3">
          {shipments.map((shipment) => {
            const style = statusStyle[shipment.status];
            const isActive = selectedShipment?.id === shipment.id;
            return (
              <button
                key={shipment.id}
                onClick={() => setSelectedShipment(shipment)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left border relative overflow-hidden group",
                  isActive 
                    ? "bg-surface-container-high border-primary/30 shadow-lg" 
                    : "bg-surface-container-low border-outline-variant/10 hover:border-outline-variant/30"
                )}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", style.bg)}>
                  <style.icon size={20} className={style.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-bold truncate", isActive ? "text-primary" : "text-on-surface")}>
                    {shipment.name}
                  </p>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">
                    {shipment.id}
                  </p>
                </div>
                <ChevronRight size={16} className={cn("transition-transform", isActive ? "rotate-90 text-primary" : "text-on-surface-variant")} />
              </button>
            );
          })}
          {shipments.length === 0 && (
            <div className="p-12 text-center bg-surface-container-low border border-dashed border-outline-variant/20 rounded-2xl">
              <Truck className="mx-auto text-on-surface-variant/20 mb-4" size={32} />
              <p className="text-sm text-on-surface-variant">No active shipments found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Detailed View */}
      <div className="lg:col-span-8 space-y-6">
        <AnimatePresence mode="wait">
          {!selectedShipment ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-surface-container-low border border-outline-variant/10 rounded-[40px] p-12"
            >
              <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
                <Truck className="text-on-surface-variant/20" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Select a shipment</h3>
              <p className="text-on-surface-variant max-w-sm">Choose a shipment from the list to view its real-time location and status history.</p>
            </motion.div>
          ) : (
            <motion.div 
              key={selectedShipment.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Detailed view content here if shipments exist */}
              <div className="bg-surface-container-low rounded-[40px] border border-outline-variant/10 p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Current Status</p>
                    <h3 className="text-3xl font-bold mt-1">{statusStyle[selectedShipment.status].label}</h3>
                  </div>
                  <div className={cn("px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest", statusStyle[selectedShipment.status].bg, statusStyle[selectedShipment.status].color)}>
                    {selectedShipment.id}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface-container p-6 rounded-3xl space-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Location</p>
                      <p className="text-lg font-bold">{selectedShipment.location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Last Update</p>
                      <p className="text-sm font-medium">{selectedShipment.lastUpdate}</p>
                    </div>
                  </div>
                  <div className="bg-surface-container p-6 rounded-3xl space-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Courier</p>
                      <p className="text-lg font-bold">{selectedShipment.courier}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">ETA</p>
                      <p className="text-sm font-medium">{selectedShipment.eta}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Status History</p>
                  <div className="relative pl-10 space-y-8">
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-outline-variant/10" />
                    {(selectedShipment as any).history?.map((h: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className={cn(
                          "absolute -left-[31px] top-1 w-4 h-4 rounded-full ring-4 ring-surface-container-low",
                          idx === 0 ? "bg-primary shadow-[0_0_15px_rgba(79,70,229,0.4)]" : "bg-outline-variant"
                        )} />
                        <p className="text-xs font-bold uppercase">{h.status}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium mt-1">{h.location} • {h.timestamp}</p>
                      </div>
                    ))}
                    {(!(selectedShipment as any).history || (selectedShipment as any).history.length === 0) && (
                      <div className="relative italic text-xs text-on-surface-variant">
                         <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-outline-variant ring-4 ring-surface-container-low" />
                         Shipment initiated. Waiting for first scan.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
