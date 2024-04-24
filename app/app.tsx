"use client";
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import NavigationBar from '@/components/NavigationBar';
import TopPager from '@/components/TopPager';
import React, { useState } from 'react'
import { ProductProvider } from '@/hooks/productHandler';

const App = ({children}: {children: React.ReactNode}) => {

  const [showCart, setShowCart] = useState(false); 
  return (
    <ProductProvider>
        <TopPager setShowCart={setShowCart} />
        {showCart && <Cart setShowCart={setShowCart} />}
        {children}
    </ProductProvider>
  )
}

export default App
