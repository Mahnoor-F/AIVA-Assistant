import { useState, useEffect, useRef } from 'react';
import aiImage from './assets/Ai.png'; 
import { runChat } from './groq';
import { detectCommand } from './command';

export default function Assistant() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  
  const isConversationActiveRef = useRef(false);
  const isProcessingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // --- ACCENT & VOICE LOGIC FIX ---
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; 
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        isProcessingRef.current = true;
        handleAIResponse(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => {
    
          if (
            isConversationActiveRef.current && 
            !isProcessingRef.current && 
            !window.speechSynthesis.speaking &&
            !isLoading
          ) {
            setIsActive(false);
            isConversationActiveRef.current = false;
            setResponse("Aap khamosh hain, isliye mic band ho gaya hai.");
          }
        }, 1200); 
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech' && !isProcessingRef.current) {
          setIsActive(false);
          isConversationActiveRef.current = false;
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [chatHistory, isLoading]);

  const startListening = () => {
    if (recognitionRef.current && isConversationActiveRef.current) {
      try {
        isProcessingRef.current = false;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) { console.log("Mic busy..."); }
    }
  };


  function speakText(text) {
    
    synthRef.current.cancel(); 

    if (synthRef.current.paused) {
        synthRef.current.resume();
    }

    const speechText = text.replace(/AIVA/g, "Eva");

    const utterance = new SpeechSynthesisUtterance(speechText);
    const voices = synthRef.current.getVoices();

    let selectedVoice = voices.find(v => 
      v.lang.includes('hi-IN') || 
      v.name.toLowerCase().includes('hindi') ||
      v.name.toLowerCase().includes('google hindi')
    );

    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.name.includes('Female') || v.lang.includes('en-GB'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = 'hi-IN'; 
      utterance.rate = 1.0;    
      utterance.pitch = 1.0; 
    }

    utterance.onstart = () => {
      isProcessingRef.current = true;
    };

    utterance.onend = () => {
      if (isConversationActiveRef.current) {
        isProcessingRef.current = false;
        setTimeout(() => startListening(), 100);
      }
    };

    synthRef.current.speak(utterance);
  }


  const toggleConversation = () => {
    const newState = !isConversationActiveRef.current;
    isConversationActiveRef.current = newState;
    setIsActive(newState);

    if (newState) {

      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
      }
      
      setResponse("AIVA sun rahi hai...");
      setInput('');
      isProcessingRef.current = false;
      
      const kickoff = new SpeechSynthesisUtterance(" ");
      kickoff.volume = 0; 
      window.speechSynthesis.speak(kickoff);

      startListening();

    } else {
     
      setIsListening(false);
      isProcessingRef.current = false;
      if (recognitionRef.current) recognitionRef.current.stop();
      synthRef.current.cancel();
      setResponse("Conversation ended.");
    }
  };

  const handleAIResponse = async (userText) => {
    setIsLoading(true);
    isProcessingRef.current = true;
    const updatedHistory = [...chatHistory, { role: "user", content: userText }];
    setChatHistory(updatedHistory);

    try {
      const commandResult = detectCommand(userText);
      
      if (commandResult.isCommand) {
        setResponse(commandResult.response);
        setChatHistory(prev => [...prev, { role: "assistant", content: commandResult.response }]);
        
        if (commandResult.shouldSpeak) {
          speakText(commandResult.response);
        }
        
        if (!commandResult.keepAlive) {
          
          setIsActive(false);
          isConversationActiveRef.current = false;
          isProcessingRef.current = false; 
          if (recognitionRef.current) recognitionRef.current.stop();

        } else {
          isProcessingRef.current = true; 
        }

        setIsLoading(false);
        return; 
      }
      
      const res = await runChat(userText, updatedHistory);
      setResponse(res);
      setChatHistory(prev => [...prev, { role: "assistant", content: res }]);
      speakText(res); 
      
    } catch (error) {
      setIsActive(false);
      isConversationActiveRef.current = false;
      setResponse("Net ka kuch masla hai.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 bg-[#0f172a] text-white'>
      <div className='relative mt-3'>
        {(isListening || isLoading) && (
          <div className='absolute inset-0 bg-violet-600 rounded-full blur-[80px] opacity-40 animate-pulse'></div>
        )}
        <img src={aiImage} alt="AI" className={`w-70 md:w-90 relative z-10 transition-all duration-500 ${(isListening || isLoading) ? 'scale-105' : 'scale-100'}`} />
      </div>

      <p className='bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-violet-500 pt-6 text-[clamp(1rem,5vw,2rem)] font-medium text-center'>
        I'm AIVA, Your Virtual Assistant.
      </p>

      <div className='mt-6 text-center flex flex-col items-center justify-center max-w-2xl  px-4'>
        {isLoading ? (
          <div className='flex gap-2 items-center text-violet-400 animate-pulse'>
            Thinking...
          </div>
        ) : response ? (
          
          <p className='bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 text-lg font-medium leading-relaxed transition-all duration-500 drop-shadow-sm'>
            {response}
          </p>
        ) : (
          
          <div className='flex flex-col items-center gap-3'>
            <p className='text-gray-400 italic text-lg animate-pulse'>
              {input || (isActive ? "Main sun rahi hoon, boliye..." : "Click START CHAT to begin.")}
            </p>
            {isListening && !isLoading && (
              <div className='flex items-center gap-1 h-6'>
                <div className='w-1 bg-pink-500 animate-bounce h-3'></div>
                <div className='w-1 bg-violet-500 animate-bounce h-6'></div>
                <div className='w-1 bg-pink-500 animate-bounce h-3'></div>
              </div>
            )}
          </div>
        )}
      </div>

      
      <button 
        onClick={toggleConversation} 
        disabled={isLoading} 
        className={`my-8 px-10 py-4 text-lg cursor-pointer font-extrabold rounded-full transition-all duration-500 active:scale-90 transform
          ${isActive 
            ? 'bg-linear-to-r from-red-500 via-orange-500 to-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:shadow-[0_0_45px_rgba(225,29,72,0.8)]' 
            : 'bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_30px_rgba(147,51,234,0.6)] hover:shadow-[0_0_45px_rgba(147,51,234,0.8)]'
          } 
          ${isLoading ? 'opacity-70 cursor-wait' : 'hover:-translate-y-1.5 hover:scale-105'}
          tracking-widest uppercase
        `}
      >
        {isActive ? "STOP CHAT" : "START CHAT"}
      </button>
    </div>
  );
}