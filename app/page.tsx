import LandingPage from "@/components/landing/landing-page"
import { PageLayout } from "@/components/layout/page-layout"

export default function Page() {
  return (
    <PageLayout headerVariant="public">
      <LandingPage />
    </PageLayout>
  )
}
