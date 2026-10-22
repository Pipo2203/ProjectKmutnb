"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          prompt: "select_account",
          hd: "email.kmutnb.ac.th", // แนะนำให้ Google กรองโดเมนนี้
        },
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center font-bold text-white text-2xl mb-6 shadow-md shadow-blue-200">
          QA
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Course FAQ System
        </h2>
        <p className="text-sm text-slate-500 mb-8 text-center">
          เข้าสู่ระบบด้วยอีเมลมหาวิทยาลัย
          <br />
          (@email.kmutnb.ac.th)
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {loading ? "กำลังเชื่อมต่อ..." : "เข้าสู่ระบบด้วย Google"}
        </button>
      </div>
    </div>
  );
}
