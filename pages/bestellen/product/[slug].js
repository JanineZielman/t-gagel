import { getProductsData, getProductBySlug } from "../../../utils/products"
import SingleProduct from "../../../components/Shop/single-product"
import { useQuery, gql } from "@apollo/client"
import * as MENUS from "../../../constants/menus"
import { BlogInfoFragment } from "../../../fragments/GeneralSettings"
import {
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  SEO,
} from "../../../components"

import { useRouter } from "next/router"

export default function Product({ headerFooter, product }) {
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

  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const { data, loading, error } = useQuery(Product.query, {
    variables: Product.variables(),
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings || {}
  const primaryMenu = data?.headerMenuItems?.nodes ?? []
  const footerMenu = data?.footerMenuItems?.nodes ?? []

  return (
    <>
    <Header
      title={siteTitle}
      description={siteDescription}
      menuItems={primaryMenu}
    />
    <Main>
      <Container>
        <SingleProduct product={product} />
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
Product.query = gql`
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
Product.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  }
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
