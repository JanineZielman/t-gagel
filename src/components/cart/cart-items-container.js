import React, { useContext, useState } from 'react';
import { AppContext } from '../context';
import CartItem from './cart-item';
import { clearCart } from '../../utils/cart';
import { useRouter } from 'next/router';
import styles from './cart.module.scss'
import CustomLine from "../CustomLine/CustomLine"
import CallToActionButton from '../Bits/CallToActionButton';

const CartItemsContainer = () => {
	const [ cart, setCart ] = useContext( AppContext );
	const { cartItems, totalPrice, totalQty, totalTax } = cart || {};
	const [ isClearCartProcessing, setClearCartProcessing ] = useState( false );


    const router = useRouter();

		const handleProceedToCart = () => {
			if (!cartItems || cartItems.length === 0) return;
	
			// Base URL for the WooCommerce cart page
			let baseUrl = 'https://cms.gagel.nl/cart/?';
	
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
		<div className={styles.cartWrapper}>
			{ cart ? (
				<div className={styles.cartContent}>
					{/* Cart Items */ }
					<div className={styles.cartItems}>
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
					<div className={styles.cartTotal}>
						<h2>Overzicht</h2>
						<div className={styles.cartPrice}>
							<p>Totaal({totalQty})</p>
							<p>{cartItems?.[0]?.currency ?? ''}{ (totalPrice).toFixed()}</p>
						</div>
						<CustomLine height={37} strokeColor="#DCFF90" strokeWidth={3} />
						<div className={styles.cartButtons}>
							{/* Clear entire cart */}

							<button
								className={styles.clearButton}
								onClick={(event) => handleClearCart(event)}
								disabled={isClearCartProcessing}
							>
								<span>{!isClearCartProcessing ? "wissen" : "wissen..."}</span>
							</button>
							{/* Checkout */}
							<button onClick={handleProceedToCart} className={styles.cartButton}>
											<span>
												betalen
											</span>
								<i className="fas fa-long-arrow-alt-right"/>
							</button>
						</div>
					</div>
				</div>
			) : (
				<div className={styles.leeg}>
					<h2>Uw winkelwagen is nog leeg</h2>
					<br/>
					<CallToActionButton link="/bestellen">
						terug
					</CallToActionButton>
				</div>
			) }
		</div>
	);
};

export default CartItemsContainer;
