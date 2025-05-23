/**
 * Internal Dependencies.
 */
import { HEADER_FOOTER_ENDPOINT } from '../../src/utils/constants/endpoints';
import { getProductsData, getProductBySlug, getProductWithVariations } from '../../src/utils/products';
import Layout from '../../src/components/layout';
import SingleProduct from '../../src/components/single-product';
import HomeButton from '../../src/components/Bits/HomeButton';
import CallToActionButton from '../../src/components/Bits/CallToActionButton';

/**
 * External Dependencies.
 */
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Product( { headerFooter, product, variations } ) {
	
	const router = useRouter();
	
	// If the page is not yet generated, this will be displayed
	// initially until getStaticProps() finishes running
	if ( router.isFallback ) {
		return <div>Loading...</div>;
	}
	
	return (
		<div className='parent-184'>
			<Layout
				headerFooter={ headerFooter || {} }
				seo={ product?.yoast_head_json ?? {} }
				uri={ `/product/${ product?.slug ?? '' }` }
			>
				<HomeButton />
				<div className='flex'>
					<CallToActionButton
							link="/shop/cart"
						>
						bekijk winkelwagen
					</CallToActionButton>
				</div>

				<SingleProduct product={ product } variations={variations}/>
			</Layout>
		</div>
	);
}

export async function getStaticProps( { params } ) {
	
	const { slug } = params || {};
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	const { data: product } = await getProductBySlug( slug );
	const variations = await getProductWithVariations( slug );
	
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
			product: product.length ? product[ 0 ] : {},
			variations: variations ? variations : {},
		},
		revalidate: 1,
	};
}

export async function getStaticPaths() {
	const { data: products } = await getProductsData();
	
	// Expected Data Shape: [{ params: { slug: 'pendant' } }, { params: { slug: 'shirt' } }],
	const pathsData = [];
	
	products.length && products.map( ( product ) => {
		if ( product.slug ) {
			pathsData.push( { params: { slug: product.slug ?? '' } } );
		}
	} );
	
	return {
		paths: pathsData,
		fallback: true,
	};
}
