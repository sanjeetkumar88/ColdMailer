import { HomeContent } from "@/components/home-content"

export const revalidate = 3600 // ISR: Revalidate every hour

export default function HomePage() {
  return <HomeContent />
}
