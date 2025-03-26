import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { Bag } from '../../icons';
import { AppContext } from '../../context';
import styles from './Header.module.scss';

const Header = ({ header }) => {
  const [cart, setCart] = useContext(AppContext);
  const { headerMenuItems, siteDescription, siteLogoUrl, siteTitle } = header || {};
  const [isNavShown, setIsNavShown] = useState(false);
  const [menuImages, setMenuImages] = useState({}); // Store fetched images

	useEffect(() => {
		const fetchImages = async () => {
			const images = {};
			await Promise.all(
				headerMenuItems.map(async (item) => {
					// Fetch the page to get the featured media ID
					const res = await fetch(`https://gagel.janinezielman.com/wp-json/wp/v2/pages/${item.pageID}`);
					const data = await res.json();

					
					// Get the ID of the featured media
					const featuredMediaID = data.featured_media;
					
					// Now fetch the actual media using the featured_media ID
					if (featuredMediaID) {
						const mediaRes = await fetch(`https://gagel.janinezielman.com/wp-json/wp/v2/media/${featuredMediaID}`);
						const mediaData = await mediaRes.json();
						
						// Check if the media data contains the media item URL and store it
						if (mediaData?.source_url) {
							images[item.ID] = mediaData.source_url;
						}
					}
				})
			);
			setMenuImages(images);
		};
	
		fetchImages();
	}, [headerMenuItems]);	

  return (
    <>
      <header className={`${styles.header} ${isNavShown ? styles.show : ''}`}>
        <div className={styles.arrow} onClick={() => setIsNavShown(!isNavShown)}></div>
        <div className={styles.menuItems}>
          {headerMenuItems.map((item, i) => {
            return (
              <div className={styles.menuItem} key={i}>
                <a href={`/${item.pageSlug}`}>
                  <>
                    <div
                      className={styles.imgMask}
                      style={{
                        // maskImage: menuImages[item.ID] ? `url(${menuImages[item.ID]})` : 'none',
												maskImage:`url(/api/imageProxy?url=${encodeURIComponent(menuImages[item.ID])})`
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
            );
          })}
        </div>
      </header>

      <Link href="/cart">
        <a className="flex mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
          <span className="flex flex-row items-center lg:flex-col">
            <Bag className="mr-1 lg:mr-0" />
            <span className="ml-1">
              Bag{cart?.totalQty ? `(${cart?.totalQty})` : null}
            </span>
          </span>
        </a>
      </Link>
    </>
  );
};

export default Header;
