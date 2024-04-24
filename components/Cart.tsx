"use client";
import { RxCross1 } from "react-icons/rx";
import CartProduct from "./CartProduct";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useProductHandler } from "@/hooks/productHandler";

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
  const router = useRouter();

  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (data && data?.orderCreate && data?.orderCreate.links) {

      console.log(data?.orderCreate.links)

      const payerActionLink = data?.orderCreate.links.find((link: { rel: string; }) => link.rel === 'payer-action')
      if (payerActionLink) {
        window.location.href = payerActionLink.href;
      }
    }
  }, [data])

  const createOrders = async () => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    });

    if (!response.ok) {
      // Handle error
      console.error('Failed to create order');
      return;
    }

    const data = await response.json();
    setData(data); // set the data to state
    console.log('Order created:', data);
  };

  return (
    <Button
      variant="outline"
      onClick={createOrders}
    >
      Show Toast
    </Button> 
  )
}

const Cart: React.FC<cartProps> = ({setShowCart}) => {
    
    const { products, dispatch } = useProductHandler();

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
        const products = parsedProducts.map(({ id, img, name, price, quantity }: Product) => ({
          id,
          img,
          name,
          price,
          quantity,
        }));
        dispatch({ type: 'load', payload: products });
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
    console.log(products);

    const itemTotal = getTotal()
    const shippingFee = itemTotal > 399 ? 0 : 160

    console.log(products)

    return (
  <div className="bg-[#0000007d] w-full min-h-screen fixed left-0 top-0 cart-container">
    <div className="min-w-0 max-w-full min-h-full bg-white absolute right-0 top-0 p-6">
      <RxCross1
        className="absolute right-0 top-0 m-6 text-[24px] cursor-pointer"
        onClick={() => setShowCart(false)}
      />
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
    </div>
  </div>
);


}

export default Cart;
