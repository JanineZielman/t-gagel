import { useState } from 'react';
import { isArray, isEmpty } from 'lodash';
import Product from './product';
import styles from "./products.module.scss";
import CallToActionButton from '../Bits/CallToActionButton';

const Products = ({ products, categories }) => {
	const [selectedCategory, setSelectedCategory] = useState(null);

	if (isEmpty(products) || !isArray(products)) {
		return null;
	}

	const filteredProducts = selectedCategory
		? products.filter(product =>
			product.categories?.some(cat => cat.id === selectedCategory)
		)
		: products;

	return (
		<>
			<div className='filter'>
				<CallToActionButton
					key="filterAll"
					onClick={() => setSelectedCategory(null)}
					isActive={!selectedCategory}
				>
					All
				</CallToActionButton>
				{categories.map((item, i) => (
					<CallToActionButton
						key={`filter${i}`}
						onClick={() => setSelectedCategory(item.id)}
						isActive={selectedCategory === item.id}
					>
						{item.name}
					</CallToActionButton>
				))}
			</div>

			<div className={styles.products}>
				{filteredProducts.length ? (
					filteredProducts.map(product => (
						<Product key={product?.id} product={product} styles={styles} />
					))
				) : (
					<p>No products found in this category.</p>
				)}
			</div>
		</>
	);
};

export default Products;
