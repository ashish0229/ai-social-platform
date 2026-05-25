"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function LoginForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const result = await api<{ accessToken: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form)
    });
    localStorage.setItem("accessToken", result.accessToken);
    setMessage("Signed in");
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-brand text-xl font-black text-white">AI</div>
        <h1 className="text-2xl font-semibold">AI Social</h1>
      </div>
      <label className="mb-3 block text-sm font-medium">
        Username
        <input className="mt-1 w-full rounded-md border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
      </label>
      <label className="mb-3 block text-sm font-medium">
        Email
        <input type="email" className="mt-1 w-full rounded-md border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      </label>
      <label className="mb-5 block text-sm font-medium">
        Password
        <input type="password" className="mt-1 w-full rounded-md border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
      </label>
      <button className="w-full rounded-md bg-brand px-4 py-3 font-semibold text-white transition hover:bg-teal-800">Login</button>
      {message && <p className="mt-3 text-sm text-brand">{message}</p>}
    </form>
  );
}

