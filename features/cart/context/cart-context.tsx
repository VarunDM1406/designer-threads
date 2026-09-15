"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CartItem } from "../types/cart";
import { validateCoupon } from "@/features/coupons/actions/validate-coupon";

type AppliedCoupon = {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  maximum_discount_amount: number | null;
  minimum_order_amount: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  discount: number;
  couponMessage: string;
  applyingCoupon: boolean;
  applyCoupon: (
    code: string,
    profileId?: string | null
  ) => Promise<{ success: boolean; discountAmount?: number }>;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

const STORAGE_KEY = "designer-threads-cart";
const COUPON_STORAGE_KEY = "designer-threads-cart-coupon";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [appliedCoupon, setAppliedCoupon] =
    useState<AppliedCoupon | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setItems(JSON.parse(saved) as CartItem[]);
      }

      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);

      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon) as AppliedCoupon);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
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

  useEffect(() => {
    if (!loaded) return;

    if (appliedCoupon) {
      localStorage.setItem(
        COUPON_STORAGE_KEY,
        JSON.stringify(appliedCoupon)
      );
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon, loaded]);

  function addItem(item: CartItem) {
    setItems((current) => {
      const existing = current.find(
        (existingItem) => existingItem.id === item.id
      );

      if (existing) {
        return current.map((existingItem) =>
          existingItem.id === item.id
            ? {
                ...existingItem,
                quantity:
                  existingItem.quantity + item.quantity,
              }
            : existingItem
        );
      }

      return [...current, item];
    });
  }

  function removeItem(id: string) {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function updateQuantity(
    id: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  }

  function clearCart() {
    setItems([]);
    setAppliedCoupon(null);
    setCouponMessage("");
  }

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + Number(item.price) * item.quantity,
        0
      ),
    [items]
  );

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (subtotal < appliedCoupon.minimum_order_amount) return 0;

    let amount =
      appliedCoupon.discount_type === "percentage"
        ? (subtotal * appliedCoupon.discount_value) / 100
        : appliedCoupon.discount_value;

    if (appliedCoupon.maximum_discount_amount !== null) {
      amount = Math.min(amount, appliedCoupon.maximum_discount_amount);
    }

    return Math.round(Math.max(0, Math.min(amount, subtotal)));
  }, [subtotal, appliedCoupon]);

  async function applyCoupon(
    code: string,
    profileId?: string | null
  ): Promise<{ success: boolean; discountAmount?: number }> {
    setApplyingCoupon(true);
    setCouponMessage("");

    try {
      const result = await validateCoupon(
        code,
        subtotal,
        profileId
      );

      if (!result.success) {
        setCouponMessage(result.message);
        return { success: false };
      }

      setAppliedCoupon({
        id: result.coupon.id,
        code: result.coupon.code,
        discount_type: result.coupon.discount_type,
        discount_value: Number(result.coupon.discount_value),
        maximum_discount_amount:
          result.coupon.maximum_discount_amount !== null
            ? Number(result.coupon.maximum_discount_amount)
            : null,
        minimum_order_amount: Number(
          result.coupon.minimum_order_amount
        ),
      });

      setCouponMessage(`"${result.coupon.code}" applied.`);

      return {
        success: true,
        discountAmount: result.discountAmount,
      };
    } finally {
      setApplyingCoupon(false);
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponMessage("");
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        appliedCoupon,
        discount,
        couponMessage,
        applyingCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}