/**
 * Internal Dependencies.
 */
import { useState } from 'react';
import AddToCart from '../cart/add-to-cart';
import ExternalLink from '../products/external-link';
import styles from "./product.module.scss"


const SingleProduct = ({ product, variations }) => {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);

  // Extract unique attributes and options from all variations
  const attributes = product?.attributes || [];

  const handleAttributeChange = (attributeName, option) => {
    const updatedAttributes = {
      ...selectedAttributes,
      [attributeName]: option,
    };

    setSelectedAttributes(updatedAttributes);

    // Try to find a variation that matches selected attributes
    const matchedVariation = variations.find((variation) =>
      variation.attributes.every(
        (attr) => updatedAttributes[attr.name] === attr.option
      )
    );

    setSelectedVariation(matchedVariation || null);
  };

  return Object.keys(product).length ? (
    <div className={styles.productPage}>
      <img src={product.images[0].src} />
      <h2>{product.name}</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: product.description,
        }}
      />

      {product?.type === 'variable' ? (
        <div className={styles.variable}>

          {/* Render one select for each attribute */}
          {attributes.map((attr) => (
            <div key={attr.name} className={styles.option}>
              <label>
                {attr.name}:
              </label>
              <select
                value={selectedAttributes[attr.name] || ''}
                onChange={(e) =>
                  handleAttributeChange(attr.name, e.target.value)
                }
              >
                <option value="">Select</option>
                {[
                  ...new Set(
                    variations
                      .map((variation) =>
                        variation.attributes.find((a) => a.name === attr.name)
                      )
                      .filter(Boolean)
                      .map((a) => a.option)
                  ),
                ].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Display matched variation price */}
          {selectedVariation ? (
            <div className={styles.price}>{`€${selectedVariation.price}`}</div>
          ) : (
            <div className="text-sm text-gray-500 mb-4">
              Select all options to see the price.
            </div>
          )}
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: product?.price_html ?? '',
          }}
          className={styles.price}
        />
      )}

      {/* Add to Cart Button */}
      {product?.type === 'simple' && product.stock_status !== 'outofstock' ? (
        <AddToCart product={product} />
      ) : product?.type === 'variable' ? (
        selectedVariation ? (
          <AddToCart product={product} variation={selectedVariation} />
        ) : null
      ) : null}

      {product.stock_status === 'outofstock' && <p>SOLD OUT</p>}

      {product?.type === 'external' ? (
        <ExternalLink
          url={product?.external_url ?? ''}
          text={product?.button_text ?? ''}
        />
      ) : null}
    </div>
  ) : null;
};


export default SingleProduct;
