import React from 'react';
import '../styles/CalendarPage.css'; // We will create this next

function CalendarPage() {
    return (
        <div className="container page-container">
            <header className="page-header">
                <h1>Live Booking Calendar</h1>
                <p>As this is an interactive demo, we have provided a live view of the FlowFix Plumbers calendar. When you book an appointment with our AI assistant, it will appear here in real-time.</p>
            </header>

            <div className="calendar-wrapper">
                <iframe
                    src="https://calendar.google.com/calendar/embed?src=vernistrash%40gmail.com&ctz=Europe%2FLondon"
                    style={{ border: 0 }}
                    width="100%"
                    height="600"
                    frameBorder="0"
                    scrolling="no"
                ></iframe>
            </div>
        </div>
    );
}

export default CalendarPage;