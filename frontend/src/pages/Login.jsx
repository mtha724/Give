import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import mapAuthError from '../utils/authErrors';

/**
 * Login component
 *
 * Manages local state for email/password inputs and handles the sign-in flow.
 * Shows simple success/error messages and navigates to /home on success.
 *
 * @component
 * @returns {JSX.Element} The rendered login page
 */
const Login = () => {
  // input state control for email & password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state for error/success messages
  const [message, setMessage] = useState({ text: "", type: "" }); // { text, type: 'error' | 'success' }
  const [isLoading, setIsLoading] = useState(false); // Handle loading state to prevent multiple submits

  const navigate = useNavigate();

  /**
   * Handle user sign-in and manage sign-out of any previous users.
   *
   * Flow:
   *  - Clears any existing messages.
   *  - If a different user is signed in, it signs them out.
   *  - Attempts Firebase signInWithEmailAndPassword.
   *  - On success, shows a brief success message and navigates to /home.
   *  - On failure, maps the error to a friendly message for display.
   *
   * @async
   * @function handleAuthFlow
   * @returns {Promise<void>}
   */
  const handleAuthFlow = async () => {
    try {
      // Clear any previous messages
      setMessage({ text: "", type: "" });
      setIsLoading(true);

      // If user is logged in with a different account, sign them out first
      if (auth.currentUser && auth.currentUser.email !== email) {
        await signOut(auth); // Sign out the previous user
      }

      // Attempt to sign in the user
      await signInWithEmailAndPassword(auth, email, password);
      setMessage({ text: "Logged in successfully!", type: "success" });

      // Redirect after a short delay to give feedback
      setTimeout(() => navigate("/home"), 400);
    } catch (err) {
      // Handle error by mapping the Firebase error to a user-friendly message
      setMessage({ text: mapAuthError(err), type: "error" });
    } finally {
      // Disable the loading state after the request completes
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-backgroundGrey font-[Nunito,Poppins,sans-serif]">
      {/* Left branding column */}
      <div className="w-[45%] flex justify-start items-center pl-[100px]">
        <div className="flex flex-col mb-[70px] ml-[25px] gap-1">
          <header>
            <h1 className="text-defaultYellow text-[7rem] uppercase m-0 text-left font-header">Give</h1>
          </header>
          <p className="text-defaultYellow text-2xl m-0 text-left">
            Can't decide? Let them vote.
          </p>
        </div>
      </div>

      {/* Right form column */}
      <div className="w-[45%] flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-[600px] flex flex-col gap-4 ml-12">
          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            className="bg-pink-50 text-black px-4 py-3 border border-backgroundGrey rounded-lg text-base outline-none focus:border-pink-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Bind email input
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            className="bg-pink-50 text-black px-4 py-3 border border-backgroundGrey rounded-lg text-base outline-none focus:border-pink-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Bind password input
          />

          {/* Error or success message */}
          {message.text && (
            <p className={`text-sm ${message.type === "error" ? "text-red-500" : "text-pink-400"}`}>
              {message.text} {/* Display user-friendly error or success message */}
            </p>
          )}

          {/* Primary login button */}
          <button
            className={`bg-pink-300 text-white py-3 rounded-lg text-lg hover:bg-pink-400 transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleAuthFlow} // Trigger sign-in flow
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Logging in..." : "Log In"} {/* Show loading text */}
          </button>

          {/* Navigate to create account page */}
          <button
            className="bg-defaultYellow text-white py-3 rounded-lg text-lg hover:bg-yellow-400 transition-colors"
            onClick={() => navigate("/create-account")}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
