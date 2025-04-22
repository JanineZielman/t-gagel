import Layout from '../../src/components/layout';
import { HEADER_FOOTER_ENDPOINT } from '../../src/utils/constants/endpoints';
import axios from 'axios';
import CartItemsContainer from '../../src/components/cart/cart-items-container';
import HomeButton from '../../src/components/Bits/HomeButton';

export default function Cart({ headerFooter }) {
	return (
		<div className='parent-184'>
			<Layout headerFooter={headerFooter || {}}>
				<HomeButton />
				<div className='flex'>
					<h1>Winkelwagen</h1>
				</div>
				<CartItemsContainer/>
			</Layout>
		</div>
	);
}

export async function getStaticProps() {
	
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
		},
		
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 1,
	};
}
