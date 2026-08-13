import { createClient } from '@/lib/supabase/server';
import { Nav } from '@/components/marketing/Nav';
import { Footer } from '@/components/marketing/Footer';
import { Pricing } from '@/components/marketing/Pricing';
import { FAQ } from '@/components/marketing/FAQ';
import { CTABand } from '@/components/marketing/CTABand';

export default async function PricingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Nav mode="light" signedIn={!!user} />
      <div style={{ height: 32 }} />
      <Pricing />
      <FAQ />
      <CTABand />
      <Footer />
    </>
  );
}
