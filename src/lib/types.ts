export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  capacity: string | null
  temperature: string | null
  power: string | null
  featured: boolean
  inStock: boolean
  createdAt: string
  updatedAt: string
}

export interface SiteSettings {
  id: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  aboutTitle: string
  aboutText: string
  aboutImage: string
  phone: string
  email: string
  address: string
  workingHours: string
  facebook: string
  instagram: string
  whatsapp: string
}

export interface Stats {
  totalProducts: number
  featuredProducts: number
  inStockProducts: number
  outOfStockProducts: number
}
