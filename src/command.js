export const commandPatterns = {
  // YouTube
  youtube: {
    patterns: [/open\s+youtube/i, /youtube\s+kholo/i,/youtube\s+open/i],
    action: () => {
      window.open('https://www.youtube.com/', '_blank');
      return 'Opening YouTube!';
    }
  },

  // Google Search
  search: {
    patterns: [/google\s+kholo/i, /open\s+google/i,/google\s+open/i, /dhundo\s+(.*)/i, /search\s+(.*)/i],
    action: (match) => {
      const query = match[1];
      if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        return `Main Google par ${query} search rahi hoon.`;
      }
      window.open('https://www.google.com/', '_blank');
      return 'Opening Google!';
    }
  },

  // Instagram
  instagram: {
    patterns: [/open\s+instagram/i, /instagram\s+kholo/i,/instagram\s+open/i, /open\s+insta/i, /insta\s+open/i, /insta\s+kholo/i],
    action: () => {
      window.open('https://www.instagram.com/', '_blank');
      return 'Opening Instagram!';
    }
  },

  // Facebook
  facebook: {
    patterns: [/open\s+facebook/i, /facebook\s+kholo/i,/facebook\s+open/i, /open\s+fb/i, /fb\s+kholo/i, /fb\s+open/i],
    action: () => {
      window.open('https://www.facebook.com/', '_blank');
      return 'Opening Facebook!';
    }
  },

  // WhatsApp
  whatsapp: {
    patterns: [/open\s+whatsapp/i, /whatsapp\s+kholo/i, /whatsapp\s+open/i],
    action: () => {
      window.open('https://web.whatsapp.com/', '_blank');
      return 'Opening WhatsApp Web!';
    }
  },

  // Snapchat
  snapchat: {
    patterns: [/open\s+snapchat/i, /snapchat\s+kholo/i, /snapchat\s+open/i, /snap\s+kholo/i, /snap\s+open/i],
    action: () => {
      window.open('https://www.snapchat.com/', '_blank');
      return 'Opening Snapchat!';
    }
  },

  // Twitter/X
  twitter: {
    patterns: [/open\s+twitter/i, /twitter\s+kholo/i, /twitter\s+open/i, /open\s+x/i, /x\s+kholo/i , /x\s+open/i],
    action: () => {
      window.open('https://twitter.com/', '_blank');
      return 'Opening Twitter!';
    }
  },

  // Gmail
  gmail: {
    patterns: [/open\s+gmail/i, /gmail\s+kholo/i, /gmail\s+open/i, /open\s+email/i, /email\s+kholo/i, /email\s+open/i],
    action: () => {
      window.open('https://mail.google.com/', '_blank');
      return 'Opening Gmail!';
    }
  },

  // TikTok
  tiktok: {
    patterns: [/open\s+tiktok/i, /tiktok\s+kholo/i,/tiktok\s+open/i],
    action: () => {
      window.open('https://www.tiktok.com/', '_blank');
      return 'Opening TikTok!';
    }
  },

  // LinkedIn
  linkedin: {
    patterns: [/open\s+linkedin/i, /linkedin\s+kholo/i, /linkedin\s+open/i],
    action: () => {
      window.open('https://www.linkedin.com/', '_blank');
      return 'Opening LinkedIn!';
    }
  },

  // Time
  time: {
    patterns: [/waqt\s+kya/i, /time\s+kya/i, /kitne\s+baje/i],
    action: () => {
      const now = new Date();
      return `Abhi ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} ho rahe hain.`;
    },
    keepAlive: true
  },

  // Date
  date: {
    patterns: [/aaj\s+ki\s+date/i, /aaj\s+kya\s+tarikh/i, /today\s+date/i],
    action: () => {
      const now = new Date();
      return `Aaj ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} hai.`;
    },
    keepAlive: true
  }
};


export function detectCommand(userInput) {
  const input = userInput.toLowerCase().trim();
  

  for (const [commandName, commandData] of Object.entries(commandPatterns)) {
    for (const pattern of commandData.patterns) {
      const match = input.match(pattern);
      if (match) {
        return {
          isCommand: true,
          commandName,
          response: commandData.action(match),
          shouldSpeak: true,
          keepAlive: commandData.keepAlive || false
        };
      }
    }
  }
  
 
  return {
    isCommand: false,
    commandName: null,
    response: null,
    shouldSpeak: false
  };
}
