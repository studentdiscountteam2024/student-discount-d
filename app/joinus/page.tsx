"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import useAuth from "../hooks/useauth";
export const runtime = "edge";

const validateEmail = (email: string): boolean => {
  const academicEmailRegex =
    /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)?(edu|ac\.in|college\.edu|university\.edu)$/;
  return academicEmailRegex.test(email);
};

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [rollno, setRollno] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Email Verification, Step 2: Google Sign-In, Step 3: Collect Details
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notAcademic, setNotAcademic] = useState(false);

  useEffect(() => {
    if (!loading && user && !user.emailVerified) {
      router.push("/checkout");
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="z-20 w-full h-full flex justify-center items-center mt-56">
        <img src="loading.svg" className="size-20" alt="loading1...." />
      </div>
    );

  const handleEmailVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please use a valid academic email address");
      return;
    }

    setStep(2); // Move to Google Sign-In step after successful email verification
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading1(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user1:any = result.user;
      if (notAcademic) {
        setEmail(user1.email);
      }
      const userRef = doc(db, "users", user1.email);
      const userDoc = await getDoc(userRef);

      if (user1.email !== email && !notAcademic) {
        throw new Error(
          "The authenticated email does not match the provided academic email."
        );
      }

      if (userDoc.exists()) {
        router.push("/checkout");
        return;
      }

      setStep(3); // Move to the details collection step
    } catch (err: any) {
      setError(err.message || "An error occurred during Google Sign-In.");
    } finally {
      setLoading1(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading1(true);

    try {
      const userDetails = {
        name,
        email,
        phone,
        college,
      };

      const userRef = doc(db, "users", email);
      await setDoc(userRef, userDetails);
      const rollNumber = notAcademic ? rollno : email.split("@")[0];
      const response = await fetch(
        `https://api.studentdiscountteam.workers.dev/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            uid: user?.uid,
            email,
            rollno: rollNumber,
            college,
            phone,
          }),
        }
      );

      if (!response.ok) {
        const errorData: any = await response.json();
        throw new Error(
          `Failed to save user to D1: ${errorData.message || "Unknown error"}`
        );
      }

      router.push("/checkout");
    } catch (err: any) {
      setError(err.message || "An error occurred during sign-up.");
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mx-3">
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          {step === 1 && (
            <form onSubmit={handleEmailVerification} className="space-y-4">
              <div className="flex justify-center items-center">
                <span
                  onClick={() => {
                    console.log("Not Academic");
                    setStep(2);
                    setNotAcademic(true);
                  }}
                  className="font-sm text-xs underline cursor-pointer"
                >
                  Don't have Academic Email
                </span>
              </div>
              <input
                type="email"
                placeholder="Enter your academic email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border rounded-md"
              />
              <button
                type="submit"
                className="w-full py-3 text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600"
              >
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <button
              onClick={handleGoogleSignIn}
              disabled={loading1}
              className={`w-full py-3 text-white font-semibold rounded-md transition ${
                loading1 ? "bg-gray-400" : "bg-blue-500"
              }`}
            >
              {loading1 ? (
                "Verifying..."
              ) : (
                <h1 className="flex text-xl justify-center gap-2 items-center">
                  <img
                    src="google.png"
                    alt="google"
                    className="h-10 bg-white rounded-full p-1"
                  />
                  Sign In with Google
                </h1>
              )}
            </button>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border rounded-md"
              />
              {notAcademic && (
                <input
                  type="text"
                  placeholder="Enter your Roll Number"
                  value={rollno}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setRollno(value);
                    }
                  }}
                  required
                  className="w-full p-3 border rounded-md"
                />
              )}

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setPhone(value);
                  }
                }}
                onBlur={() => {
                  if (phone.length !== 10) {
                    alert("Phone number must be exactly 10 digits long.");
                  }
                }}
                required
                pattern="\d{10}"
                maxLength={10}
                className="w-full p-3 border rounded-md"
              />

              <input
                type="text"
                placeholder="College Name"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
                className="w-full p-3 border rounded-md"
              />

              <button
                type="submit"
                disabled={loading1}
                className={`w-full py-3 text-white font-semibold rounded-md transition ${
                  loading1 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {loading1 ? "Saving..." : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
