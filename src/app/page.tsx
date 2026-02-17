import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import IntegrationSection from '@/components/landing/IntegrationSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import StatsSection from '@/components/landing/StatsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <LandingNavbar />
            <HeroSection />
            <FeaturesSection />
            <IntegrationSection />
            <HowItWorksSection />
            {/* <StatsSection /> */}
            {/* <TestimonialsSection /> */}
            {/* <PricingSection /> */}
            <CTASection />
            <Footer />
        </div>
    );
}
