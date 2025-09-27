import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatWidget.css';

function ChatWidget({ isOpen, onClose }) {
    // State to hold the array of conversation messages
    const [messages, setMessages] = useState([
        { from: 'ai', text: 'Hi! I am Vern, the FlowFix AI assistant. How can I help with your plumbing today?' }
    ]);
    // State for the user's current text input
    const [input, setInput] = useState('');
    // State to show a "typing..." indicator while waiting for the backend
    const [isLoading, setIsLoading] = useState(false);

    // This is a ref that will point to the bottom of the message list
    const messagesEndRef = useRef(null);

    // This function smoothly scrolls the chat to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // This effect runs every time the 'messages' array changes
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // This function handles the form submission
    const handleSendMessage = async (e) => {
        e.preventDefault(); // Prevents the browser from reloading
        if (!input.trim()) return; // Don't allow empty messages

        const userMessage = { from: 'user', text: input };

        // Add the user's message to the chat and clear the input box
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');
        setIsLoading(true); // Show the typing indicator

        try {
            // The 'fetch' call to our Python backend API
            const response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage.text }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const aiMessage = { from: 'ai', text: data.response };

            // Add the AI's response to the chat
            setMessages(prevMessages => [...prevMessages, aiMessage]);

        } catch (error) {
            console.error("Error fetching AI response:", error);
            const errorMessage = { from: 'ai', text: 'Sorry, I seem to be having trouble connecting. Please try again later.' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false); // Hide the typing indicator
        }
    };

    return (
        <div className={`chat-widget ${isOpen ? 'is-open' : ''}`}>
            <div className="chat-header">
                <div className="header-content">
                    <span className="header-avatar">🤖</span>
                    <h3>FlowFix AI Assistant</h3>
                </div>
                <button className="chat-close-btn" onClick={onClose}>&times;</button>
            </div>
            <div className="chat-messages">
                {/* Map over the 'messages' state to display the conversation */}
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.from}-message`}>
                        {msg.text}
                    </div>
                ))}
                {/* Show the typing indicator when isLoading is true */}
                {isLoading && (
                    <div className="message ai-message typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                )}
                {/* This empty div is the target for our auto-scrolling */}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
                <form className="chat-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>Send</button>
                </form>
            </div>
        </div>
    );
}

export default ChatWidget;