/**
 * External Dependencies.
 */
import axios from "axios"
import { useState, useEffect } from "react"

/**
 * Internal Dependencies.
 */
import Layout from "../../src/components/layout"
import { HEADER_FOOTER_ENDPOINT } from "../../src/utils/constants/endpoints"
import { getPosts, getCategories } from "../../src/utils/blog"
import { createCategoryThemeMap } from "../../src/utils/themeMap"
import ArchiveMenu from "../../src/components/ArchiveMenu"
import { useRouter } from "next/router"
import PostGrid from "../../src/components/PostGrid"

/**
 * Blog Component.
 *
 * @param {Object} headerFooter Header Footer Data.
 * @param {Object} postsData Post Data.
 * @param {Object} categoryThemeMap Category theme mapping.
 */
const Blog = ({ headerFooter, posts, categoryThemeMap }) => {
  const seo = {
    title: "Archive Page",
    description: "Archive Page",
    og_image: [],
    og_site_name: "React WooCommerce Theme",
    robots: {
      index: "index",
      follow: "follow",
    },
  }

  const router = useRouter()
  const { categories: queryCategories, tags: queryTags } = router.query // Get categories and tags from URL

  // Extract unique categories and tags from posts
  const categories = [
    ...new Set(posts.map((item) => item.categories[0].name.toLowerCase())),
  ]

  const tags = [
    ...new Set(
      posts.flatMap(
        (item) => item.tags?.map((tag) => tag.name.toLowerCase()) || [],
      ),
    ),
  ]

  // Initialize selected filters from query or default to empty array
  const [selectedCategories, setSelectedCategories] = useState(
    queryCategories ? queryCategories.split(",") : [],
  )
  const [selectedTags, setSelectedTags] = useState(
    queryTags ? queryTags.split(",") : [],
  )

  useEffect(() => {
    if (queryCategories) setSelectedCategories(queryCategories.split(","))
    if (queryTags) setSelectedTags(queryTags.split(","))
  }, [queryCategories, queryTags])

  const updateURL = (selectedCategories, selectedTags) => {
    const url = new URL(window.location.href)

    if (selectedCategories.length > 0) {
      url.searchParams.set("categories", selectedCategories.join(","))
    } else {
      url.searchParams.delete("categories")
    }

    if (selectedTags.length > 0) {
      url.searchParams.set("tags", selectedTags.join(","))
    } else {
      url.searchParams.delete("tags")
    }

    history.pushState(
      null,
      "",
      `/archive${
        url.searchParams.toString() ? `?${url.searchParams.toString()}` : ""
      }`,
    )
  }

  // Handle category selection
  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]

    setSelectedCategories(updatedCategories)
    updateURL(updatedCategories, selectedTags)
  }

  // Handle tag selection
  const handleTagChange = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]

    setSelectedTags(updatedTags)
    updateURL(selectedCategories, updatedTags)
  }

  // Filter posts by selected categories and tags
  const filteredPosts = posts.filter((item) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.categories[0].name.toLowerCase())
    const matchesTag =
      selectedTags.length === 0 ||
      item.tags?.some((tag) => selectedTags.includes(tag.name.toLowerCase()))

    return matchesCategory && matchesTag
  })

  return (
    <div className="archive-wrapper">
      <Layout headerFooter={headerFooter || {}} seo={seo}>
        <ArchiveMenu
          categories={categories}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
          tags={tags}
          selectedTags={selectedTags}
          handleTagChange={handleTagChange}
        />
        <div className="content-wrapper">
          <PostGrid
            posts={filteredPosts}
            selectedCategories={selectedCategories}
            selectedTags={selectedTags}
            categoryThemeMap={categoryThemeMap}
          />
        </div>
      </Layout>
    </div>
  )
}

export default Blog

export async function getStaticProps() {
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT)
  const { data: postsData } = await getPosts()
  const categories = await getCategories()
  const categoryThemeMap = createCategoryThemeMap(categories)

  return {
    props: {
      headerFooter: headerFooterData?.data ?? {},
      posts:
        postsData.posts_data.filter(
          (post) => post.categories[0].slug != "actueel",
        ) || {},
      categoryThemeMap,
    },

    /**
     * Revalidate means that if a new request comes to server, then every 1 sec it will check
     * if the data is changed, if it is changed then it will update the
     * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
     */
    revalidate: 1,
  }
}
