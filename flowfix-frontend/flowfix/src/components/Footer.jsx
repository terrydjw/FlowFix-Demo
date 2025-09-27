import React from 'react';
import '../styles/Footer.css'; // Import the new CSS file
import { Link } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="site-footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <h3>VERN DIGITAL</h3>
                    <p>Empowering local businesses with intelligent automation and professional web design.</p>
                </div>
                <div className="footer-links">
                    <h4>Navigate</h4>
                    <Link to="/">Home</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/emergency">Emergency</Link>
                    <Link to="/calendar">Calendar</Link>
                </div>
                <div className="footer-links">
                    <h4>Contact</h4>
                    <a href="mailto:dylan@verndigital.com">dylan@verndigital.com</a>
                    <p>07935 712911</p>
                    <p>Coventry, UK</p>
                </div>
            </div>
            <div className="copyright">
                &copy; {currentYear} Vern Digital. All Rights Reserved.
            </div>
        </footer>
    );
}

export default Footer;