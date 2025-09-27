import React from 'react';
import '../styles/ServicesPage.css'; // We will create this file next
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

function ServicesPage() {
    // Set up animation hooks for each card
    const [serviceRef, headerInView] = useAnimateOnScroll();
    const [card1Ref, card1InView] = useAnimateOnScroll();
    const [card2Ref, card2InView] = useAnimateOnScroll();
    const [card3Ref, card3InView] = useAnimateOnScroll();
    const [card4Ref, card4InView] = useAnimateOnScroll();
    const [card5Ref, card5InView] = useAnimateOnScroll();
    const [card6Ref, card6InView] = useAnimateOnScroll();

    return (
        <div className="container page-container">
            <header ref={serviceRef} className={`page-header fade-in-up ${headerInView ? 'is-visible' : ''}`}>
                <h1>Our Plumbing Services</h1>
                <p>From urgent leaks to planned installations, we offer a comprehensive range of professional plumbing services across Coventry and London.</p>
            </header>

            <div className="services-grid-container">
                <div ref={card1Ref} className={`service-item fade-in-up ${card1InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                    <h3>💧 Leaky Taps & Pipes</h3>
                    <p>Don't let a drip turn into a disaster. We quickly diagnose and repair leaks in taps, pipes, and fixtures to save you water and money.</p>
                </div>
                <div ref={card2Ref} className={`service-item fade-in-up ${card2InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                    <h3>🔥 Boiler Repair & Servicing</h3>
                    <p>As Gas Safe registered engineers, we handle boiler breakdowns, routine servicing, and safety checks to keep your home warm and safe.</p>
                </div>
                <div ref={card3Ref} className={`service-item fade-in-up ${card3InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
                    <h3>🌀 Blocked Drains</h3>
                    <p>Using professional equipment, we can clear even the most stubborn blockages in sinks, toilets, showers, and main drains quickly and cleanly.</p>
                </div>
                <div ref={card4Ref} className={`service-item fade-in-up ${card4InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                    <h3>🌡️ Radiator Installation & Repair</h3>
                    <p>Whether you're fitting new radiators, moving existing ones, or fixing cold spots, we ensure your heating system is efficient and balanced.</p>
                </div>
                <div ref={card5Ref} className={`service-item fade-in-up ${card5InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                    <h3>🛁 Bathroom Fitting</h3>
                    <p>Planning a new bathroom? We provide a complete fitting service, from plumbing in new showers and toilets to full suite installations.</p>
                </div>
                <div ref={card6Ref} className={`service-item fade-in-up ${card6InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
                    <h3>🔧 General Plumbing</h3>
                    <p>From installing washing machines to fixing toilet flushes, no job is too small. We provide reliable solutions for all your day-to-day plumbing needs.</p>
                </div>
            </div>
        </div>
    );
}

export default ServicesPage;