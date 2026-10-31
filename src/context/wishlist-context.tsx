'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface WishlistContextType {
  savedIds: string[];
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (studioId: string, studioTitle?: string) => Promise<void>;
  loading: boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  savedIds: [],
  isInWishlist: () => false,
  toggleWishlist: async () => {},
  loading: false,
  refreshWishlist: async () => {},
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = async () => {
    if (!user) {
      setSavedIds([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/api/wishlist/ids');
      if (res.success && Array.isArray(res.savedStudioIds)) {
        setSavedIds(res.savedStudioIds);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const isInWishlist = (id: string) => savedIds.includes(id);

  const toggleWishlist = async (studioId: string, studioTitle: string = 'Studio') => {
    if (!user) {
      toast.error('Please log in to save spaces to your wishlist.');
      return;
    }

    const currentlySaved = isInWishlist(studioId);

    // Optimistic UI update
    if (currentlySaved) {
      setSavedIds(prev => prev.filter(id => id !== studioId));
    } else {
      setSavedIds(prev => [...prev, studioId]);
    }

    try {
      if (currentlySaved) {
        await api.delete(`/api/wishlist/${studioId}`);
        toast.info(`Removed ${studioTitle} from your wishlist.`);
      } else {
        await api.post('/api/wishlist', { studioId });
        toast.success(`Saved ${studioTitle} to your wishlist!`);
      }
    } catch (err: any) {
      // Revert if error
      refreshWishlist();
      toast.error(err.message || 'Failed to update wishlist.');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        savedIds,
        isInWishlist,
        toggleWishlist,
        loading,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
