/**
 * Internal Dependencies.
 */
import Products from '../../components/Shop/products';

/**
 * External Dependencies.
 */
import axios from 'axios';
import { getProductsData } from '../../utils/products';
import Layout from '../../components/Shop/layout';

export default function Home({ headerFooter, products }) {
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
		// <Layout headerFooter={ headerFooter || {} } seo={ seo }>
			<Products products={products}/>
		// </Layout>
	)
}

export async function getStaticProps() {
	
	// const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	const { data: products } = await getProductsData();
	
	return {
		props: {
			// headerFooter: headerFooterData?.data ?? {},
			products: products ?? {}
		},
		
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 1,
	};
}
