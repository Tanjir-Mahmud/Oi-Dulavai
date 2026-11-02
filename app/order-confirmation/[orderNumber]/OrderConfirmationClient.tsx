'use client';

import { useEffect } from 'react';

export default function OrderConfirmationClient({ orderNumber }: { orderNumber: string }) {
  useEffect(() => {
    const printBtn = document.getElementById('btn-print-tax-invoice');
    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }
  }, [orderNumber]);

  return null;
}
