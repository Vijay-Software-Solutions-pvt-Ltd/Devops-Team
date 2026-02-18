import React, { useEffect } from 'react';
import Navbar from '../../components/landing/Navbar';
import HeroSection from '../../components/landing/HeroSection';
import VideoSection from '../../components/landing/VideoSection';
import FeaturesSection from '../../components/landing/FeaturesSection';
import PricingSection from '../../components/landing/PricingSection';
import ProposalDetails from '../../components/landing/ProposalDetails';
import Footer from '../../components/landing/Footer';

export default function LandingPage() {

    useEffect(() => {
        // Smooth scrolling for anchor links
        const handleSmoothScroll = (e) => {
            const href = e.currentTarget.getAttribute('href');
            if (href.startsWith('#') && !href.startsWith('#/')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        };

        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });

        return () => {
            links.forEach(anchor => {
                anchor.removeEventListener('click', handleSmoothScroll);
            });
        };
    }, []);

    return (
        <div className="font-sans antialiased text-gray-900 bg-white selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <main>
                <HeroSection />
                <VideoSection />
                <FeaturesSection />
                <PricingSection />
                <ProposalDetails />
            </main>
            <Footer />
        </div>
    );
}
