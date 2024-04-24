import { useReducer, useEffect } from 'react';

interface IProduct {
  id: number;
  img: string;
  name: string;
  price: number;
  descripcion: string;
  category: string[];
  sale: boolean | undefined;
  stock: boolean | undefined;
  quantity: number;
}

const initialState: Array<IProduct> = [];

type Action =
  | { type: 'addToCart'; payload: IProduct }
  | { type: 'removeFromCart'; payload: number }
  | { type: 'initialize'; payload: IProduct[] }
  | { type: 'load'; payload: IProduct[] };

const reducer = (state: Array<IProduct>, action: Action) => {
  switch (action.type) {
    case 'addToCart':
      const product = action.payload;
      const existingProductIndex = state.findIndex(pro => pro.id === product.id);
      if (existingProductIndex === -1) {
        // si el producto no está, añadelo
        return [...state, product];
      } else {
        // si el producto ya está en el carro, aumenta la cantidad
        return state.map((item, index) => {
          if (index !== existingProductIndex) {
            return item;
          }
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        });
      }

    case 'removeFromCart':
      const id = action.payload;
      return state.filter(item => item.id !== id);

    case 'initialize':
      return action.payload;

    case 'load':
      return action.payload;

    default:
      return state;
  }
};

export function useProductHandler() {
  const [products, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        {
          dispatch({ type: 'initialize', payload: JSON.parse(savedProducts) });
}}
}}, []);

useEffect(() => {
  {
    localStorage.setItem('products', JSON.stringify(products));
    console.log(products);
  }
}, [products]);

return { products, dispatch };
}
