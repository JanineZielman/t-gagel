import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from "@apollo/client"
import * as MENUS from "../constants/menus"
import { BlogInfoFragment } from "../fragments/GeneralSettings"
import {
  ArchiveMenu,
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  SEO,
  PostGrid
} from "../components"
import { getNextStaticProps } from "@faustwp/core"

export default function Page(props) {
  const router = useRouter();
  const { categories: queryCategories } = router.query; // Get categories from URL
  const { data } = useQuery(Page.query, {
    variables: Page.variables(),
  });

  const title = props.title;
  const { title: siteTitle, description: siteDescription } = data?.generalSettings;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];
  const posts = props?.data.posts?.edges ?? [];

  const categories = [
    ...new Set(
      posts.map((item) => item.node.categories.edges[0].node.name.toLowerCase())
    ),
  ];

  // Initialize selectedCategories from query or default to empty array
  const [selectedCategories, setSelectedCategories] = useState(
    queryCategories ? queryCategories.split(',') : []
  );

  useEffect(() => {
    if (queryCategories) {
      setSelectedCategories(queryCategories.split(','));
    }
  }, [queryCategories]);

  const handleCategoryChange = (category) => {
    const url = new URL(window.location.href);
    let selected = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
  
    setSelectedCategories(selected);
  
    if (selected.length > 0) {
      url.searchParams.set('categories', selected.join(','));
    } else {
      url.searchParams.delete('categories');
    }
  
    history.pushState(null, '', `/archive${selected.length > 0 ? `?${url.searchParams.toString()}` : ''}`);
  };

  const filteredPosts = posts.filter((item) =>
    selectedCategories.length === 0
      ? true
      : selectedCategories.includes(item.node.categories.edges[0].node.name.toLowerCase())
  );

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header title={siteTitle} description={siteDescription} menuItems={primaryMenu} />
      <Main>
        <Container>
          <ArchiveMenu
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
          />
          <div className='content-wrapper'>
            <h1>Levend Archief</h1>
            <PostGrid posts={filteredPosts} selectedCategories={selectedCategories}/>
          </div>
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Page.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(
      where: { location: $headerLocation }
      first: 50
    ) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    posts {
      edges {
        node {
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
          author {
            node {
              name
            }
          }
          categories {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`

Page.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  }
}

export function getStaticProps(ctx) {
  return getNextStaticProps(ctx, {
    Page,
    props: { title: "File Page Example" },
  })
}
