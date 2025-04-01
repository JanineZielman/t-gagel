/**
 * External Dependencies.
 */
import axios from 'axios';
import { useState, useEffect } from 'react';

/**
 * Internal Dependencies.
 */
import Layout from '../src/components/layout';
import { HEADER_FOOTER_ENDPOINT } from '../src/utils/constants/endpoints';
import { getPosts } from '../src/utils/blog';
import ArchiveMenu from '../src/components/ArchiveMenu';
import { useRouter } from 'next/router';
import PostGrid from '../src/components/PostGrid';
import HomeButton from '../src/components/Bits/HomeButton';

/**
 * Blog Component.
 *
 * @param {Object} headerFooter Header Footer Data.
 * @param {Object} postsData Post Data.
 */
const Blog = ( { headerFooter, posts } ) => {
	const seo = {
		title: 'Archive Page',
		description: 'Archive Page',
		og_image: [],
		og_site_name: 'React WooCommerce Theme',
		robots: {
			index: 'index',
			follow: 'follow',
		},
	}

	console.log(posts)

	const router = useRouter()
  const { categories: queryCategories } = router.query // Get categories from URL


  const categories = [
    ...new Set(
      posts.map((item) => item.categories[0].name.toLowerCase())
    ),
  ]

  // Initialize selectedCategories from query or default to empty array
  const [selectedCategories, setSelectedCategories] = useState(
    queryCategories ? queryCategories.split(",") : []
  )

  useEffect(() => {
    if (queryCategories) {
      setSelectedCategories(queryCategories.split(","))
    }
  }, [queryCategories])

  const handleCategoryChange = (category) => {
    const url = new URL(window.location.href)
    let selected = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]

    setSelectedCategories(selected)

    if (selected.length > 0) {
      url.searchParams.set("categories", selected.join(","))
    } else {
      url.searchParams.delete("categories")
    }

    history.pushState(
      null,
      "",
      `/archive${selected.length > 0 ? `?${url.searchParams.toString()}` : ""}`
    )
  }

  console.log(posts)

  const filteredPosts = posts.filter((item) =>
    selectedCategories.length === 0
      ? true
      : selectedCategories.includes(
          item.categories[0].name.toLowerCase()
        )
  )
	
	return (
		<Layout headerFooter={ headerFooter || {} } seo={ seo }>
			<HomeButton/>
			<ArchiveMenu
				categories={categories}
				selectedCategories={selectedCategories}
				handleCategoryChange={handleCategoryChange}
			/>
			<div className="content-wrapper">
				{/* <h1>Levend Archief</h1> */}
				<PostGrid
					posts={filteredPosts}
					selectedCategories={selectedCategories}
				/>
			</div>
		</Layout>
	);
};

export default Blog;

export async function getStaticProps() {
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	const { data: postsData } = await getPosts();
	
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
			posts: postsData.posts_data.filter(post => post.categories[0].slug != 'actueel') || {},
		},
		
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 1,
	};
}
