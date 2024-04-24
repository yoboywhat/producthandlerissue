"use client";
import { useAppSelector } from "@/Redux/hooks";
import { RxCross1 } from "react-icons/rx";
import CartProduct from "./CartProduct";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/Redux/hooks";
import { removeFromCart } from "@/Redux/features/cartSlice";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

import { useProductHandler, useProductContext } from "@/hooks/productHandler";

interface cartProps {
    setShowCart: (show: boolean) => void;
}

interface Product {
    id: number;
    img: string;
    name: string;
    price: number;
    quantity: number;
}

const PaypalCheckout: React.FC<{ products: Product[]}> = ({products}) => {
    // ...
}

const Cart: React.FC<cartProps> = ({setShowCart}) => {
    
    const { dispatch } = useProductHandler();
    const { products } = useProductContext();

    console.log(products)

    const [showPaypal, setShowPaypal] = useState(true);

    //save cookie
    // const expiryDate = new Date(Date.now() + 6 * 60 * 60 * 1000);
    // document.cookie = `proData=${JSON.stringify(products)}; expires=` + expiryDate.toUTCString() + `; path=/`;

    const router = useRouter();

    useEffect(() => {
        setShowPaypal(products.length > 0); // Show PayPal buttons if there are products
    }, [products]);

    useEffect(() => {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        const product = parsedProducts.map(({ id, img, name, price, quantity }: Product) => ({
          id,
          img,
          name,
          price,
          quantity,
        }));
        dispatch({ type: 'load', payload: product });
      }
    }, [dispatch]);
  
    // Save the state to local storage whenever it changes
    useEffect(() => {{
      localStorage.setItem('products', JSON.stringify(products));
    }}, [products]);

    const getTotal = () => {
        let total = 0;
        products.forEach((item: { price: number; quantity: number; }) => (total = total + item.price * item.quantity));
        return total;
    };
    const itemTotal = getTotal()
    const shippingFee = itemTotal > 399 ? 0 : 160

    return (
  <div className="bg-[#0000007d] w-full min-h-screen fixed left-0 top-0 cart-container">
    <div className="min-w-0 max-w-full min-h-full bg-white absolute right-0 top-0 p-6">
      <RxCross1
        className="absolute right-0 top-0 m-6 text-[24px] cursor-pointer"
        onClick={() => setShowCart(false)}
      />
      <h3 className="pt-6 text-lg font-medium text-gray-600 uppercase">
      Carrito 
      </h3>

      <div className="mt-6 space-y-2">
        {products?.map((item: Product) => (
          <CartProduct
            key={item.id}
            id={item.id}
            img={item.img}
            name={item.name}
            price={String(item.price)}
            quantity={item.quantity}
          />
        ))}
      </div>

      <div className="flex justify-between items-center font-medium text-x1 py-4">
        <p>Total:</p>
        <p>${getTotal()} + ${shippingFee} (Shipping)</p>
      </div>

      {showPaypal && <PaypalCheckout products={products}/>}
      {!showPaypal && <p>Cart is lonelier than you</p>}
      
    </div>
  </div>
);


}

export default Cart;
