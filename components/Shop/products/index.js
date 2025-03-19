import { isArray, isEmpty } from 'lodash';
import Product from './product';
import styles from "./products.module.scss"

const Products = ({ products }) => {
	
	if ( isEmpty( products ) || !isArray( products ) ) {
		return null;
	}
	
	return (
		<div className={styles.products}>
			
			{ products.length ? products.map( product => {
				return (
					<Product styles={styles} key={ product?.id } product={product} />
				)
			} ) : null }
		
		</div>
	)
}

export default Products;
