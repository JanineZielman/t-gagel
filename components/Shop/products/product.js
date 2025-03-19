import Link from "next/link"
import Image from "../image"
import { sanitize } from "../../../utils/miscellaneous"
import AddToCart from "../cart/add-to-cart"
import { isEmpty } from "lodash"
import ExternalLink from "./external-link"

const Product = ({ product }) => {
  if (isEmpty(product)) {
    return null
  }

  const img = product?.images?.[0] ?? {}
  const productType = product?.type ?? ""

  return (
    <div className="">
      <Link href={`/shop/product/${product?.slug}`}>
        <Image
          sourceUrl={img?.src ?? ""}
          altText={img?.alt ?? ""}
          title={product?.name ?? ""}
          width="380"
          height="380"
        />
        <h6 className="">{product?.name ?? ""}</h6>
        <div
          className=""
          dangerouslySetInnerHTML={{
            __html: sanitize(product?.price_html ?? ""),
          }}
        />
      </Link>

      {"simple" === productType ? <AddToCart product={product} /> : null}
      {"external" === productType ? (
        <ExternalLink
          url={product?.external_url ?? ""}
          text={product?.button_text ?? ""}
        />
      ) : null}
    </div>
  )
}

export default Product
