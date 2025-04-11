import { isArray, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import ContentWrapper from '../src/components/ContentWrapper/ContentWrapper';
import EntryHeader from '../src/components/EntryHeader';
import HomeButton from "../src/components/Bits/HomeButton"

import Layout from '../src/components/layout';
import { FALLBACK, handleRedirectsAndReturnData, isCustomPageUri } from '../src/utils/slug';
import { getFormattedDate, getPathNameFromUrl, sanitize } from '../src/utils/miscellaneous';
import { getPage, getPages } from '../src/utils/blog';
import axios from 'axios';
import { HEADER_FOOTER_ENDPOINT } from '../src/utils/constants/endpoints';
import ImageSlider from "../src/components/Bits/ImageSlider"
import { useEffect } from 'react';
import ContactForm from '../src/components/ContactForm';
import Tommy from '../src/components/Tommy';

const Page = ( { headerFooter, pageData } ) => {
	const router = useRouter();
	
	// If the page is not yet generated, this will be displayed
	// initially until getStaticProps() finishes running
	if ( router.isFallback ) {
		return <div>Loading...</div>;
	}

  useEffect(() => {
    console.log("Loading Tommy widget script")
    // Load Tommy widget script
    const script = document.createElement("script")
    script.src =
      "https://api.tommybookingsupport.com/widgets/zoekenboek/js/init.js"
    script.async = true

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [pageData.acf.tommy_booking])

	console.log(pageData)

	
	return (
		<div className={`parent-${pageData.parent} current-${pageData.id}`}>
			<Layout headerFooter={ headerFooter || {} } seo={ pageData?.yoast_head_json ?? {} }>
				<HomeButton />
				<EntryHeader title={pageData?.title?.rendered} />
				<ContentWrapper content={pageData.content.rendered} />
				{pageData.acf.image_slider?.length > 0 &&
					<ImageSlider images={pageData.acf.image_slider}/>
				}
				{pageData.acf.contact_form &&
					<ContactForm  backgroundColor="var(--brown)"
          textColor="var(--pink)"/>
				}
				{pageData.acf.tommy_booking &&
					<Tommy/>
				}
			</Layout>
		</div>
	);
};

export default Page;

export async function getStaticProps( { params } ) {
	
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	const pageData = await getPage( params?.slug.pop() ?? '' );
	
	const defaultProps = {
		props: {
			headerFooter: headerFooterData?.data ?? {},
			pageData: pageData?.[0] ?? {}
		},
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 1,
	};
	
	return handleRedirectsAndReturnData( defaultProps, pageData );
}

export async function getStaticPaths() {
	const pagesData = await getPages();
	
	const pathsData = [];
	
	isArray( pagesData ) && pagesData.map( page => {
		
		/**
		 * Extract pathname from url.
		 * e.g.
		 * getPathNameFromUrl( 'https://example.com/hello/hi/' ) will return '/hello/hi'
		 * getPathNameFromUrl( 'https://example.com' ) will return '/'
		 * @type {String}
		 */
		const pathName = getPathNameFromUrl( page?.link ?? '' );
		
		// Build paths data.
		if ( ! isEmpty( pathName ) && ! isCustomPageUri( pathName ) ) {
			const slugs = pathName?.split( '/' ).filter( pageSlug => pageSlug );
			pathsData.push( { params: { slug: slugs } } );
		}
	} );
	
	return {
		paths: pathsData,
		fallback: FALLBACK,
	};
}
