const WooCommerceRestApi = require( '@woocommerce/woocommerce-rest-api' ).default;

const api = new WooCommerceRestApi( {
	url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
	consumerKey: process.env.WC_CONSUMER_KEY,
	consumerSecret: process.env.WC_CONSUMER_SECRET,
	version: 'wc/v3',
} );

/**
 * Get Products.
 *
 * @return {Promise<void>}
 */
export const getProductsData = async ( perPage = 50 ) => {
	return await api.get(
		'products',
		{
			per_page: perPage || 50,
		},
	);
};


export const getProductsCategories = async ( perPage = 50 ) => {
	return await api.get(
		'products/categories',
		{
			per_page: perPage || 50,
		},
	);
};

/**
 * Get Single Product By Slug.
 *
 * @return {Promise<void>}
 */
export const getProductBySlug = async ( productSlug = '' ) => {
	return await api.get(
		'products',
		{
			slug: productSlug,
		},
	);
};

export const getProductWithVariations = async (productSlug = '') => {
	try {
		// Fetch the product by slug
		const productResponse = await api.get('products', {
			slug: productSlug,
		});

		if (!productResponse || productResponse.data.length === 0) {
			throw new Error('Product not found');
		}

		// Assuming the response is an array of products
		const product = productResponse.data[0];

		// If no variations are associated, return the product as is
		if (!product.variations || product.variations.length === 0) {
			return product;
		}

		// Fetch details for each variation by ID
		const variationDetails = await Promise.all(
			product.variations.map(async (variationId) => {
				const variationResponse = await api.get(
					`products/${product.id}/variations/${variationId}`
				);

				// Check if the response contains data
				if (!variationResponse || !variationResponse.data) {
					throw new Error(`Variation not found: ${variationId}`);
				}

				return variationResponse.data; // Assuming the API returns the full details in `data`
			})
		);

		// Attach the full variation details to the product object
		const variations = variationDetails;


		return variations;
	} catch (error) {
		console.error('Error fetching product with variations:', error);
		throw error;
	}
};