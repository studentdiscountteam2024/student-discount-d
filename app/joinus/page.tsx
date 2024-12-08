
"use client";
import React, { useState ,useEffect} from "react";
import {  GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc , getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {auth,db} from "../firebase"
import useAuth from "../hooks/useauth";
export const runtime = "edge";

const validateEmail = (email: string): boolean => {
  const academicEmailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)?(edu|ac\.in|college\.edu|university\.edu)$/;
  return academicEmailRegex.test(email);
};

const AuthPage: React.FC = () => {
  const user1 = auth.currentUser;
  const uid = user1?.uid;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading1, setloading1] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Email Verification, Step 2: Collect Details
  const { user, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!loading && user) {
      router.push("/checkout");
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="z-20 w-full h-full flex justify-center items-center mt-56">
        <img src="loading.svg" className="size-20" alt="loading1...." />
      </div>
    );
  const handleGoogleSignIn = async () => {
  
    setError(null);
    setloading1(true);
  
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Extract user1 email from Google
      const user1 = result.user;
      if (!user1.email || !validateEmail(user1.email)) {
        throw new Error(
          "Please use a valid academic email address (e.g., .edu or .ac.in)."
        );
      }
      setEmail(user1.email);
      const userRef = doc(db, "users", user1.email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        router.push("/checkout");
        return;
      }
      setStep(2);
    } catch (err: any) {
      setError(err.message || "An error occurred during Google Sign-In.");
    } finally {
      setloading1(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setloading1(true);

    try {
      const userDetails = {
        name,
        email,
        phone,
        college,
      };

      const userRef = doc(db, "users", email);
      await setDoc(userRef, userDetails);

      const response = await fetch(`https://student-discount.fk4460467.workers.dev/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name,uid,email,college,phone}),
      });
      if (!response.ok) {
        const errorData:any = await response.json();
        throw new Error(`Failed to save user1 to D1: ${errorData.message || "Unknown error"}`);
      }

      router.push("/checkout");
    } catch (err: any) {
      setError(err.message || "An error occurred during sign-up.");
    } finally {
      setloading1(false);
    }
  };

  return (
    <div className=" flex items-center justify-center h-screen bg-gray-50">
      <div className=" w-full max-w-md bg-white p-6 rounded-lg shadow-md mx-3 ">
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {step === 1 ? (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading1}
            className={`w-full py-3 text-white font-semibold  rounded-md transition ${
              loading1 ? "bg-gray-400" : "bg-blue-500"
            }`}
          >
            
            {loading1 ? "Verifying..." : (<h1 className="flex text-xl justify-center gap-2 items-center"><img src="google.png" alt="google" className="h-10 bg-white rounded-full p-1"/>Sign In with Google</h1>)}
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border rounded-md"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-md"
              disabled
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
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
  );
};

export default AuthPage;
