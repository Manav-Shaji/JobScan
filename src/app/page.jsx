import { 
    Navbar, 
    HeroSection, 
    HowItWorks, 
    FeaturesSection, 
    AboutSection, 
    TestimonialsSection, 
    ContactSection, 
    FooterSection 
} from '@/frontend/features/landing';

export default function Landing() {
    return (
        <div
            style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <Navbar />
            <main>
                <HeroSection />
                <HowItWorks />
                <AboutSection />
                <FeaturesSection />
                <TestimonialsSection />
                <ContactSection />
            </main>
            <FooterSection />
        </div>
    );
}
