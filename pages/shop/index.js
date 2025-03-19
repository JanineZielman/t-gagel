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

  const { data, loading, error } = useQuery(Component.query, {
    variables: Component.variables(),
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings || {}
  const primaryMenu = data?.headerMenuItems?.nodes ?? []
  const footerMenu = data?.footerMenuItems?.nodes ?? []
  const posts = data?.posts?.edges ?? []

  return (
    <>
      {/* <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <Container>
          <Products products={products} />
        </Container>
      </Main>
      <Footer
        title={siteTitle}
        menuItems={footerMenu}
        footer={data?.menu?.footer?.footer}
      /> */}
    </>
  )
}

// Add the GraphQL query
Component.query = gql`
  query GetShopPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    generalSettings {
      title
      description
    }
    headerMenuItems: menuItems(
      where: { location: $headerLocation }
      first: 50
    ) {
      nodes {
        id
        label
        path
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        id
        label
        path
      }
    }
  }
`

// Add the variables function
Component.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  }
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
