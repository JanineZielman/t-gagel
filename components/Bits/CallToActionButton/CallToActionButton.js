import React from "react"
import styles from "./CallToActionButton.module.scss"
import Link from "next/link"

const CallToActionButton = ({ children, link }) => {
  return (
    <Link href={link} className={styles.callToActionButton}>
      <svg
        width="415"
        height="119"
        viewBox="0 0 415 119"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
      >
        <path
          d="M2.70824 56.3372C2.92434 50.9571 2.96608 45.5556 3.43554 40.193C3.66255 37.5947 4.71089 35.0511 5.38341 32.4851C5.6104 31.6324 6.24469 30.6728 5.97634 29.9377C5.22001 27.8286 6.90887 27.0056 8.4044 25.9792C12.4674 23.1946 16.4881 20.372 20.5928 17.6397C21.4928 17.0457 22.6318 16.6062 23.7549 16.3471C31.5639 14.5241 39.6293 15.0436 47.6046 15.1901C58.7229 15.3905 69.8322 16.0322 80.9469 16.3193C88.7974 16.5188 96.665 16.2915 104.514 16.5199C117.614 16.9084 130.7 17.6224 143.792 17.9744C150.155 18.143 156.524 17.7108 162.894 17.6842C175.845 17.6322 188.796 17.5585 201.739 17.6945C212.16 17.8088 222.497 17.3839 232.834 16.3215C245.792 14.9878 258.806 13.8156 271.844 13.108C283.539 12.4696 295.309 12.573 307.05 12.3203C317.467 12.0941 327.605 14.0151 337.798 15.4385C338.922 15.5923 340.034 15.8252 341.161 15.9067C347.303 16.3273 350.395 19.8339 353.418 23.7506C356.591 27.8471 357.73 32.2241 358.04 36.93C358.562 44.8891 359.293 52.8495 359.99 60.8012C360.374 65.2058 359.084 69.3911 358.02 73.6289C356.392 80.14 353.711 86.2685 349.549 91.9318C349.086 92.5579 348.778 93.2625 348.4 93.9282C345.953 98.3567 341.347 99.1785 335.968 99.4042C326.578 99.802 317.235 100.767 307.851 101.223C298.678 101.673 289.473 101.832 280.274 102.034C268.744 102.288 257.206 102.506 245.662 102.643C226.905 102.868 208.147 102.896 189.403 103.223C174.621 103.484 159.854 104.057 145.083 104.506C132.565 104.887 120.057 105.276 107.539 105.685C97.4331 106.011 87.3292 106.511 77.2134 106.655C70.4286 106.752 63.6131 106.521 56.8204 106.162C45.228 105.551 33.6428 104.76 22.058 103.961C20.7824 103.874 19.452 103.408 18.2997 102.869C16.0032 101.806 13.8656 100.496 11.5782 99.4265C5.97988 96.8115 3.64503 92.5603 3.15154 87.6153C2.58213 81.943 2.39058 76.2424 2.17221 70.5552C1.98605 65.8108 1.9929 61.0598 1.912 56.3124C2.1744 56.323 2.42806 56.3332 2.69046 56.3437L2.70824 56.3372Z"
          fill="#447E58"
        />
      </svg>
      <div className={styles.text}>{children}</div>
    </Link>
  )
}

export default CallToActionButton
