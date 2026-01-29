import { isEmpty } from "lodash"
import { useRouter } from "next/router"
import axios from "axios"
import styles from "./archive.module.scss"

import Layout from "../../src/components/layout"
import { FALLBACK, handleRedirectsAndReturnData } from "../../src/utils/slug"
import { sanitize } from "../../src/utils/miscellaneous"
import { HEADER_FOOTER_ENDPOINT } from "../../src/utils/constants/endpoints"
import {
  getPost,
  getPosts,
  getRelated,
  getCategories,
} from "../../src/utils/blog"
import { createCategoryThemeMap } from "../../src/utils/themeMap"
import ArchiveButton from "../../src/components/Bits/ArchiveButton"
import HomeButton from "../../src/components/Bits/HomeButton"
import ImageSlider from "../../src/components/Bits/ImageSlider"
import PostPreview from "../../src/components/PostPreview"
import Sections from "../../src/components/Sections"

const Post = ({
  headerFooter,
  postData,
  categories,
  relatedData,
  categoryThemeMap,
}) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // Get theme for current post category
  const currentCategory = categories[0]
  const theme = categoryThemeMap?.[currentCategory?.slug] || null

  return (
    <div
      className={`post ${categories[0].slug}`}
      style={
        theme
          ? {
              backgroundColor: theme.bg,
              color: theme.fg,
            }
          : {}
      }
    >
      <Layout
        headerFooter={headerFooter || {}}
        seo={postData?.yoast_head_json ?? {}}
      >
        <HomeButton />

        <div
          className="post-wrapper"
          style={
            theme
              ? {
                  backgroundColor: theme.bg,
                  color: theme.fg,
                }
              : {}
          }
        >
          <h1
            dangerouslySetInnerHTML={{
              __html: sanitize(postData?.title?.rendered ?? ""),
            }}
          />
          <h2>{postData?._embedded?.author?.[0]?.name}</h2>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: postData?.content?.rendered }}
          ></div>
        </div>
        <br />
        {postData.acf.image_slider?.length > 0 && (
          <ImageSlider images={postData.acf.image_slider} />
        )}
        {postData.acf.sections?.length > 0 && (
          <Sections sections={postData.acf.sections} />
        )}

        {/* Related Posts Section */}
        <div
          className={`${styles.relatedPosts} related`}
          style={
            theme
              ? {
                  backgroundColor: theme.fg,
                  color: theme.bg,
                }
              : {}
          }
        >
          <h2>Wil je meer horen of lezen?</h2>
          <div className={styles.relatedPostsGrid}>
            {relatedData.related_posts.map((item, i) => {
              return (
                <PostPreview
                  key={i}
                  post={item}
                  current={categories[0].slug}
                  categoryThemeMap={categoryThemeMap}
                />
              )
            })}
          </div>
        </div>
        <ArchiveButton />
      </Layout>
    </div>
  )
}

export default Post

export async function getStaticProps({ params }) {
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT)
  const postData = await getPost(params.slug ?? "")
  const relatedData = await getRelated(params?.slug ?? "")

  // Fetch categories based on the category IDs in postData.categories
  const categoryIds = postData?.[0]?.categories ?? []
  const categoriesRes = await axios.get(
    `https://cms.gagel.nl/wp-json/wp/v2/categories?include[]=${categoryIds.join(
      ",",
    )}`,
  )
  const categories = categoriesRes.data || []

  // Fetch all categories for theme mapping
  const allCategories = await getCategories()
  const categoryThemeMap = createCategoryThemeMap(allCategories)

  const defaultProps = {
    props: {
      headerFooter: headerFooterData?.data ?? {},
      postData: postData?.[0] ?? {},
      categories: categories, // Pass categories data as a prop
      relatedData: relatedData.post_data,
      categoryThemeMap,
    },
    revalidate: 1,
  }

  return handleRedirectsAndReturnData(defaultProps, postData)
}

export async function getStaticPaths() {
  const { data: postsData } = await getPosts()

  const pathsData = []

  postsData?.posts_data.length &&
    postsData?.posts_data.map((post) => {
      if (!isEmpty(post?.slug)) {
        pathsData.push({ params: { slug: post?.slug } })
      }
    })

  return {
    paths: pathsData,
    fallback: FALLBACK,
  }
}
