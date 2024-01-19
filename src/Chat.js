import { useState } from "react"
const API_KEY = process.env.REACT_APP_API_KEY
const GPT_URI = 'https://api.openai.com/v1/chat/completions'

const Chat = () => {
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState([])

    const handleSend = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }]
            })
        }

        try {
            const response = await fetch(GPT_URI, requestOptions)

            if (!response.ok) {
                throw new Error(`Request failed with status: ${response.status}`)
            }
            const data = await response.json();

            // Verify the Structure of the API Response
            const responseText = data && data.choices && data.choices[0] ? data.choices[0].message.content : 'No valid response!'

            setChatHistory((prev) => [
                ...prev,
                { text: message, type: 'user' },
                { text: responseText, type: 'response' }
            ])
            setMessage('')
        } catch (error) {
            setMessage('Failed to send message. Please try again!')
            console.error('Error in sending request', error)
        }
    }

  return (
    <>
        <header>
            <h1>Chat with GPT API</h1>
        </header>

        <main>
            <div className="chat-app-container">
                <div className="chat-messages">
                    {chatHistory.map((chat, index) => (
                        <div
                            className={`message ${chat.type}`}
                            key={index}
                        >
                            {chat.text}
                        </div>
                    ))}
                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button
                        className="btn"
                        onClick={handleSend}
                    >
                        <img width="25" height="25" src="https://img.icons8.com/color/48/filled-sent.png" alt="filled-sent"/>
                    </button>
                </div>
            </div>
        </main>
    </>
  )
}

export default Chat