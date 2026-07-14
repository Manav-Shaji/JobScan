/**
 * ------------------------------------------------------------
 * File: page.jsx
 * 
 * Purpose:
 * Renders the main landing page layout by composing various modular sections.
 * 
 * Responsibilities:
 * • Orchestrates the sequence of sections including hero, features, and testimonials.
 * • Implements dynamic imports for performance optimization.
 * 
 * Used By:
 * • App Router
 * ------------------------------------------------------------
 */

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import dynamic from 'next/dynamic';

const FeaturesSection = dynamic(() => import('./components/FeaturesSection').then(mod => mod.FeaturesSection));
const AboutSection = dynamic(() => import('./components/AboutSection').then(mod => mod.AboutSection));
const TestimonialsSection = dynamic(() => import('./components/TestimonialsSection').then(mod => mod.TestimonialsSection));
const ContactSection = dynamic(() => import('./components/ContactSection').then(mod => mod.ContactSection));
const FooterSection = dynamic(() => import('./components/FooterSection').then(mod => mod.FooterSection));

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
