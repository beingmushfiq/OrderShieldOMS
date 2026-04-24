import { useState, useEffect } from 'react';
import api from '@/src/lib/api';
import { Order } from '@/src/types';
import { toast } from 'sonner';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // In a real app: const response = await api.get('/orders');
      // For now, we simulate the API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data that would come from Laravel
      const mockData: Order[] = [
        {
          id: 'ORD-88219',
          customer: 'Shihab Shoron',
          phone: '01711223344',
          amount: 1240,
          status: 'processing',
          fraudScore: 12,
          date: 'Oct 24, 2026',
          items: []
        }
      ];
      
      setOrders(mockData);
      setError(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to sync with secure order node';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
};
