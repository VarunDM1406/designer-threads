"use client";

import { useEffect, useState } from "react";

import { getSettings } from "../actions/get-settings";

export function useShippingConfig() {
  const [shippingCharge, setShippingCharge] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getSettings().then((settings) => {
      if (cancelled) return;

      setShippingCharge(settings.shipping_charge);
      setFreeShippingThreshold(settings.free_shipping_above);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { shippingCharge, freeShippingThreshold };
}
