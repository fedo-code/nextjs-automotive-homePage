"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminPanelClient from "./AdminPanelClient";

async function requestAuth(endpoint, payload) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const raw = await response.text();
    let data = {};

    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = {};
      }
    }

    if (!response.ok) {
      return {
        ok: false,
        error: data?.error || `Request failed (${response.status}).`,
      };
    }

    return { ok: true, data };
  } catch {
    return { ok: false, error: "Unable to connect to server." };
  }
}

export default function AdminAccessClient({ initialAdmin, initialIsAdmin }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(Boolean(initialIsAdmin));
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(
    searchParams.get("session") === "expired"
      ? "Your admin session timed out. Please login again."
      : ""
  );
  const [form, setForm] = useState({ name: "", email: initialAdmin?.email || "", password: "" });

  if (isAdmin) {
    return <AdminPanelClient initialAdmin={initialAdmin || null} />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (mode === "register" && !form.name.trim()) {
      setError("Name is required for registration.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "register" ? "/api/admin/register" : "/api/admin/login";
      const authResult = await requestAuth(endpoint, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (!authResult.ok) {
        setError(authResult.error || "Authentication failed.");
        return;
      }

      if (mode === "register") {
        setNotice("Registration successful. Login with your admin account.");
        setMode("login");
        setForm((previous) => ({ ...previous, password: "" }));
        return;
      }

      const loginData = authResult.data || {};

      if (loginData?.admin || loginData?.user?.isAdmin) {
        setIsAdmin(true);
        router.refresh();
        return;
      }

      const meCandidates = ["/api/admin/me", "/api/auth/me"];
      let verifiedAdmin = false;

      for (const endpoint of meCandidates) {
        const meResponse = await fetch(endpoint, {
          credentials: "include",
          cache: "no-store",
        });

        if (meResponse.status === 404) {
          continue;
        }

        const mePayload = meResponse.ok ? await meResponse.json() : null;

        if (mePayload?.admin || mePayload?.user?.isAdmin) {
          verifiedAdmin = true;
          break;
        }
      }

      if (!verifiedAdmin) {
        setError("Login succeeded, but no admin profile was found.");
        return;
      }

      setIsAdmin(true);
      router.refresh();
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setError("");
    setNotice("");

    await fetch("/api/admin/logout", { method: "POST", credentials: "include" }).catch(() => null);
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => null);

    setForm({ name: "", email: "", password: "" });
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-12">
        <div className="w-full rounded-3xl border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/40">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Admin Access</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Sign in to open /admin</h1>
          <p className="mt-2 text-sm text-zinc-300">
            {initialAdmin
              ? "Current session is not an admin account. Sign in with an admin account."
              : "Use an admin account to access the admin panel."}
          </p>

          {initialAdmin && (
            <div className="mt-4 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-200">
              Signed in as: {initialAdmin.email} ({initialAdmin.role || "admin"})
              <button
                type="button"
                onClick={handleLogout}
                className="ml-3 rounded-full border border-white/20 px-3 py-1 text-xs hover:border-red-300 hover:text-red-200"
              >
                Logout
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {notice && (
            <div className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {notice}
            </div>
          )}

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                mode === "login"
                  ? "bg-amber-400 text-black"
                  : "border border-white/20 text-zinc-200 hover:border-amber-300"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                mode === "register"
                  ? "bg-amber-400 text-black"
                  : "border border-white/20 text-zinc-200 hover:border-amber-300"
              }`}
            >
              Register
            </button>
          </div>

          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            {mode === "register" && (
              <input
                value={form.name}
                onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                placeholder="Name"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
            )}
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
              placeholder="Email"
              className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
            />
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))}
              placeholder="Password"
              className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Login as Admin" : "Register"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
