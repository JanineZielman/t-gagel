import { useEffect, useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import * as MENUS from "../../constants/menus"
import { BlogInfoFragment } from "../../fragments/GeneralSettings"
import {
  Header,
  Footer,
  Main,
  Container,
  SEO,
  NewsGrid,
} from "../../components"

export default function NewsPage(props) {
  const posts = [
    {
      node: {
        title: "Nieuw project gestart",
        slug: "nieuw-project-gestart",
        featuredImage: {
          node: { sourceUrl: "https://picsum.photos/id/1011/500/300" },
        },
        categories: { edges: [{ node: { name: "Actueel" } }] },
      },
    },
    {
      node: {
        title: "Vrijwilligers gezocht",
        slug: "vrijwilligers-gezocht",
        featuredImage: {
          node: { sourceUrl: "https://picsum.photos/id/1025/500/300" },
        },
        categories: { edges: [{ node: { name: "Actueel" } }] },
      },
    },
    {
      node: {
        title: "Nieuwe dieren op de boerderij",
        slug: "nieuwe-dieren-op-de-boerderij",
        featuredImage: {
          node: { sourceUrl: "https://picsum.photos/id/1043/500/300" },
        },
        categories: { edges: [{ node: { name: "Actueel" } }] },
      },
    },
  ]

  const siteTitle = "'t Gagel"
  const siteDescription = "Nieuws en updates van 't Gagel"
  const primaryMenu = []
  const footerMenu = []

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <Container>
          <NewsGrid posts={posts} />
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  )
}
