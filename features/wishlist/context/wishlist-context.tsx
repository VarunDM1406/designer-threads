"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { WishlistItem } from "../types/wishlist";

type WishlistContextType = {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "addedAt">) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: Omit<WishlistItem, "addedAt">) => void;
  isInWishlist: (id: string) => boolean;
  itemCount: number;
};

const WishlistContext = createContext<
  WishlistContextType | undefined
>(undefined);

const STORAGE_KEY = "designer-threads-wishlist";

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setItems(JSON.parse(saved) as WishlistItem[]);
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );
  }, [items, loaded]);

  function addItem(item: Omit<WishlistItem, "addedAt">) {
    setItems((current) => {
      if (current.some((existing) => existing.id === item.id)) {
        return current;
      }

      return [
        ...current,
        { ...item, addedAt: new Date().toISOString() },
      ];
    });
  }

  function removeItem(id: string) {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function isInWishlist(id: string) {
    return items.some((item) => item.id === id);
  }

  function toggleItem(item: Omit<WishlistItem, "addedAt">) {
    if (isInWishlist(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  }

  const itemCount = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        itemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}
