/**
 * Internal Dependencies.
 */
import Products from '../../src/components/products';
import { HEADER_FOOTER_ENDPOINT } from '../../src/utils/constants/endpoints';

/**
 * External Dependencies.
 */
import axios from 'axios';
import { getProductsData, getProductsCategories } from '../../src/utils/products';
import Layout from '../../src/components/layout';
import HomeButton from '../../src/components/Bits/HomeButton';
import CallToActionButton from '../../src/components/Bits/CallToActionButton';

export default function Home({ headerFooter, products, categories }) {
	const seo = {
		title: 'Next JS WooCommerce REST API',
		description: 'Next JS WooCommerce Theme',
		og_image: [],
		og_site_name: 'React WooCommerce Theme',
		robots: {
			index: 'index',
			follow: 'follow',
		},
	}

	return (
		<div className='parent-184 bestellen'>
			<Layout headerFooter={ headerFooter || {} } seo={ seo }>
				<HomeButton />
				<div className='flex'>
					<h1>Shop</h1>
					<CallToActionButton
						link="/shop/cart"
					>
						bekijk winkelwagen
					</CallToActionButton>
				</div>
				<Products products={products} categories={categories}/>
			</Layout>
		</div>
	)
}

export async function getStaticProps() {
	
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	const { data: products } = await getProductsData();
	const { data: categories } = await getProductsCategories();
	
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
			products: products ?? {},
			categories: categories.filter(cat => cat.slug !== 'uncategorized') ?? {}
		},
		
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 1,
	};
}
