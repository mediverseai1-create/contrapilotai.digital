import { createClient } from '@/lib/supabase/server';
import { Nav } from '@/components/marketing/Nav';
import { Footer } from '@/components/marketing/Footer';
import { Hero } from '@/components/marketing/Hero';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Catches } from '@/components/marketing/Catches';
import { TwoCol } from '@/components/marketing/TwoCol';
import { Pricing } from '@/components/marketing/Pricing';
import { FAQ } from '@/components/marketing/FAQ';
import { CTABand } from '@/components/marketing/CTABand';

export default async function LandingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Nav mode="dark" signedIn={!!user} />
      <Hero />
      <HowItWorks />
      <Catches />
      <TwoCol />
      <Pricing />
      <FAQ />
      <CTABand />
      <Footer />
    </>
  );
}
