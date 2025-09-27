import React from 'react';
import '../styles/EmergencyPage.css'; // We will create this file next
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

function EmergencyPage({ onOpenChat }) { // Accept the onOpenChat prop
    const [headerRef, headerInView] = useAnimateOnScroll();
    const [processRef, processInView] = useAnimateOnScroll();
    const [ctaRef, ctaInView] = useAnimateOnScroll();

    return (
        <div className="container page-container">
            <header ref={headerRef} className={`page-header fade-in-up ${headerInView ? 'is-visible' : ''}`}>
                <h1>24/7 Emergency Service</h1>
                <p>Plumbing emergencies don't wait for business hours, and neither do we. We are available around the clock to handle urgent issues like burst pipes, major leaks, and loss of heating or hot water.</p>
            </header>

            <div className="emergency-content">
                <div ref={processRef} className={`emergency-process fade-in-up ${processInView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                    <h2>Our Emergency Process</h2>
                    <p>When you're facing an emergency, speed and clarity are key. Here’s how to get the fastest possible response:</p>
                    <ol className="steps-list">
                        <li>
                            <strong>1. Contact our AI Assistant</strong>
                            <p>Click the "Check Emergency Availability" button below. Our AI, Vern, is the fastest way to check our immediate availability and get an estimated response time.</p>
                        </li>
                        <li>
                            <strong>2. Provide Your Postcode</strong>
                            <p>The AI will ask for your postcode to confirm you are within our emergency service area (Coventry & surrounding areas).</p>
                        </li>
                        <li>
                            <strong>3. Receive Instant Confirmation</strong>
                            <p>If we are available, the AI will confirm the emergency call-out fee and instruct you to call our direct line to finalize the dispatch. For safety, all emergency jobs require a final voice confirmation.</p>
                        </li>
                    </ol>
                </div>

                <div ref={ctaRef} className={`emergency-cta fade-in-up ${ctaInView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                    <h3>Facing an Emergency Now?</h3>
                    <p>Don't wait. Use our AI assistant to check if we can help immediately.</p>
                    <button className="button hero-button" onClick={onOpenChat}>
                        <span className="button-icon">🚨</span>
                        Check Emergency Availability
                    </button>
                </div>
            </div>
        </div>
    );
}

// We need to update App.jsx to pass the onOpenChat prop to this page too.
// I'll remind you of this after you've created the styles.

export default EmergencyPage;