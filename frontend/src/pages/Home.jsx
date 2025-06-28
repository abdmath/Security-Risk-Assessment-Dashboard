import React, { useState } from "react";
import AuthForm from "../components/AuthForm";

export default function Home() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <AuthForm type={isRegister ? "register" : "login"} />
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="mt-4 text-blue-600 text-sm underline"
      >
        {isRegister ? "Already have an account? Login" : "New user? Register here"}
      </button>
    </div>
  );
}
