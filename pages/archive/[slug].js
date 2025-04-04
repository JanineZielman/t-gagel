import { isEmpty } from "lodash"
import { useRouter } from "next/router"
import axios from "axios"
import styles from "./archive.module.scss"

import Layout from "../../src/components/layout"
import { FALLBACK, handleRedirectsAndReturnData } from "../../src/utils/slug"
import { getFormattedDate, sanitize } from "../../src/utils/miscellaneous"
import { HEADER_FOOTER_ENDPOINT } from "../../src/utils/constants/endpoints"
import { getPost, getPosts } from "../../src/utils/blog"
import ArchiveButton from "../../src/components/Bits/ArchiveButton"
import HomeButton from "../../src/components/Bits/HomeButton"
import ImageSlider from "../../src/components/Bits/ImageSlider"
import PostPreview from "../../src/components/PostPreview"

const Post = ({ headerFooter, postData, categories }) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const post = {
    id: 1690,
    title: "Betula",
    excerpt:
      "Berk (Betula) is een geslacht van bomen uit de berkenfamilie (Betulaceae). De bomen van dit geslacht komen verspreid voor over het noordelijk halfrond: ze zijn uiterst winterhard. Enkele soorten zijn op Groenland en IJsland de enige bomen die er van nature voorkomen. Doordat berken ondiep wortelen zijn ze slecht bestand tegen droogte. Kenmerkend voor enkele berkensoorten is het in horizontale banden afbladderen van de bast op de stam. De nieuwe bast is soms wit, maar [&hellip;]",
    date: "april 1, 2025",
    slug: "betula",
    permalink: "https://gagel.janinezielman.com/archive/betula/",
    attach_id: 1245,
    attachment_image: {
      img_sizes: "(max-width: 300px) 100vw, 300px",
      img_src: [
        "https://gagel.janinezielman.com/wp-content/uploads/2025/01/DSC8822recepten-winter-spice-first-t-Gagel-@GHengeveld-scaled.jpg",
        2560,
        1703,
        false,
      ],
      img_srcset:
        "https://gagel.janinezielman.com/wp-content/uploads/2025/01/DSC8822recepten-winter-spice-first-t-Gagel-@GHengeveld-300x200.jpg 300w, https://gagel.janinezielman.com/wp-content/uploads/2025/01/DSC8822recepten-winter-spice-first-t-Gagel-@GHengeveld-scaled-600x399.jpg 600w, https://gagel.janinezielman.com/wp-content/uploads/2025/01/DSC8822recepten-winter-spice-first-t-Gagel-@GHengeveld-1024x681.jpg 1024w, https://gagel.janinezielman.com/wp-content/uploads/2025/01/DSC8822recepten-winter-spice-first-t-Gagel-@GHengeveld-768x511.jpg 768w, https://gagel.janinezielman.com/wp-content/uploads/2025/01/DSC8822recepten-winter-spice-first-t-Gagel-@GHengeveld-1536x1022.jpg 1536w, https://gagel.janinezielman.com/wp-content/uploads/2025/01/DSC8822recepten-winter-spice-first-t-Gagel-@GHengeveld-2048x1363.jpg 2048w",
    },
    categories: [
      {
        term_id: 3,
        name: "Artikelen",
        slug: "artikelen",
        term_group: 0,
        term_taxonomy_id: 3,
        taxonomy: "category",
        description: "",
        parent: 0,
        count: 2,
        filter: "raw",
        cat_ID: 3,
        category_count: 2,
        category_description: "",
        cat_name: "Artikelen",
        category_nicename: "artikelen",
        category_parent: 0,
      },
    ],
    tags: [
      {
        id: 51,
        name: "kwekerij",
        slug: "kwekerij",
        link: "https://gagel.janinezielman.com/archive/tag/kwekerij/",
      },
    ],
    meta: {
      author_id: "1",
      author_name: "admin",
      author_url:
        "https://gagel.janinezielman.com/archive/author/janinezielman/",
    },
  }

  return (
    <Layout
      headerFooter={headerFooter || {}}
      seo={postData?.yoast_head_json ?? {}}
    >
      <HomeButton />
      <div className={`post ${categories[0].slug}`}>
        <div className="post-wrapper">
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

        {/* Related Posts Section */}
        <div className={`${styles.relatedPosts} related`}>
          <h2>Related Posts</h2>
          <div className={styles.relatedPostsGrid}>
            <PostPreview post={post} />
            <PostPreview post={post} />
            <PostPreview post={post} />
          </div>
        </div>
        <ArchiveButton />
      </div>
    </Layout>
  )
}

export default Post

export async function getStaticProps({ params }) {
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT)
  const postData = await getPost(params?.slug ?? "")

  // Fetch categories based on the category IDs in postData.categories
  const categoryIds = postData?.[0]?.categories ?? []
  const categoriesRes = await axios.get(
    `https://gagel.janinezielman.com/wp-json/wp/v2/categories?include[]=${categoryIds.join(
      ","
    )}`
  )
  const categories = categoriesRes.data || []

  const defaultProps = {
    props: {
      headerFooter: headerFooterData?.data ?? {},
      postData: postData?.[0] ?? {},
      categories: categories, // Pass categories data as a prop
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
