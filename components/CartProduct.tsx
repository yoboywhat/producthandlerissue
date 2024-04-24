import { useAppDispatch } from "@/Redux/hooks";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { removeFromCart } from "@/Redux/features/cartSlice";
import React from "react";
import { useProductHandler } from "@/hooks/productHandler";

interface propsType {
    id: number,
    img: string,
    name: string,
    price: string,
    quantity: number,
}

const CartProduct: React.FC<propsType> = ({
    id,
    img,
    name,
    price,
    quantity,
}) => {
    const { dispatch } = useProductHandler();

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Image className="h-[80px]" src={img} alt={name} width={150} height={10}/>
                <div className="space-y-2">
                    <h3 className="font-medium">{name}</h3>
                    <p className="text-gray-600 text-[14px]">
                        {quantity} x ${price}
                    </p>
                </div>
            </div>

            <RxCross1
            className="cursor-pointer"
            onClick={() => dispatch({ type: 'removeFromCart', payload: id })}></RxCross1>

        </div>
    )
}

export default CartProduct;
