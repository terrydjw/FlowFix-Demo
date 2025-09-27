import React from 'react';
import '../styles/ContactPage.css'; // We will create this file next
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

function ContactPage() {
    const [headerRef, headerInView] = useAnimateOnScroll();
    const [card1Ref, card1InView] = useAnimateOnScroll();
    const [card2Ref, card2InView] = useAnimateOnScroll();
    const [card3Ref, card3InView] = useAnimateOnScroll();

    return (
        <div className="container page-container">
            <header ref={headerRef} className={`page-header fade-in-up ${headerInView ? 'is-visible' : ''}`}>
                <h1>Get In Touch</h1>
                <p>Have a question or need to speak with someone directly? Here’s how you can reach us. For instant quotes and availability, please use our AI Assistant.</p>
            </header>

            <div className="contact-grid">
                <div ref={card1Ref} className={`contact-card fade-in-up ${card1InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                    <h3>📞 Call Us</h3>
                    <p>For direct inquiries or to confirm an emergency booking.</p>
                    <a href="tel:02476001234" className="contact-link">024 7600 1234</a>
                </div>

                <div ref={card2Ref} className={`contact-card fade-in-up ${card2InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                    <h3>📧 Email Us</h3>
                    <p>For general questions, non-urgent job details, or quotes for large projects.</p>
                    <a href="mailto:hello@flowfix.com" className="contact-link">hello@flowfix.com</a>
                </div>

                <div ref={card3Ref} className={`contact-card fade-in-up ${card3InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.6s' }}>
                    <h3>📍 Service Area</h3>
                    <p>We primarily cover all areas within Coventry and the immediate surrounding towns.</p>
                    <p className="service-area-text">Coventry (CV1-CV8), Kenilworth, Bedworth</p>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;