import { isArray, isEmpty } from "lodash"
import { useRouter } from "next/router"
import ContentWrapper from "../src/components/ContentWrapper/ContentWrapper"
import EntryHeader from "../src/components/EntryHeader"
import HomeButton from "../src/components/Bits/HomeButton"
import CallToActionButton from "../src/components/Bits/CallToActionButton"

import Layout from "../src/components/layout"
import {
  FALLBACK,
  handleRedirectsAndReturnData,
  isCustomPageUri,
} from "../src/utils/slug"
import { getPathNameFromUrl } from "../src/utils/miscellaneous"
import { getPage, getPages, getChildPages } from "../src/utils/blog"
import axios from "axios"
import { HEADER_FOOTER_ENDPOINT } from "../src/utils/constants/endpoints"
import ImageSlider from "../src/components/Bits/ImageSlider"
import ContactForm from "../src/components/ContactForm"
import Tommy from "../src/components/Tommy"
import TommyBooking from "../src/components/TommyBooking"
import Sections from "../src/components/Sections"
import Newsletter from "../src/components/Newsletter"
import PageGrid from "../src/components/PageGrid"
import AccommodationGrid from "../src/components/AccommodationGrid"
import Facilities from "../src/components/Facilities"

const Page = ({ headerFooter, pageData, childPages }) => {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div className={`parent-${pageData.parent} current-${pageData.id}`}>
      <Layout
        headerFooter={headerFooter || {}}
        seo={pageData?.yoast_head_json ?? {}}
      >
        <HomeButton />
        <div className="flex">
          <EntryHeader title={pageData?.title?.rendered} />
          {pageData.acf.label && (
            <CallToActionButton link={pageData.acf.link}>
              {pageData.acf.label}
            </CallToActionButton>
          )}
        </div>
        {/* {(pageData.parent === 1501 || pageData.id === 1501) && (
          <Tommy suppressHydrationWarning />
        )} */}

        <ContentWrapper content={pageData.content.rendered} />
        {(pageData.parent === 1501 || pageData.id === 1501) &&
          childPages?.length > 0 && (
            <div className="child-pages-section">
              <AccommodationGrid pages={childPages} />
            </div>
          )}
        <div className="newsletter">
          {pageData.acf.newsletter && <Newsletter />}
        </div>

        {pageData.acf.sections?.length > 0 && (
          <Sections
            sections={pageData.acf.sections}
            facilities={pageData.parent === 1501 ? pageData.acf : undefined}
          />
        )}
        {pageData.acf.image_slider?.length > 0 && (
          <ImageSlider images={pageData.acf.image_slider} />
        )}
        {pageData.acf.new_booking && (
          <TommyBooking product={pageData.acf.data_accommodatie} />
        )}
        {pageData.acf.contact_form && (
          <ContactForm backgroundColor="var(--brown)" textColor="var(--pink)" />
        )}

        {/* {pageData.acf.new_booking && <TommyBooking product={pageData.acf.data_accommodatie} />} */}
      </Layout>
    </div>
  )
}

export default Page

export async function getStaticProps({ params }) {
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT)
  const pageData = await getPage(params?.slug.pop() ?? "")

  // Check if this is the overnachten page (ID 1501) or a child of it
  const isOvernachtenPage =
    pageData?.[0]?.parent === 1501 || pageData?.[0]?.id === 1501
  let childPages = []

  if (isOvernachtenPage && pageData?.[0]?.id === 1501) {
    // Only fetch child pages if we're on the main overnachten page
    childPages = await getChildPages(1501)
  }

  const defaultProps = {
    props: {
      headerFooter: headerFooterData?.data ?? {},
      pageData: pageData?.[0] ?? {},
      childPages: childPages ?? [],
    },
    /**
     * Revalidate means that if a new request comes to server, then every 1 sec it will check
     * if the data is changed, if it is changed then it will update the
     * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
     */
    revalidate: 1,
  }

  return handleRedirectsAndReturnData(defaultProps, pageData)
}

export async function getStaticPaths() {
  const pagesData = await getPages()

  const pathsData = []

  isArray(pagesData) &&
    pagesData.map((page) => {
      /**
       * Extract pathname from url.
       * e.g.
       * getPathNameFromUrl( 'https://example.com/hello/hi/' ) will return '/hello/hi'
       * getPathNameFromUrl( 'https://example.com' ) will return '/'
       * @type {String}
       */
      const pathName = getPathNameFromUrl(page?.link ?? "")

      // Build paths data.
      if (!isEmpty(pathName) && !isCustomPageUri(pathName)) {
        const slugs = pathName?.split("/").filter((pageSlug) => pageSlug)
        pathsData.push({ params: { slug: slugs } })
      }
    })

  return {
    paths: pathsData,
    fallback: FALLBACK,
  }
}
