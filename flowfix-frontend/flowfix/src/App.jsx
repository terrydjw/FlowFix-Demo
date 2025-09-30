import React, { useState } from 'react'; // Import useState
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ChatWidget from './components/ChatWidget'; // Import the new ChatWidget
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import EmergencyPage from './pages/EmergencyPage';
import ContactPage from './pages/ContactPage';
import CalendarPage from './pages/CalendarPage';
import ScrollToTop from "./hooks/ScrollToTop.js";

function App() {
  // This is our switch. 'isChatOpen' is the state, and 'setIsChatOpen' is the function to change it.
  // It's 'false' by default, so the chat is hidden initially.
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <BrowserRouter>
      <Layout onHamburgerClick={closeChat}>
        <ScrollToTop />
        <Routes>
          {/* We pass the 'openChat' function as a prop to the HomePage */}
          <Route path="/" element={<HomePage onOpenChat={openChat} />} />
          <Route path="/services" element={<ServicesPage/>} />
          <Route path="/emergency" element={<EmergencyPage onOpenChat={openChat} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </Layout>

      {/* This is a conditional render. The ChatWidget only appears if 'isChatOpen' is true. */}
      {/* We pass the 'closeChat' function to the widget so it can close itself. */}
      <ChatWidget isOpen={isChatOpen} onClose={closeChat} />
    </BrowserRouter>
  );
}

export default App;