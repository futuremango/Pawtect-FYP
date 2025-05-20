import React, { useState } from "react";
import Navbar from '../components/Navbar';


function Chatbot() {
  // Store chat history as an array of { question, answer } objects
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);

    // Show temporary "Thinking..." response for the current question
    setChatHistory((prev) => [...prev, { question, answer: "Thinking..." }]);
    setQuestion("");

    try {
      const res = await fetch("https://pawtect-fyp-production.up.railway.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      // Replace the last "Thinking..." answer with the actual answer
      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { question, answer: data.answer };
        return newHistory;
      });
    } catch (err) {
      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          question,
          answer: "Error: Unable to get response from chatbot.",
        };
        return newHistory;
      });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundImage: `url('/images/rescue.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "95vh",
      }}
    >
      <Navbar/>

      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="container text-center">
          <h2>Chatbot</h2>

          {/* Chat history container */}
          <div
            className="chatbox mb-3"
            id="chatbox"
            style={{
              height: "300px",
              overflowY: "auto",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "1rem",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            {chatHistory.length === 0 && (
              <p className="text-muted">Ask me anything!</p>
            )}
            {chatHistory.map(({ question, answer }, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <p>
                  <strong>You:</strong> {question}
                </p>
                <p>
                  <strong>Pawtect Bot:</strong> {answer}
                </p>
                <hr />
              </div>
            ))}
          </div>

          <form
            id="chat-form"
            className="input-row"
            onSubmit={handleSubmit}
            autoComplete="off"
            style={{
              backgroundColor: "transparent",
            }}
          >
            <input
              type="text"
              id="user-input"
              className="form-control mb-2"
              placeholder="Enter your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              disabled={loading}
            />
            <button className="button2" type="submit" disabled={loading}>
              Ask
            </button>
          </form>
        </div>
      </div>
      <div style={{backgroundColor: "#fff" }}>
        Hi, This is just a Chatbot that extracts data from its dataset so it might now have all the information all the information you are looking for. Data for this chatbot is limited to PAWTECT, Common Illnesses, Items in a First Aid Kit, Food, Vaccination, Am I (Human) allerrgic to my pet, Normal day and night cycle of indoor Cats Dog and Bird.
      </div>
    </div>
  );
}

export default Chatbot;
