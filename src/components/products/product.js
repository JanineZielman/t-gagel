import Link from 'next/link';
import Image from '../image';
import { sanitize } from '../../utils/miscellaneous';
import AddToCart from '../cart/add-to-cart';
import { isEmpty } from 'lodash';
import ExternalLink from './external-link';

const Product = ( { product, styles } ) => {
	
	if ( isEmpty( product ) ) {
		return null;
	}
	
	const img = product?.images?.[0] ?? {};
	const productType = product?.type ?? '';
	
	return (
		<div className={styles.shopItem}>
			<a href={`/product/${product?.slug}`}>
					<Image
						sourceUrl={img?.src ?? ""}
						altText={img?.alt ?? ""}
						title={product?.name ?? ""}
						width="380"
						height="380"
					/>
					<h3 className="">{product?.name ?? ""}</h3>
					<div
						className=""
						dangerouslySetInnerHTML={{
							__html: sanitize(product?.price_html ?? ""),
						}}
					/>
      </a>
			
			{ 'simple' === productType ? <AddToCart product={product}/> : null }
			
			{ 'variable' === productType ? <AddToCart product={product} /> : null }
			{
				'external' === productType ?
					<ExternalLink
						url={ product?.external_url ?? '' }
						text={ product?.button_text ?? '' }
					/> : null
			}
		</div>
	)
}

export default Product;
