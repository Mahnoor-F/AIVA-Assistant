# 🎙️ AIVA — The Voice-First Virtual Assistant

**AIVA** (Artificial Intelligence Virtual Assistant) is a modern, voice-interactive AI assistant that uses web-based speech recognition and Groq-powered intelligence. It was designed by **Mahnoor** so that users can perform daily tasks using voice commands and talk in natural Roman Urdu and English.

---

## ✨ Key Features

* **Voice-First Interaction:** Uses the Web Speech API for a complete hands-free experience, which listens to and processes the user's voice.
* **Intelligent Commands:** A custom command engine that detects patterns like "Open YouTube," "Open Google," or "What is the time" to perform actions.
* **Smart Conversations:** Real-time chat powered by **Groq Cloud (Llama 3.3)**, specifically optimized to understand a mix of Roman Urdu and English.
* **Multilingual Text-to-Speech:** The AI's response is not just written but can also be heard in a female voice (using 'hi-IN' voice mapping for a natural accent).
* **Dynamic UI Animations:** Includes neon glow effects and pulse animations to visually show when the AI is listening or thinking.
* **Automated Mic Management:** The microphone automatically turns off when the conversation ends or when there is silence to ensure privacy.
* **Identity & Memory:** The AI knows its identity (AIVA) and information about its creator (Mahnoor).

---

## 🛠️ Tech Stack

* **Frontend Library:** React.js (Vite)
* **AI Engine:** Groq SDK (Llama-3.3-70b-versatile)
* **Voice Processing:** Web Speech API (Recognition & Synthesis)
* **Styling:** Tailwind CSS
* **Command Logic:** Custom Regex-based Pattern Matching

---

## 🚀 Getting Started

Follow these steps to run the project locally:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Mahnoor-F/aiva-assistant.git](https://github.com/Mahnoor-F/aiva-assistant.git)
    cd aiva-assistant
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Environment Variables:**
    Create a `.env` file in the root directory and add your key:
    ```env
    VITE_GROQ_API_KEY=your_groq_api_key_here
    ```

4.  **Launch Project:**
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

* `src/Assistant.jsx`: Core logic for voice handling and UI states.
* `src/command.js`: Dictionary of voice patterns and automated actions.
* `src/groq.js`: AI configuration, system instructions, and language detection.
* `src/index.css`: Global styles and font configurations.

---

## 👤 Author

* **Created by:** Mahnoor
* **GitHub:** [https://github.com/Mahnoor-F](https://github.com/Mahnoor-F)
