import { gql, useQuery } from "@apollo/client"
import * as MENUS from "../constants/menus"
import { BlogInfoFragment } from "../fragments/GeneralSettings"
import {
  ArchiveMenu,
  Header,
  Hero,
  Footer,
  Main,
  Container,
  NavigationMenu,
  SEO,
} from "../components"
import { CallToActionButton } from "../components/Bits/CallToActionButton"
import { OrderButton } from "../components/Bits/OrderButton"
import { getNextStaticProps } from "@faustwp/core"

export default function Page(props) {
  const title = props.title

  return (
    <>
      <Main>
        <Container>
          {/* <ArchiveMenu /> */}
          dit is een pagina waar ik componenten ttest
          <CallToActionButton link="example.com">
            Koop een groente pakket!
          </CallToActionButton>
          <OrderButton link="/bestel">Bestel</OrderButton>
          <OrderButton link="/bestel">Buy</OrderButton>
        </Container>
      </Main>
      {/* <Footer title="siteTitle" menuItems="footerMenu" /> */}
    </>
  )
}
