import React, { useEffect, Suspense, lazy } from 'react';
import Navbar from '../../components/landing/Navbar';
import HeroSection from '../../components/landing/HeroSection';
import Footer from '../../components/landing/Footer';
import Loader from '../../components/Loader';

const VideoSection = lazy(() => import('../../components/landing/VideoSection'));
const FeaturesSection = lazy(() => import('../../components/landing/FeaturesSection'));
const PricingSection = lazy(() => import('../../components/landing/PricingSection'));
const ProposalDetails = lazy(() => import('../../components/landing/ProposalDetails'));

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
                <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center text-gray-400">Loading...</div>}>
                    <VideoSection />
                </Suspense>
                <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center text-gray-400">Loading...</div>}>
                    <FeaturesSection />
                </Suspense>
                <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center text-gray-400">Loading...</div>}>
                    <PricingSection />
                </Suspense>
                <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center text-gray-400">Loading...</div>}>
                    <ProposalDetails />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}