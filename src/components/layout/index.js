/**
 * External Dependencies
 */

import Head from "next/head"

/**
 * Internal Dependencies.
 */
import { AppProvider } from "../context"
import Header from "./header"
import Footer from "./footer"
import Seo from "../seo"
import {
  replaceBackendWithFrontendUrl,
  sanitize,
} from "../../utils/miscellaneous"
import { useEffect } from "react"

import LanguageToggle from "../LanguageToggle"

function decodeHtmlEntities(text) {
  if (typeof window === "undefined") {
    // Return the text as-is during SSR
    return text
  }
  const textarea = document.createElement("textarea")
  textarea.innerHTML = text
  return textarea.value
}

const Layout = ({ children, headerFooter, seo, uri }) => {
  const { header, footer } = headerFooter || {}
  const yoastSchema = seo?.schema
    ? replaceBackendWithFrontendUrl(JSON.stringify(seo.schema))
    : null



  return (
    <AppProvider>
      <div>
        <Seo seo={seo || {}} uri={uri || ""} />
        <Head>
          <link rel="shortcut icon" href={header?.favicon ?? "/favicon.ico"} />
          {yoastSchema ? (
            <script
              type="application/ld+json"
              className="yoast-schema-graph"
              key="yoastSchema"
              dangerouslySetInnerHTML={{ __html: sanitize(yoastSchema) }}
            />
          ) : (
            <title>
              {decodeHtmlEntities(header?.siteTitle ?? "Nexts WooCommerce")}
            </title>
          )}
        </Head>
          
        <Header header={header} />
        <main className="container mx-auto py-4 min-h-50vh">{children}</main>
        <Footer footer={footer} />
      </div>
      <LanguageToggle/>
    </AppProvider>
  )
}

export default Layout
