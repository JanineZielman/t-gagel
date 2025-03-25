import { isEmpty } from 'lodash';
import { addToCart } from '../../../utils/cart';
import { useContext, useState } from 'react';
import { AppContext } from '../context';
import Link from 'next/link';
import cx from 'classnames';

const AddToCart = ({ product, variation = null }) => {
	const [cart, setCart] = useContext(AppContext);
	const [isAddedToCart, setIsAddedToCart] = useState(false);
	const [loading, setLoading] = useState(false);

	// Add to Cart Button Classes
	const addToCartBtnClasses = cx(
		'duration-500 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded',
		{
			'bg-white hover:bg-gray-100': !loading,
			'bg-gray-200': loading,
		},
	);

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
				className={addToCartBtnClasses}
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
