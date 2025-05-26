// src/components/TawkToChat.jsx
import { useEffect } from "react";

const TawkToChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/6629d4e51ec1082f04e6a9c3/1hrlgfkd5";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      // Xoá script nếu unmount
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default TawkToChat;
