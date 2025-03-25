import React, { useContext, useState } from 'react';
import { AppContext } from '../context';
import CartItem from './cart-item';

import Link from 'next/link';
import { clearCart } from '../../utils/cart';
import { useRouter } from 'next/router';

const CartItemsContainer = () => {
	const [ cart, setCart ] = useContext( AppContext );
	const { cartItems, totalPrice, totalQty, totalTax } = cart || {};
	const [ isClearCartProcessing, setClearCartProcessing ] = useState( false );

    const router = useRouter();

		const handleProceedToCart = () => {
			if (!cartItems || cartItems.length === 0) return;
	
			// Base URL for the WooCommerce cart page
			let baseUrl = 'https://gagel.janinezielman.com/cart/?';
	
			// Construct the query parameter with product_id, quantity, and variation_id
			const queryParams = cartItems.map((item) => {
					const productId = item.product_id;
					const quantity = item.quantity || 1; // Default to 1 if quantity is not defined
					const variationId = item.variation_id ? `:${item.variation_id}` : ''; // Include variation if available
					return `${productId}:${quantity}${variationId}`;
			}).join(',');
	
			// Build the complete URL
			const url = `${baseUrl}add-to-cart=${queryParams}`;
	
			// Use router.push to navigate to the URL
			router.push(url);
	};
	

	
	// Clear the entire cart.
	const handleClearCart = async ( event ) => {
		event.stopPropagation();
		
		if (isClearCartProcessing) {
			return;
		}
		
		await clearCart( setCart, setClearCartProcessing );
	};



	return (
		<div className="content-wrap-cart">
			{ cart ? (
				<div className="woo-next-cart-table-row grid lg:grid-cols-3 gap-4">
					{/* Cart Items */ }
					<div className="woo-next-cart-table lg:col-span-2 mb-md-0 mb-5">
						{ cartItems.length &&
						cartItems.map( ( item ) => (
							<CartItem
								key={ item.product_id }
								item={ item }
								products={ cartItems }
								setCart={setCart}
							/>
						) ) }
					</div>
					
					{/* Cart Total */ }
					<div className="woo-next-cart-total-container lg:col-span-1 p-5 pt-0">
						<h2>Cart Total</h2>
						<div className="flex grid grid-cols-3 bg-gray-100 mb-4">
							<p className="col-span-2 p-2 mb-0">Total({totalQty})</p>
							<p className="col-span-1 p-2 mb-0">{cartItems?.[0]?.currency ?? ''}{ (totalPrice + totalTax).toFixed()}</p>
						</div>
						
						<div className="flex justify-between">
							{/* Clear entire cart */}
							<div className="clear-cart">
								<button
									className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-800"
									onClick={(event) => handleClearCart(event)}
									disabled={isClearCartProcessing}
								>
									<span className="woo-next-cart">{!isClearCartProcessing ? "Clear Cart" : "Clearing..."}</span>
								</button>
							</div>
							{/* Checkout */}
							<button onClick={handleProceedToCart} className="text-white duration-500 bg-black hover:bg-brand-royal-blue focus:ring-4 focus:text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900">
											<span className="woo-next-cart-checkout-txt">
												Proceed to Checkout
											</span>
								<i className="fas fa-long-arrow-alt-right"/>
							</button>
						</div>
					</div>
				</div>
			) : (
				<div className="mt-14">
					<h2>No items in the cart</h2>
					<Link href="/">
						<button className="text-white duration-500 bg-black hover:bg-brand-royal-blue font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900">
			              <span className="woo-next-cart-checkout-txt">
			                Add New Products
			              </span>
							<i className="fas fa-long-arrow-alt-right"/>
						</button>
					</Link>
				</div>
			) }
		</div>
	);
};

export default CartItemsContainer;
