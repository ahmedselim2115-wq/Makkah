export interface Product {
  id: string
  name: string
  nameEn: string | null
  description: string
  descriptionEn: string | null
  price: number
  compareAtPrice?: number | null
  imageUrl: string
  category: string
  categoryEn: string | null
  capacity: string | null
  capacityEn: string | null
  temperature: string | null
  temperatureEn: string | null
  power: string | null
  powerEn: string | null
  featured: boolean
  inStock: boolean
  showPrice: boolean
  createdAt: string
  updatedAt: string
}

export interface SiteSettings {
  id: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  heroImages?: string[]
  aboutTitle: string
  aboutText: string
  aboutImage: string
  aboutVideo?: string
  phone: string
  email: string
  address: string
  workingHours: string
  facebook: string
  instagram: string
  tiktok: string // أضف هذا السطر هنا
  whatsapp: string
  whatsappWidgetEnabled?: boolean
  whatsappWelcomeMessage?: string
  mapLocation?: string
  showcaseTitle?: string
  showcaseTitleEn?: string
  showcaseSubtitle?: string
  showcaseSubtitleEn?: string
}


export interface Stats {
  totalProducts: number
  featuredProducts: number
  inStockProducts: number
  outOfStockProducts: number
}