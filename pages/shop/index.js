/**
 * Internal Dependencies.
 */
import Products from "../../components/Shop/products"

/**
 * External Dependencies.
 */
import { getProductsData } from "../../utils/products"

import { useQuery, gql } from "@apollo/client"
import * as MENUS from "../../constants/menus"
import {
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  Hero,
  SEO,
  PostGrid,
} from "../../components"

export default function Component({ headerFooter, products }) {
  const seo = {
    title: "Next JS WooCommerce REST API",
    description: "Next JS WooCommerce Theme",
    og_image: [],
    og_site_name: "React WooCommerce Theme",
    robots: {
      index: "index",
      follow: "follow",
    },
  }

  return (
    <>

      <Main>
        <Container>
          <Products products={products} />
        </Container>
      </Main>
     
    </>
  )
}

export async function getStaticProps() {
  // const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
  const { data: products } = await getProductsData()

  return {
    props: {
      // headerFooter: headerFooterData?.data ?? {},
      products: products ?? {},
    },

    /**
     * Revalidate means that if a new request comes to server, then every 1 sec it will check
     * if the data is changed, if it is changed then it will update the
     * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
     */
    revalidate: 1,
  }
}
