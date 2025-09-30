import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Header.css';

// 1. Accept the 'onHamburgerClick' prop
function Header({ onHamburgerClick }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRef = useRef(null);
    const [lineStyle, setLineStyle] = useState({});
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // This is your existing magic line logic - it is unchanged
    useEffect(() => {
        const navNode = navRef.current;
        if (!navNode) return;
        const setLineToElement = (element) => {
            if (element) {
                const { offsetLeft, offsetWidth } = element;
                setLineStyle({
                    width: offsetWidth,
                    transform: `translateX(${offsetLeft}px)`,
                    opacity: 1,
                });
            }
        };
        const timer = setTimeout(() => {
            const initialActiveLink = navNode.querySelector('.is-active');
            setLineToElement(initialActiveLink);
        }, 100);
        const handleMouseOver = (e) => {
            if (e.target && e.target.classList.contains('site-header-link')) {
                setLineToElement(e.target);
            }
        };
        const handleMouseLeave = () => {
            const currentActiveLink = navNode.querySelector('.is-active');
            setLineToElement(currentActiveLink);
        };
        navNode.addEventListener('mouseover', handleMouseOver);
        navNode.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            clearTimeout(timer);
            navNode.removeEventListener('mouseover', handleMouseOver);
            navNode.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [location]);

    // 2. Create a new handler function to do both actions
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen); // Toggles the nav menu
        if (onHamburgerClick) {
            onHamburgerClick();    // Also calls the function to close the chat
        }
    };

    return (
        <header className={`site-header ${isMenuOpen ? 'is-expanded' : ''}`}>
            <div className="site-header-content container">
                <a href="/" className="site-header-logo">
                    Flow<span className="logo-accent">Fix</span>
                </a>

                {/* 3. Use the new handler function in the onClick */}
                <button
                    className={`hamburger-button ${isMenuOpen ? 'is-active' : ''}`}
                    onClick={handleMenuToggle}
                    aria-label="Toggle navigation"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                <nav
                    ref={navRef}
                    className={`site-header-nav ${isMenuOpen ? 'is-open' : ''}`}
                >
                    <NavLink to="/" className={({ isActive }) => `site-header-link ${isActive ? 'is-active' : ''}`}>Home</NavLink>
                    <NavLink to="/services" className={({ isActive }) => `site-header-link ${isActive ? 'is-active' : ''}`}>Services</NavLink>
                    <NavLink to="/emergency" className={({ isActive }) => `site-header-link ${isActive ? 'is-active' : ''}`}>Emergency</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => `site-header-link ${isActive ? 'is-active' : ''}`}>Contact</NavLink>
                    <NavLink to="/calendar" className={({ isActive }) => `site-header-link ${isActive ? 'is-active' : ''}`}>Calendar</NavLink>
                    <div className="magic-line" style={lineStyle}></div>
                </nav>
            </div>

            {/* This empty div seems to be from a previous attempt, you may or may not need it depending on your final CSS */}
            <div className={`nav-background ${isMenuOpen ? 'is-open' : ''}`}></div>
        </header>
    );
}

export default Header;