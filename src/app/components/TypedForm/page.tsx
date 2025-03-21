"use client"
import React from "react";
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
    <div data-tf-live="01JPX4MN9Y21BYNHXB5KQQ9E0R" ></div>
  );
};

export default TypeformEmbed;
