# Category Themes Usage Guide

## Overzicht

Het PostPreview component kan nu automatisch kleuren toepassen op basis van categorie thema's die in WordPress zijn ingesteld via ACF (Advanced Custom Fields).

## Hoe het werkt

### 1. WordPress Setup

In WordPress moet elk category een ACF veld `kleurthema` hebben met een van de volgende waarden:

- `groen` - Groene kleuren
- `aubergine` - Aubergine/paarse kleuren
- `orange` - Oranje/roze kleuren

Voorbeeld uit het API endpoint:

```json
{
  "id": 22,
  "name": "Interview",
  "slug": "interview",
  "acf": {
    "kleurthema": "groen"
  }
}
```

### 2. Categorieën ophalen

Gebruik de `getCategories()` functie om alle categorieën op te halen:

```javascript
import { getCategories } from "@/utils/blog"
import { createCategoryThemeMap } from "@/utils/themeMap"

// In getServerSideProps of getStaticProps
export async function getServerSideProps() {
  const categories = await getCategories()
  const categoryThemeMap = createCategoryThemeMap(categories)

  return {
    props: {
      categoryThemeMap,
    },
  }
}
```

### 3. Theme Map doorgeven aan PostPreview

Er zijn twee manieren om thema's toe te passen:

#### Optie A: Via categoryThemeMap prop (aanbevolen)

```javascript
import PostPreview from "@/components/PostPreview"

function MyComponent({ posts, categoryThemeMap }) {
  return (
    <div>
      {posts.map((post) => (
        <PostPreview
          key={post.id}
          post={post}
          categoryThemeMap={categoryThemeMap}
        />
      ))}
    </div>
  )
}
```

#### Optie B: Automatisch (als post.categories vol category object bevat)

Als je post object al de volledige category data bevat (inclusief ACF), dan werkt het automatisch:

```javascript
<PostPreview post={post} />
```

### 4. Voorbeeld implementatie in PostGrid

Update je PostGrid component:

```javascript
import styles from "./PostGrid.module.scss"
import PostPreview from "../PostPreview"

const PostGrid = ({ posts, selectedCategories, categoryThemeMap }) => {
  return (
    <div className={styles.postGrid}>
      {posts.length > 0 ? (
        posts.map((item, i) => (
          <PostPreview
            key={i}
            post={item}
            selectedCategories={selectedCategories}
            categoryThemeMap={categoryThemeMap}
          />
        ))
      ) : (
        <p>No posts to show, try adjusting your selection.</p>
      )}
    </div>
  )
}

export default PostGrid
```

### 5. Volledige voorbeeld in een page

```javascript
// pages/archive/index.js
import { getCategories } from "@/utils/blog"
import { createCategoryThemeMap } from "@/utils/themeMap"
import PostGrid from "@/components/PostGrid"

export default function ArchivePage({ posts, categoryThemeMap }) {
  return (
    <div>
      <PostGrid posts={posts} categoryThemeMap={categoryThemeMap} />
    </div>
  )
}

export async function getServerSideProps() {
  // Haal posts en categorieën op
  const postsResponse = await getPosts()
  const categories = await getCategories()

  // Maak een theme map
  const categoryThemeMap = createCategoryThemeMap(categories)

  return {
    props: {
      posts: postsResponse.data.posts || [],
      categoryThemeMap,
    },
  }
}
```

## Beschikbare Thema's

Gedefinieerd in `/src/utils/themeMap.js`:

### Groen

```javascript
{
  bg: "var(--green)",
  fg: "var(--light-green)",
  accent: "var(--light-green)"
}
```

### Aubergine

```javascript
{
  bg: "var(--ontvangen-brown)",
  fg: "var(--ontvangen-blue)",
  accent: "var(--ontvangen-blue)"
}
```

### Orange

```javascript
{
  bg: "var(--verbinden-orange)",
  fg: "var(--pink)",
  accent: "var(--pink)"
}
```

### Default (fallback)

Gebruikt oranje thema als er geen kleurthema is ingesteld.

## Utility Functies

### `getCategories()`

Haalt alle categorieën op van WordPress inclusief ACF data.

```javascript
import { getCategories } from "@/utils/blog"

const categories = await getCategories()
// Returns: Array van category objecten met ACF data
```

### `createCategoryThemeMap(categories)`

Maakt een map van category slug naar thema object.

```javascript
import { createCategoryThemeMap } from "@/utils/themeMap"

const themeMap = createCategoryThemeMap(categories)
// Returns: { "interview": { bg: "...", fg: "...", accent: "..." }, ... }
```

### `getCategoryTheme(category)`

Krijgt het thema voor een enkele categorie.

```javascript
import { getCategoryTheme } from "@/utils/themeMap"

const theme = getCategoryTheme(categoryObject)
// Returns: { bg: "...", fg: "...", accent: "..." }
```

## CSS Custom Properties

De volgende CSS custom properties worden per PostPreview ingesteld:

- `--category-bg`: Achtergrondkleur
- `--category-fg`: Tekstkleur
- `--category-accent`: Accentkleur (voor category label en image overlay)

Deze zijn toegankelijk in de SCSS:

```scss
.postPreview {
  background-color: var(--category-bg, var(--verbinden-orange));
  color: var(--category-fg, var(--pink));
}
```

## Troubleshooting

### Kleuren worden niet toegepast

1. Controleer of de categorie een `acf.kleurthema` waarde heeft
2. Controleer of `categoryThemeMap` wordt doorgegeven aan PostPreview
3. Controleer of de `kleurthema` waarde overeenkomt met een key in `CATEGORY_THEMES`

### API endpoint werkt niet

1. Controleer of `process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL` correct is ingesteld
2. Test het endpoint direct: `https://cms.gagel.nl/wp-json/wp/v2/categories`
3. Controleer of ACF plugin actief is in WordPress
