export const GET_POSTS_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/rae/v1/posts`
export const GET_POST_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts`
export const GET_PAGES_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages`

/**
 * Cart
 * @type {string}
 */
export const CART_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/rae/v1/cart/items/`

// Countries and States
export const WOOCOMMERCE_COUNTRIES_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/rae/v1/wc/countries/`
export const WOOCOMMERCE_STATES_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/rae/v1/wc/states`
