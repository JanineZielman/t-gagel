import Layout from '../../components/Shop/layout';
import axios from 'axios';
import CartItemsContainer from '../../components/Shop/cart/cart-items-container';

export default function Cart({ headerFooter }) {
	return (
		<Layout headerFooter={headerFooter || {}}>
			<h1 className="uppercase tracking-0.5px">Cart</h1>
			<CartItemsContainer/>
		</Layout>
	);
}
