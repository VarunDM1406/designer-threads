"use client";

import { useEffect } from "react";
import { autoConfirmOrder } from "../actions/auto-confirm-order";

type Props = {
  orderId: string;
  status: string;
};

export default function AutoConfirmOrder({
  orderId,
  status,
}: Props) {
  useEffect(() => {
    if (status !== "pending") {
      return;
    }

    const timer = setTimeout(async () => {
      await autoConfirmOrder(orderId);

      window.location.reload();
    }, 15000);

    return () => clearTimeout(timer);
  }, [orderId, status]);

  return null;
}