
import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

function HomePage({ onOpenChat }) {
    // State to store the window's scroll position
    const [offsetY, setOffsetY] = useState(0);
    const handleScroll = () => setOffsetY(window.pageYOffset);

    // Effect hook to add and remove the scroll listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Cleanup function to remove the listener when the component is unmounted
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Call the hook for each element we want to animate
    const [heroRef, heroInView] = useAnimateOnScroll();
    const [trustBarRef, trustBarInView] = useAnimateOnScroll();
    const [howTitleRef, howTitleInView] = useAnimateOnScroll();
    const [step1Ref, step1InView] = useAnimateOnScroll();
    const [step2Ref, step2InView] = useAnimateOnScroll();
    const [step3Ref, step3InView] = useAnimateOnScroll();
    const [servicesTitleRef, servicesTitleInView] = useAnimateOnScroll();
    const [service1Ref, service1InView] = useAnimateOnScroll();
    const [service2Ref, service2InView] = useAnimateOnScroll();
    const [service3Ref, service3InView] = useAnimateOnScroll();
    const [service4Ref, service4InView] = useAnimateOnScroll();
    const [service5Ref, service5InView] = useAnimateOnScroll();
    const [service6Ref, service6InView] = useAnimateOnScroll();

    const [whyTitleRef, whyTitleInView] = useAnimateOnScroll();
    const [whyImageRef, whyImageInView] = useAnimateOnScroll();
    const [whyListRef, whyListInView] = useAnimateOnScroll();

    return (
        <>
            {/* 1. Hero Section */}
            <section className="hero-section">
                {/* This div is now ONLY for the background image */}
                <div
                    className="hero-background-image"
                    style={{ transform: `translateY(${offsetY * 0.5}px)` }}
                />
                <div className="hero-content container">
                    <div
                        ref={heroRef}
                        className={`hero-text fade-in-up ${heroInView ? 'is-visible' : ''}`}
                    >
                        <h1>Your Plumbing Problem, Solved Instantly.</h1>
                        <p>No more waiting. Use our AI assistant to get an instant price and book your job in seconds.</p>
                        <a href="#" className="animated-cta-button" onClick={(e) => { e.preventDefault(); onOpenChat(); }}>
                            {/* These four spans are ONLY for the animation */}
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>

                            {/* This is the visible content */}
                            <span className="button-icon">💬</span>
                            <span className="button-text">Chat with our AI Assistant</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* 2. Trust Bar */}
            <section className="trust-bar">
                <div
                    ref={trustBarRef}
                    className={`trust-bar-content container fade-in-up ${trustBarInView ? 'is-visible' : ''}`}
                    style={{ transitionDelay: '0.2s' }}
                >
                    <div className="trust-signal">🛡️ 24/7 Emergency Service</div>
                    <div className="trust-signal">🔥 Gas Safe Registered</div>
                    <div className="trust-signal">⭐ Rated 5 Stars on Google</div>
                </div>
            </section>

            {/* 3. How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 ref={howTitleRef} className={`fade-in-up ${howTitleInView ? 'is-visible' : ''}`}>
                        A Smarter Way to Get Things Fixed
                    </h2>
                    <div className="steps-grid">
                        <div ref={step1Ref} className={`step fade-in-up ${step1InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                            <div className="step-icon">1</div>
                            <h3>Tell Our AI Your Problem</h3>
                            <p>Describe your issue or project in a few words, any time of day.</p>
                        </div>

                        {/* ADD THE FIRST PIPE */}
                        <svg className="pipe-connector" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
                            <path d="M0,25 Q25,0 50,25 T100,25" strokeWidth="3" fill="none" />
                        </svg>

                        <div ref={step2Ref} className={`step fade-in-up ${step2InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                            <div className="step-icon">2</div>
                            <h3>Get Your Instant Price</h3>
                            <p>Our smart assistant calculates a transparent price for you on the spot.</p>
                        </div>

                        {/* ADD THE SECOND PIPE */}
                        <svg className="pipe-connector" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
                            <path d="M0,25 Q25,50 50,25 T100,25" strokeWidth="3" fill="none" />
                        </svg>

                        <div ref={step3Ref} className={`step fade-in-up ${step3InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.6s' }}>
                            <div className="step-icon">3</div>
                            <h3>Book Your Slot</h3>
                            <p>Choose a time that works for you and confirm your booking online.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Our Services Section */}
            <section className="services-section">
                <div className="container">
                    <h2 ref={servicesTitleRef} className={`fade-in-up ${servicesTitleInView ? 'is-visible' : ''}`}>
                        Comprehensive Plumbing Services
                    </h2>
                    <div className="services-grid">
                        <div ref={service1Ref} className={`service-card fade-in-up ${service1InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.2s' }}>🚨 Emergency Call-Outs</div>
                        <div ref={service2Ref} className={`service-card fade-in-up ${service2InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.3s' }}>🔥 Boiler Installation & Service</div>
                        <div ref={service3Ref} className={`service-card fade-in-up ${service3InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.4s' }}>🛁 Bathroom & Kitchen Plumbing</div>
                        <div ref={service4Ref} className={`service-card fade-in-up ${service4InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.5s' }}>💧 Leaks & Drips</div>
                        <div ref={service5Ref} className={`service-card fade-in-up ${service5InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.6s' }}>🌀 Drains & Blockages</div>
                        <div ref={service6Ref} className={`service-card fade-in-up ${service6InView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.7s' }}>🔧 General Plumbing</div>
                    </div>
                </div>
            </section>

            {/* === NEW "WHY CHOOSE US?" SECTION === */}
            <section ref={whyTitleRef} className={`why-us-section fade-in-up ${whyTitleInView ? 'is-visible' : ''}`}>
                <div className="container">
                    <h2>The Smartest, Most Convenient Choice</h2>
                    <div className="why-us-content">
                        <div ref={whyImageRef} className={`why-us-image fade-in-up ${whyImageInView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                            <img src="https://www.allshoreplumbingheat.com/wp-content/uploads/2025/07/A-high-quality-realistic-image-representing-reliable-plumbing-services-in-suburban-areas-like-Farmi.webp" alt="Friendly and professional FlowFix plumber" />
                        </div>
                        <div ref={whyListRef} className={`why-us-text fade-in-up ${whyListInView ? 'is-visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                            <ul>
                                <li>
                                    <span className="list-icon">🤖</span>
                                    <div>
                                        <strong>Instant AI Booking</strong>
                                        <p>Book 24/7 without ever making a phone call. Get quotes and availability in seconds.</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="list-icon">📍</span>
                                    <div>
                                        <strong>Coventry's Local Experts</strong>
                                        <p>Fast, reliable service from qualified plumbers who know the area inside and out.</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="list-icon"> 💷 </span>
                                    <div>
                                        <strong>Transparent Pricing</strong>
                                        <p>No hidden fees or surprise charges. The price our AI assistant quotes is the price you pay.</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="list-icon">🏆</span>
                                    <div>
                                        <strong>Workmanship Guaranteed</strong>
                                        <p>We stand by the quality of our work, every time. Your satisfaction is our top priority.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}


export default HomePage;