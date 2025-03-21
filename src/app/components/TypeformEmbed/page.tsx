"use client"
import { useEffect } from "react";

const TypeformEmbed = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div data-tf-live="01JPX97X04607Y7BRNN3QMS2FE" className="w-full h-screen"></div>
  );
};

export default TypeformEmbed;
