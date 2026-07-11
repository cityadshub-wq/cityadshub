import {
  Megaphone, Search, Globe, Smartphone, Camera, Video, Palette, BarChart3,
  Building2, ShoppingBag, Target, TrendingUp, Zap, Users,
  type LucideIcon,
} from 'lucide-react'

// Shared string-name -> Lucide component lookup, so any DB-driven `icon` column
// (services, hero cards) can resolve to a real icon consistently. lucide-react
// no longer ships brand/social icons (Facebook, Instagram, etc.) — social links
// render a generic icon, matching this project's existing footer behavior.
export const iconMap: Record<string, LucideIcon> = {
  Megaphone, Search, Globe, Smartphone, Camera, Video, Palette, BarChart3,
  Building2, ShoppingBag, Target, TrendingUp, Zap, Users,
}

export function getLucideIcon(name: string | undefined | null, fallback: LucideIcon = Globe): LucideIcon {
  if (!name) return fallback
  return iconMap[name] || fallback
}
