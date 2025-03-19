import Link from "next/link"

const ExternalLink = ({ url, text }) => {
  if (!url || !text) {
    return null
  }

  return (
    <Link href={url}>
      <a target="_blank" className="">
        {text}
      </a>
    </Link>
  )
}

export default ExternalLink
