/**
 * Internal Dependencies.
 */
import AddToCart from '../cart/add-to-cart';
import ExternalLink from '../products/external-link';
import styles from "./product.module.scss"

const SingleProduct = ( { product } ) => {
	return Object.keys( product ).length ? (
		<div className={styles.productPage}>
      <img src={product.images[0].src}/>
      <h2>{product.name}</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: product.description,
        }}
        className=""
      />
      <div
        dangerouslySetInnerHTML={{
          __html: product?.price_html ?? "",
        }}
        className=""
      />
      {"simple" === product?.type ? <AddToCart product={product} /> : null}
      {"external" === product?.type ? (
        <ExternalLink
          url={product?.external_url ?? ""}
          text={product?.button_text ?? ""}
        />
      ) : null}
    </div>
	) : null;
	
};

export default SingleProduct;
