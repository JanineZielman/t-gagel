import React from "react"
import styles from "./OrderButton.module.scss"
import Link from "next/link"

const OrderButton = ({ link, text }) => {
  return (
    <div className={styles.orderButton}>
      <Link href={link} className={styles.text}>
        {text}
      </Link>
    </div>
  )
}

export default OrderButton
