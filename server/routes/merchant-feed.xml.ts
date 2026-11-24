// Google Merchant Center product feed (free listings in Google Shopping).
// Add it in Merchant Center as a scheduled fetch of https://www.emwear.bg/merchant-feed.xml
import { toPlainText } from '../../utils/seo'

interface FeedProduct {
  _id: string
  slug: string
  name: string
  description?: string
  price: number
  compareAt?: number | null
  stock?: number
  gender?: 'boy' | 'girl' | 'unisex'
  customEmbroidery?: boolean
  sizes?: string[]
  colors?: { name: string }[]
  images?: { url: string }[]
  category?: { slug: string; displayName?: string; googleProductCategory?: string | null } | string
}

const SITE = 'https://www.emwear.bg'

// Used when the category has no googleProductCategory set in the dashboard
const fallbackCategory: Record<string, string> = {
  'kids-bags': 'Luggage & Bags > Backpacks',
  'kid-bathrobes': 'Apparel & Accessories > Clothing > Sleepwear & Loungewear > Robes',
  'kids-towels': 'Home & Garden > Linens & Bedding > Towels',
  'personalizirani-kurpi-za-lice': 'Home & Garden > Linens & Bedding > Towels',
  'kids-blankets': 'Home & Garden > Linens & Bedding > Bedding > Blankets',
  'keychains': 'Apparel & Accessories > Handbag & Wallet Accessories > Keychains',
  'personalizirani-koledni-ornamenti': 'Home & Garden > Decor > Seasonal & Holiday Decorations > Holiday Ornaments',
  'personalizirani-plusheni-igrachki': 'Toys & Games > Toys > Dolls, Playsets & Toy Figures > Stuffed Animals',
  'personalizirani-gergefi': 'Home & Garden > Decor > Artwork',
}
const kidsCategories = new Set(['kids-bags', 'kid-bathrobes', 'kids-towels', 'kids-blankets'])

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
/** 1200px JPG from Cloudinary (originals are ~800 KB PNGs). */
const image = (url: string) => url.replace('/image/upload/', '/image/upload/f_jpg,q_auto,w_1200/')

export default defineEventHandler(async (event) => {
  const apiBase = useRuntimeConfig().public.apiBase || 'https://api.emwear.bg'
  const res = await $fetch<{ data: FeedProduct[] }>(`${apiBase}/api/products?limit=1000`).catch(() => null)
  // Never publish an empty feed: Merchant Center would drop every product
  if (!res?.data?.length) throw createError({ statusCode: 503, statusMessage: 'Products unavailable' })

  const items = res.data.filter(p => p.slug && p.images?.length && p.price > 0).map((p) => {
    const cat = typeof p.category === 'object' ? p.category : undefined
    const gpc = cat?.googleProductCategory || (cat ? fallbackCategory[cat.slug] : undefined)
    const imgs = p.images!.map(i => image(i.url))
    const sale = p.compareAt && p.compareAt > p.price
    const desc = toPlainText(p.description) || p.name
    const lines = [
      `<g:id>${xml(p._id)}</g:id>`,
      `<g:title>${xml(p.name.slice(0, 150))}</g:title>`,
      `<g:description>${xml(desc.slice(0, 4900))}</g:description>`,
      `<g:link>${SITE}/products/${xml(p.slug)}</g:link>`,
      `<g:image_link>${xml(imgs[0]!)}</g:image_link>`,
      ...imgs.slice(1, 10).map(i => `<g:additional_image_link>${xml(i)}</g:additional_image_link>`),
      `<g:availability>${(p.stock ?? 0) > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>`,
      sale ? `<g:price>${p.compareAt!.toFixed(2)} EUR</g:price>` : `<g:price>${p.price.toFixed(2)} EUR</g:price>`,
      sale ? `<g:sale_price>${p.price.toFixed(2)} EUR</g:sale_price>` : '',
      '<g:brand>emWear</g:brand>',
      '<g:condition>new</g:condition>',
      '<g:identifier_exists>no</g:identifier_exists>',
      gpc ? `<g:google_product_category>${xml(gpc)}</g:google_product_category>` : '',
      cat?.displayName ? `<g:product_type>${xml(cat.displayName)}</g:product_type>` : '',
      cat && kidsCategories.has(cat.slug) ? '<g:age_group>kids</g:age_group>' : '',
      p.gender ? `<g:gender>${p.gender === 'boy' ? 'male' : p.gender === 'girl' ? 'female' : 'unisex'}</g:gender>` : '',
      p.colors?.length ? `<g:color>${xml(p.colors.slice(0, 3).map(c => c.name).join('/'))}</g:color>` : '',
      p.sizes?.length === 1 ? `<g:size>${xml(p.sizes[0]!)}</g:size>` : '',
      p.customEmbroidery ? '<g:custom_label_0>personalised</g:custom_label_0>' : '',
    ].filter(Boolean)
    return `<item>\n${lines.join('\n')}\n</item>`
  })

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>emWear</title>
<link>${SITE}</link>
<description>Персонализирани детски раници, халати, кърпи и подаръци с бродерия от emWear.</description>
${items.join('\n')}
</channel>
</rss>`
})
