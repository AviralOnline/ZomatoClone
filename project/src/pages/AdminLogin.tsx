import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface AdminLoginProps {
  onAuth: (user: any, token: string) => void;
}

export default function AdminLogin({ onAuth }: AdminLoginProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: identifier,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      if (!data.user || !data.user.isAdmin) {
        throw new Error('Access Denied. Strictly restricted to Administrator accounts.');
      }

      onAuth(data.user, data.token);
      navigate('/admin-dashboard');
    } catch (err: any) {
      console.error('Admin Login Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />

      <div className="w-full max-w-md p-8 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 mb-4 animate-pulse">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Zamato Back-Office
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Restricted Admin access control console
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Admin Identifier / Email
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-red-500/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500/50 text-slate-100 transition-colors placeholder-slate-600 text-sm"
                placeholder="e.g. admin@zomato.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-red-500/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500/50 text-slate-100 transition-colors placeholder-slate-600 text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Authenticate Securely</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-8">
          Authorized personnel only. All access attempts are logged.
        </p>
      </div>
    </div>
  );
}
