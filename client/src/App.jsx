import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your AI support assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("API Error:", response.status, errorText);

        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("Chat request failed:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to connect to the AI server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "Hello! I'm your AI support assistant. How can I help you today?",
      },
    ]);
  };
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">AI</div>

          <div>
            <h2>SupportFlow</h2>
            <p>AI Customer Support</p>
          </div>
        </div>

        <button className="new-chat-btn" onClick={clearChat}>
          + New Conversation
        </button>

        <div className="sidebar-section">
          <p className="sidebar-label">Supported Languages</p>

          <div className="language-list">
            <div className="language-item">
              <span>EN</span>
              English
            </div>

            <div className="language-item">
              <span>हि</span>
              हिंदी
            </div>

            <div className="language-item">
              <span>বা</span>
              বাংলা
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="status-dot" />
          AI system online
        </div>
      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <div>
            <p className="eyebrow">MULTILINGUAL AI</p>
            <h1>Customer Support Assistant</h1>
            <p className="subtitle">
              Ask questions in English, Hindi, or Bengali.
            </p>
          </div>

          <div className="ai-badge">
            <span className="pulse" />
            AI Online
          </div>
        </header>

        <section className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message-row ${message.role}`}>
              <div className={`avatar ${message.role}`}>
                {message.role === "assistant" ? "AI" : "YOU"}
              </div>

              <div className={`message-bubble ${message.role}`}>
                <p>{message.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="avatar assistant">AI</div>

              <div className="message-bubble assistant typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        <footer className="composer-wrapper">
          <div className="suggestions">
            <button onClick={() => setInput("How can I return my product?")}>
              Return policy
            </button>

            <button onClick={() => setInput("मेरा ऑर्डर कब आएगा?")}>
              Delivery status
            </button>

            <button
              onClick={() => setInput("আমি কি product return করতে পারি?")}
            >
              বাংলা Support
            </button>
          </div>

          <div className="composer">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows="1"
            />

            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              Send
              <span>→</span>
            </button>
          </div>

          <p className="helper-text">
            AI can make mistakes. Verify important information.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
