import { isEmpty } from 'lodash';
import { addToCart } from '../../utils/cart';
import { useContext, useState } from 'react';
import { AppContext } from '../context';
import Link from 'next/link';
import styles from './cart.module.scss'

const AddToCart = ({ product, variation = null }) => {
	const [cart, setCart] = useContext(AppContext);
	const [isAddedToCart, setIsAddedToCart] = useState(false);
	const [loading, setLoading] = useState(false);


	// If the product is empty, return null
	if (isEmpty(product)) {
		return null;
	}

	// Handle Add to Cart Click
	const handleAddToCart = () => {
		const productId = variation ? variation.id : product.id;
		addToCart(productId, 1, setCart, setIsAddedToCart, setLoading);
	};

	return (
		<>
			<button
				className={styles.cartButton}
				onClick={handleAddToCart}
				disabled={loading || (product.type === 'variable' && !variation)}
			>
				{loading
					? 'Adding...'
					: product.type === 'variable' && !variation
					? 'Select an option'
					: 'Add to cart'}
			</button>
			{isAddedToCart && !loading ? (
				<Link href="/bestellen/cart">
						View cart
				</Link>
			) : null}
		</>
	);
};

export default AddToCart;
