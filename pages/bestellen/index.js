import Products from "../../components/Shop/products"
import { getProductsData } from "../../utils/products"
import Link from "next/link"
import { useQuery, gql } from "@apollo/client"
import * as MENUS from "../../constants/menus"
import { BurgerIcon, Bag, SearchIcon } from '../../components/Shop/icons';
import { BlogInfoFragment } from "../../fragments/GeneralSettings"
import {
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  SEO,
} from "../../components"
import { useContext, useState } from 'react';
import { AppContext } from '../../components/Shop/context';

export default function Component({ headerFooter, products }) {
  const [ cart, setCart ] = useContext( AppContext );
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

  console.log('cart', cart)

  return (  
    <>
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <Container>
          <div>
          <Link href="/bestellen/cart">
              <span className="flex items-center">
              <Bag className="mr-1 lg:mr-0"/>
                <span
                  className="ml-1">Bag{ cart?.totalQty ? `(${ cart?.totalQty })` : null }</span>
              </span>
  
            </Link>
          </div>
          <h1>Bestellen</h1>
          <Products products={products} />
        </Container>
      </Main>
      <Footer
        title={siteTitle}
        menuItems={footerMenu}
        footer={data?.menu?.footer?.footer}
      />
    </>
  )
}

// Add the GraphQL query
Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetShopPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(
      where: { location: $headerLocation }
      first: 50
    ) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    menu(id: "footer", idType: LOCATION) {
      id
      footer {
        footer
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
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
