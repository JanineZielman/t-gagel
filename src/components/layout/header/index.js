import Link from "next/link"
import { useContext, useState, useEffect } from "react"
import { Bag } from "../../icons"
import { AppContext } from "../../context"
import styles from "./Header.module.scss"
import { useRouter } from "next/router"


const Header = ({ header }) => {
  const router = useRouter();
  const [cart, setCart] = useContext(AppContext)
  const { headerMenuItems, siteDescription, siteLogoUrl, siteTitle } =
    header || {}
  const [isNavShown, setIsNavShown] = useState(false)
  const [activeItem, setActiveItem] = useState(null)
  const [showSubmenu, setShowSubmenu] = useState(false)

  const handleMenuItemClick = (item, e) => {
    if (window.innerWidth <= 768) {
      if (!showSubmenu) {
        e.preventDefault()
        setActiveItem(item)
        setShowSubmenu(true)
      }
      // When already in submenu view, let the click go through to navigate
    }
  }

  const handleBackClick = () => {
    setActiveItem(null)
    setShowSubmenu(false)
  }

  console.log(router.asPath.includes('archive'))

  return (
    <>
      <header className={`${styles.header} ${isNavShown ? styles.show : ""} ${router.asPath.includes('archive') && styles.isArchive}`}>
        <div
          className={styles.arrow}
          onClick={() => setIsNavShown(!isNavShown)}
        ></div>
         <Link href="/bestellen/cart"><a className="cart-amount"> {cart?.totalQty ? `(${cart?.totalQty})` : null}</a></Link>
        <div className={`${styles.menuItems} ${showSubmenu ? styles.showSubmenu : ''}`}>
          <div className={`${styles.backButton} ${showSubmenu ? styles.visible : ''}`} onClick={handleBackClick}>
            ← Terug
          </div>
          {headerMenuItems.map((item, i) => {
            return (
              <div className={`${styles.menuItem} ${activeItem === item ? styles.active : ''}`} key={i}>
                <a className={styles.icon} href={`/${item.pageSlug}`} onClick={(e) => handleMenuItemClick(item, e)}>
                  <>
                    <div
                      className={styles.imgMask}
                      style={{
                        // Only apply mask if not 'contact' page or other pages without SVG
                        maskImage: `url(/${item.pageSlug}.svg)`,
                      }}
                    ></div>
                    <div className={styles.label}>{item.title}</div>
                  </>
                </a>
                <div className={styles.children}>
                  {item.children.map((child, j) => (
                    <div className={styles.child} key={j}>
                      <Link href={`/${child.pageSlug}`}>
                        <div className={styles.label}>{child.title}</div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </header>

      {/* <Link href="/cart">
        <a className="flex mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
          <span className="flex flex-row items-center lg:flex-col">
            <Bag className="mr-1 lg:mr-0" />
            <span className="ml-1">
              Bag{cart?.totalQty ? `(${cart?.totalQty})` : null}
            </span>
          </span>
        </a>
      </Link> */}
    </>
  )
}

export default Header
