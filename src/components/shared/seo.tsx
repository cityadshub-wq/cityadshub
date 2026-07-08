import { useEffect } from 'react'

interface SEOProps {
  title: string
  description?: string
  canonical?: string
}

export function SEO({ title, description, canonical }: SEOProps) {
  useEffect(() => {
    document.title = `${title} | City Ads Hub`
    const metaDesc = document.querySelector('meta[name="description"]')
    if (description) {
      if (metaDesc) metaDesc.setAttribute('content', description)
      else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = description
        document.head.appendChild(meta)
      }
    }
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]')
      if (link) link.setAttribute('href', canonical)
      else {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        link.setAttribute('href', canonical)
        document.head.appendChild(link)
      }
    }
  }, [title, description, canonical])

  return null
}
