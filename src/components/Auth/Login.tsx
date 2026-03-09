import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Book, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [require2FA, setRequire2FA] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (require2FA) {
        const res = await fetch('/api/auth/verify-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, totpToken })
        });
        const data = await res.json();
        if (res.ok) {
          login(data.token, data.user);
          navigate('/');
        } else {
          setError(data.error);
        }
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          if (data.require2FA) {
            setRequire2FA(true);
            setUserId(data.userId);
          } else {
            login(data.token, data.user);
            navigate('/');
          }
        } else {
          setError(data.error);
        }
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.error || 'Error al crear sesión de invitado');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#F27D26] rounded-xl flex items-center justify-center">
            <Book className="text-black w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight uppercase text-[#E4E3E0]">Bookreminder</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-950/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-xs font-mono uppercase text-center">
              {error}
            </div>
          )}

          {!require2FA ? (
            <>
              <div>
                <label className="block text-[10px] font-mono text-[#8E9299] uppercase tracking-widest mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#F27D26] transition-colors text-[#E4E3E0]"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-mono text-[#8E9299] uppercase tracking-widest">Contraseña</label>
                  <Link to="/forgot-password" className="text-[10px] text-[#F27D26] hover:underline font-mono uppercase">¿Olvidaste tu contraseña?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#141414] border border-[#1A1A1A] rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#F27D26] transition-colors text-[#E4E3E0]"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[10px] font-mono text-[#8E9299] uppercase tracking-widest mb-2">Código 2FA (Authenticator)</label>
              <input
                type="text"
                required
                value={totpToken}
                onChange={(e) => setTotpToken(e.target.value)}
                className="w-full bg-[#141414] border border-[#1A1A1A] rounded-lg py-3 px-4 text-center tracking-[0.5em] font-mono focus:outline-none focus:border-[#F27D26] transition-colors text-[#E4E3E0]"
                placeholder="000000"
                maxLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F27D26] hover:bg-[#FF8C37] text-black font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : require2FA ? 'Verificar' : 'Entrar'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {!require2FA && (
          <div className="mt-4">
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-[#1A1A1A]"></div>
              <span className="flex-shrink-0 mx-4 text-[#555] text-[10px] font-mono uppercase">O</span>
              <div className="flex-grow border-t border-[#1A1A1A]"></div>
            </div>
            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full bg-transparent border border-[#333] hover:border-[#F27D26] hover:text-[#F27D26] text-[#E4E3E0] font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Probar como Invitado
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-[#8E9299]">
            ¿No tienes cuenta? <Link to="/register" className="text-[#F27D26] hover:underline font-bold">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
