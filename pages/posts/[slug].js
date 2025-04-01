import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import axios from 'axios';

import Layout from '../../src/components/layout';
import { FALLBACK, handleRedirectsAndReturnData } from '../../src/utils/slug';
import { getFormattedDate, sanitize } from '../../src/utils/miscellaneous';
import { HEADER_FOOTER_ENDPOINT } from '../../src/utils/constants/endpoints';
import { getPost, getPosts } from '../../src/utils/blog';
import ArchiveButton from '../../src/components/Bits/ArchiveButton';
import HomeButton from '../../src/components/Bits/HomeButton';

const Post = ( { headerFooter, postData, categories } ) => {
	const router = useRouter();

	if ( router.isFallback ) {
		return <div>Loading...</div>;
	}

	return (
		<Layout headerFooter={ headerFooter || {} } seo={ postData?.yoast_head_json ?? {} }>
			<HomeButton />
			<div className={`post ${categories[0].slug}`}>
				<div className="post-wrapper">
					<h1 dangerouslySetInnerHTML={{ __html: sanitize( postData?.title?.rendered ?? '' ) }} />
					<h2>{postData?._embedded?.author?.[0]?.name}</h2>
					<div className="content" dangerouslySetInnerHTML={{ __html: postData?.content?.rendered }}></div>
				</div>
				<ArchiveButton />
			</div>
		</Layout>
	);
};

export default Post;

export async function getStaticProps( { params } ) {
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	const postData = await getPost( params?.slug ?? '' );

	// Fetch categories based on the category IDs in postData.categories
	const categoryIds = postData?.[0]?.categories ?? [];
	const categoriesRes = await axios.get(`https://gagel.janinezielman.com/wp-json/wp/v2/categories?include[]=${categoryIds.join(',')}`);
	const categories = categoriesRes.data || [];

	const defaultProps = {
		props: {
			headerFooter: headerFooterData?.data ?? {},
			postData: postData?.[0] ?? {},
			categories: categories,  // Pass categories data as a prop
		},
		revalidate: 1,
	};

	return handleRedirectsAndReturnData( defaultProps, postData );
}


export async function getStaticPaths() {
	const { data: postsData } = await getPosts();

	const pathsData = [];

	postsData?.posts_data.length && postsData?.posts_data.map( post => {
		if ( ! isEmpty( post?.slug ) ) {
			pathsData.push( { params: { slug: post?.slug } } );
		}
	} );

	return {
		paths: pathsData,
		fallback: FALLBACK,
	};
}
