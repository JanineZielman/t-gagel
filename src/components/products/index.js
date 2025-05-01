import { useEffect, useState } from 'react';
import { isArray, isEmpty } from 'lodash';
import Product from './product';
import styles from "./products.module.scss";
import CallToActionButton from '../Bits/CallToActionButton';

const Products = ({ products, categories }) => {
	const [selectedCategory, setSelectedCategory] = useState(null);

	// On mount, read category slug from URL
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const categoryFromURL = params.get('category');
			setSelectedCategory(categoryFromURL);
		}
	}, []);

	// Update the URL when selectedCategory changes
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location);
			if (selectedCategory) {
				url.searchParams.set('category', selectedCategory);
			} else {
				url.searchParams.delete('category');
			}
			window.history.replaceState({}, '', url);
		}
	}, [selectedCategory]);

	if (isEmpty(products) || !isArray(products)) {
		return null;
	}

	const filteredProducts = selectedCategory
		? products.filter(product =>
			product.categories?.some(cat => String(cat.slug) === String(selectedCategory))
		)
		: products;

	const handleFilterClick = (slug) => {
		setSelectedCategory(slug);
	};

	return (
		<>
			<div className='filter'>
				<CallToActionButton
					key="filterAll"
					onClick={() => handleFilterClick(null)}
					isActive={!selectedCategory}
				>
					All
				</CallToActionButton>

				{categories.map((item, i) => (
					<CallToActionButton
						key={`filter${i}`}
						onClick={() => handleFilterClick(item.slug)}
						isActive={selectedCategory === item.slug}
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
