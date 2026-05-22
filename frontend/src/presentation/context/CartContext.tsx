'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Modelo } from '@/types';

export interface CartItem {
  modelo: Modelo;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  add: (modelo: Modelo) => void;
  remove: (modeloId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = useCallback((modelo: Modelo) => {
    setItems(prev => {
      const existing = prev.find(i => i.modelo.id === modelo.id);
      if (existing) {
        return prev.map(i =>
          i.modelo.id === modelo.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { modelo, quantity: 1 }];
    });
  }, []);

  const remove = useCallback((modeloId: string) => {
    setItems(prev => prev.filter(i => i.modelo.id !== modeloId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
