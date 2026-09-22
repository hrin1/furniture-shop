import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ProductListPage from '@/pages/ProductListPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import LookbookPage from "@/pages/LookBook";
import WishlistPage from "@/pages/WishlistPage";
import { useLenis } from "@/hooks/useLenis";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import RecentlyViewedWidget from "@/components/RecentlyViewedWidget";

function App() {

  useLenis();

  return (
    <WishlistProvider>
      <RecentlyViewedProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="/lookbook" element={<LookbookPage />} />
            </Route>
          </Routes>

          <RecentlyViewedWidget />
        </BrowserRouter>
      </RecentlyViewedProvider>
    </WishlistProvider>
  );
}

export default App;