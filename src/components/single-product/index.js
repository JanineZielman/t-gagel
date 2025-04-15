/**
 * Internal Dependencies.
 */
import { useState } from 'react';
import AddToCart from '../cart/add-to-cart';
import ExternalLink from '../products/external-link';
import styles from "./product.module.scss"


const SingleProduct = ( { product, variations } ) => {
  const [selectedVariation, setSelectedVariation] = useState(null);
  	// Function to handle variation selection
	const handleVariationChange = (variation) => {
		setSelectedVariation(variation);
	};

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
      {/* <div
        dangerouslySetInnerHTML={{
          __html: product?.price_html ?? "",
        }}
        className=""
      /> */}
      	{'variable' === product?.type ? (
						<div className='variable'>
							{/* Render variation options */}
							<label htmlFor="variation-select" className="block mb-2">
								Choose an option:
							</label>
							<select
								id="variation-select"
								onChange={(e) =>
									handleVariationChange(variations.find((v) => v.id === parseInt(e.target.value)))
								}
								className="mb-4 p-2 border rounded"
							>
								<option value="">Select</option>
								{variations.map((variation) => (
									<option 
										key={variation.id} 
										value={variation.id} 
										disabled={variation.stock_status === 'outofstock'}
									>
										{variation.attributes[0]?.option} - 
										{variation.stock_status === 'outofstock' ? 'Sold Out' : `€${variation.price}`}
									</option>
								))}
							</select>

							{/* Display the selected variation price */}
							{selectedVariation ? (
								<div>{`€${selectedVariation.price}`}</div>
							) : (
								<div className="text-sm text-gray-500 mb-4">Select an option to see the price.</div>
							)}
						</div>
					) : (
						// Display simple product price
						<div
              dangerouslySetInnerHTML={{
                __html: product?.price_html ?? "",
              }}
							className="product-price mb-5"
						/>
					)}
      		{/* Add to Cart Button */}
					{product?.type === 'simple' && product.stock_status != 'outofstock' ? (
						<AddToCart product={product} />
					) : product?.type === 'variable' ? (
						selectedVariation ? (
							<AddToCart product={product} variation={selectedVariation} />
						) : (
						null
						)
					) : null}

					{product.stock_status == 'outofstock' &&
						<p>SOLD OUT</p>
					}
      
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
