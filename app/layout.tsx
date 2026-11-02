import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import WishlistDrawer from '@/components/cart/WishlistDrawer';
import Toast from '@/components/common/Toast';
import SizeGuideModal from '@/components/product/SizeGuideModal';

export const metadata: Metadata = {
  title: 'Oi Dulavai | Heritage Menswear Atelier (ঐ দুলাভাই)',
  description:
    'Architectural luxury menswear rooted in Bengali textile traditions. Curating fine Rajshahi Tussar silks, hand-spun muslin, bespoke zardozi sherwanis, and structural safari coats.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface font-body-md text-on-surface antialiased min-h-screen selection:bg-secondary selection:text-on-secondary flex flex-col justify-between">
        <Header />
        <main className="flex-1 w-full pt-20">{children}</main>
        <Footer />

        {/* Global Drawers & Overlays */}
        <CartDrawer />
        <WishlistDrawer />
        <Toast />
        <SizeGuideModal />
      </body>
    </html>
  );
}
