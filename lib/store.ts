'use client';

import { create } from 'zustand';
import { CartItem, WishlistItem } from '@/types';

interface ToastState {
  visible: boolean;
  title: string;
  desc: string;
  price?: string;
}

interface AtelierStore {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: () => number;
  cartCount: () => number;

  // Wishlist
  wishlist: WishlistItem[];
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (sku: string) => void;
  moveWishlistToCart: (sku: string) => void;
  moveAllWishlistToCart: () => void;
  isInWishlist: (sku: string) => boolean;

  // Currency
  currency: 'BDT' | 'USD' | 'GBP' | 'AED' | 'EUR';
  setCurrency: (c: 'BDT' | 'USD' | 'GBP' | 'AED' | 'EUR') => void;

  // Toast
  toast: ToastState;
  showToast: (title: string, desc: string, price?: string) => void;
  hideToast: () => void;

  // Quick Sizing Guide Modal
  isSizeGuideOpen: boolean;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;
}

export const useAtelierStore = create<AtelierStore>((set, get) => ({
  // Cart Initial State
  cart: [
    {
      productId: 'default-prd-1',
      sku: 'PRD-101-40-MUSTARD',
      title: 'Nawab Tussar Silk Panjabi',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDEnQQ4L4jNhDhpiN7lnGHvJ59BP64v4tDnVVc2nJqJ7tbt4B81IjiMQ_WFUz1eaGn0b-gXIPXHF16EHVqQXFu82Q7bSiLL9vKP7fbNPXCyIflCUFF1zlci55SvTe-sBMvf5L8VRIkxnNN9xegd3Yd-mYnPomA3FeSnThVy9nuKT6ewqP0toycyAS-dak0IGpht8gObJEMUpBHch6z-h1ktHKmXN1tJFKikvPkTpnc',
      size: '40',
      color: 'Golden Mustard',
      price: 16800,
      quantity: 1,
      textileSpec: 'Rajshahi Raw Silk • 220 GSM',
    },
    {
      productId: 'default-prd-3',
      sku: 'PRD-103-40-LAPIS',
      title: 'Imperial Velvet Waskoti',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBkZn6a1dq1S0nBkU2A6uF5Jjbo9PVqZ8f0CFfps_CAuQi7dzhDNjOa49tkiS2TaHAuv7h8_If_CIAgG5apAhrdbZmsMCQNtdKvXhu8X_IMSv894D0xRdq6cozXVpFrXDNIJc9k808ShrRC2pdeJOfm1TiGsGvfXB4OZaZgyCOnLxC8lL1Ft-RtyOWGe4HdfnTSzVuJESQr1199HbrblFEOKV23f3pkddqg8L3AN0Y',
      size: '40',
      color: 'Deep Lapis Navy',
      price: 20000,
      quantity: 1,
      textileSpec: 'Micro Velvet & Mulberry Silk',
    },
  ],
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true, isWishlistOpen: false }),
  closeCart: () => set({ isCartOpen: false }),

  addToCart: (item) => {
    const { cart, showToast } = get();
    const existingIndex = cart.findIndex((i) => i.sku === item.sku && i.size === item.size);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += item.quantity;
      set({ cart: updated, isCartOpen: true });
    } else {
      set({ cart: [...cart, item], isCartOpen: true });
    }

    showToast(
      'Garment Added To Bag',
      `${item.title} (Size: ${item.size}) • Express Reserve`,
      `৳ ${(item.price * item.quantity).toLocaleString('en-US')}`
    );
  },

  removeFromCart: (sku) => {
    set((state) => ({ cart: state.cart.filter((i) => i.sku !== sku) }));
  },

  updateQuantity: (sku, delta) => {
    set((state) => {
      const updated = state.cart
        .map((item) => {
          if (item.sku === sku) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      return { cart: updated };
    });
  },

  clearCart: () => set({ cart: [] }),

  cartSubtotal: () => {
    return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  cartCount: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Wishlist Initial State
  wishlist: [
    {
      productId: 'default-prd-2',
      sku: 'PRD-102-40-NAVY',
      title: 'Imperial Raw Silk Sherwani',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBUaZI1Gxvpg47OY13E7EBIZI4Jh-L193R0U5mxFUk_6RigYy4tcIs1fIgKY4ULRu1IGUwY3a5zl-Za_fEvXlbDycztEVPacAKmcYv939EWhqKhHyRLuT2Wie8ONKAGuj3JkmoKOwspDPPY9haIFOO7Ae1Ve_3GNRIvZa_-_YHE7pllxPclvy9OquJqPWV6ItauobhXpRnQheJVaUI_OYfGl03VrM_MumGT-QQTwwo',
      price: 28500,
      size: '40',
      category: 'Sherwani',
      fabric: 'Silk Vault • 40',
    },
    {
      productId: 'default-prd-4',
      sku: 'PRD-104-42-SAND',
      title: 'Barendra Khadi Waskoti',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC5VrauJYWHzCPfOM1v-iKDiOSLJsqgMsbPFeQJQONTaKPFy119iKKs8fm7pm2lkVNdYfxV7tzmzJV-vkvGrkrmjpsUWtZT3R_1nenmAauJ06XBPpVlfjF52EtxHyzU72gpDloHBuhDrOlts9H2fxq6p2fUYC-VJ6p3kXlVHpzdzDzkzmcHFZZsG2YbI8CU1dsRMD5cQmWVULF5SmMfZterIZKAEwGTxgRD6HZj4T8',
      price: 12500,
      size: '42',
      category: 'Waskoti',
      fabric: 'Handspun • 42',
    },
    {
      productId: 'default-prd-5',
      sku: 'PRD-105-32-ALABASTER',
      title: 'Bengal Gurkha Trousers',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCqhVPoIHwQ5Dxy4iwPKESBZ8kMgOx6Yw5MEY3nGJXNONwAPfAcxK3mcaxBPGtDTufe38MKOaonPREhbETzio14oySve7l_5YUcJdnQeH48PT3iYi2ezoLwi6ZmTrCOhaaox9P5Ivuo33vXnqW2Bh4Ud_bnGOKbssLp8MUMjmPe48Uw0JDavWypXJvFOi2hJ1sFsBC4m2v_ZX1uVDcKxsblJUn3ulq8sWbKLzPwAro',
      price: 9200,
      size: '32',
      category: 'Trousers',
      fabric: 'High Rise • 32',
    },
  ],
  isWishlistOpen: false,
  openWishlist: () => set({ isWishlistOpen: true, isCartOpen: false }),
  closeWishlist: () => set({ isWishlistOpen: false }),

  toggleWishlist: (item) => {
    const { wishlist, showToast } = get();
    const exists = wishlist.some((i) => i.sku === item.sku);
    if (exists) {
      set({ wishlist: wishlist.filter((i) => i.sku !== item.sku) });
      showToast('Vault Piece Removed', `${item.title} removed from saved vault`);
    } else {
      set({ wishlist: [...wishlist, item] });
      showToast('Preserved In Vault', `${item.title} reserved in your personal wish vault`);
    }
  },

  removeFromWishlist: (sku) => {
    set((state) => ({ wishlist: state.wishlist.filter((i) => i.sku !== sku) }));
  },

  moveWishlistToCart: (sku) => {
    const { wishlist, addToCart, removeFromWishlist } = get();
    const target = wishlist.find((i) => i.sku === sku);
    if (target) {
      addToCart({
        productId: target.productId,
        sku: target.sku,
        title: target.title,
        image: target.image,
        price: target.price,
        size: target.size,
        quantity: 1,
      });
      removeFromWishlist(sku);
    }
  },

  moveAllWishlistToCart: () => {
    const { wishlist, addToCart } = get();
    wishlist.forEach((item) => {
      addToCart({
        productId: item.productId,
        sku: item.sku,
        title: item.title,
        image: item.image,
        price: item.price,
        size: item.size,
        quantity: 1,
      });
    });
    set({ wishlist: [], isCartOpen: true, isWishlistOpen: false });
  },

  isInWishlist: (sku) => {
    return get().wishlist.some((i) => i.sku === sku);
  },

  // Currency
  currency: 'BDT',
  setCurrency: (c) => set({ currency: c }),

  // Toast
  toast: {
    visible: false,
    title: '',
    desc: '',
    price: '',
  },
  showToast: (title, desc, price) => {
    set({ toast: { visible: true, title, desc, price } });
    setTimeout(() => {
      set((state) => ({ toast: { ...state.toast, visible: false } }));
    }, 4000);
  },
  hideToast: () => set((state) => ({ toast: { ...state.toast, visible: false } })),

  // Sizing Modal
  isSizeGuideOpen: false,
  openSizeGuide: () => set({ isSizeGuideOpen: true }),
  closeSizeGuide: () => set({ isSizeGuideOpen: false }),
}));
