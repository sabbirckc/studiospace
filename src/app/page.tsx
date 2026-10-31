import { HeroSlider } from '@/components/home/hero-slider';
import { FeaturedStudios } from '@/components/home/featured-studios';
import { CategoryBrowse } from '@/components/home/category-browse';
import { HowItWorks } from '@/components/home/how-it-works';
import { HostGuarantee } from '@/components/home/host-guarantee';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Banner Slider with 3 slides */}
      <HeroSlider />

      {/* 2. Featured Studios Section (Dynamic fetch limit(6) from MongoDB) */}
      <FeaturedStudios />

      {/* 3. Browse by Studio Categories (Pre-filters /studios) */}
      <CategoryBrowse />

      {/* 4. Extra Section 1: How Booking Works 4-Step Workflow */}
      <HowItWorks />

      {/* 5. Extra Section 2: Host Guarantee & Creator Support Assurance */}
      <HostGuarantee />
    </div>
  );
}
