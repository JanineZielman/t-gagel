import Link from "next/link"
import { useContext, useState, useEffect } from "react"
import { Bag } from "../../icons"
import { AppContext } from "../../context"
import styles from "./Header.module.scss"

const Header = ({ header }) => {
  const [cart, setCart] = useContext(AppContext)
  const { headerMenuItems, siteDescription, siteLogoUrl, siteTitle } =
    header || {}
  const [isNavShown, setIsNavShown] = useState(false)

  console.log(headerMenuItems)

  return (
    <>
      <header className={`${styles.header} ${isNavShown ? styles.show : ""}`}>
        <div
          className={styles.arrow}
          onClick={() => setIsNavShown(!isNavShown)}
        ></div>
        <div className={styles.menuItems}>
          {headerMenuItems.map((item, i) => {
            return (
              <div className={styles.menuItem} key={i}>
                <a href={`/${item.pageSlug}`}>
                  <>
                    <div
                      className={styles.imgMask}
                      style={{
                        // Only apply mask if not 'contact' page or other pages without SVG
                        maskImage: ["contact"].includes(item.pageSlug)
                          ? "none"
                          : `url(/${item.pageSlug}.svg)`,
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
