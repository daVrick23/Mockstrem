import React, { useState } from "react";

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  // Auth states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password states
  const [step, setStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ============================================
  // AUTH SUBMIT
  // ============================================
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      console.log("Register:", { username, email, password });
    } else {
      console.log("Login:", { email, password });
    }
  };

  // ============================================
  // FORGOT PASSWORD FLOW
  // ============================================
  const handleCheckEmail = (e) => {
    e.preventDefault();

    // Backend bo‘lmagani uchun oddiy shart
    if (!resetEmail.includes("@")) {
      alert("Email not found!");
      return;
    }

    // 5 xonali random kod
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    setGeneratedCode(code);

    alert("5 xonali kod emailga yuborildi (fake): " + code);

    setStep(2);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();

    if (resetCode === generatedCode) {
      setStep(3);
    } else {
      alert("Kod noto‘g‘ri!");
    }
  };

  const handleNewPassword = (e) => {
    e.preventDefault();

    if (newPassword.length < 5) {
      alert("Parol juda qisqa!");
      return;
    }

    alert("Parol o‘zgartirildi! Endi login qiling.");

    // Reset everything
    setIsForgot(false);
    setStep(1);
    setResetEmail("");
    setResetCode("");
    setNewPassword("");
  };

  // ============================================
  // UI: FORGOT PASSWORD FORMS
  // ============================================
  const renderForgotBox = () => {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md transition-all duration-500">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
          Forgot Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleCheckEmail} className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <button
              type="submit"
              className="px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition-all"
            >
              Send Code
            </button>

            <p
              className="text-blue-500 text-center cursor-pointer"
              onClick={() => setIsForgot(false)}
            >
              Back to login
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Enter 5-digit code"
              maxLength={5}
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="px-4 py-3 border rounded-xl text-center text-lg tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <button
              type="submit"
              className="px-4 py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all"
            >
              Verify Code
            </button>

            <p
              className="text-blue-500 text-center cursor-pointer"
              onClick={() => setStep(1)}
            >
              Back
            </p>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleNewPassword} className="flex flex-col gap-5">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <button
              type="submit"
              className="px-4 py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all"
            >
              Save Password
            </button>

            <p
              className="text-blue-500 text-center cursor-pointer"
              onClick={() => setIsForgot(false)}
            >
              Back to login
            </p>
          </form>
        )}
      </div>
    );
  };

  // ============================================
  // MAIN AUTH UI
  // ============================================
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-cyan-500 px-4">
      <title>MockStream: Auth</title>

      {/* Forgot screen */}
      {isForgot ? (
        renderForgotBox()
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md transition-all duration-500">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
            {isRegister ? "Register" : "Login"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isRegister && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition-all duration-300"
            >
              {isRegister ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center text-slate-500 mt-4">
            {!isRegister && (
              <span
                className="text-blue-600 cursor-pointer hover:text-blue-900 transition"
                onClick={() => {
                  setIsForgot(true);
                  setStep(1);
                }}
              >
                Forgot password?
                <br />
                <br />
              </span>
            )}

            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <span
              className="text-blue-500 cursor-pointer font-semibold"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
