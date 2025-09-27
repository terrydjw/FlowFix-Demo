import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/Layout.css'; // Import the new layout styles

function Layout({ children }) {
    return (
        <div className="app-wrapper">
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;