import React from "react"
import styles from "./OrderButton.module.scss"
import Link from "next/link"

const OrderButton = ({ children, link }) => {
  return (
    <div className={styles.orderButton}>
      <Link href={link} className={styles.text}>
        {children}
      </Link>
    </div>
  )
}

export default OrderButton
