/**
 * Internal Dependencies.
 */

// import { HEADER_FOOTER_ENDPOINT } from "../../../utils/constants/endpoints"
import { getProductsData, getProductBySlug } from "../../../utils/products"
import SingleProduct from "../../../components/Shop/single-product"

/**
 * External Dependencies.
 */
import { useRouter } from "next/router"

export default function Product({ headerFooter, product }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      <SingleProduct product={product} />
    </>
  )
}

export async function getStaticProps({ params }) {
  const { slug } = params || {}
  const { data: product } = await getProductBySlug(slug)

  return {
    props: {
      product: product.length ? product[0] : {},
    },
    revalidate: 1,
  }
}

export async function getStaticPaths() {
  const { data: products } = await getProductsData()

  // Expected Data Shape: [{ params: { slug: 'pendant' } }, { params: { slug: 'shirt' } }],
  const pathsData = []

  products.length &&
    products.map((product) => {
      if (product.slug) {
        pathsData.push({ params: { slug: product.slug ?? "" } })
      }
    })

  return {
    paths: pathsData,
    fallback: true,
  }
}
