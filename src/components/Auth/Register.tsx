import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Book, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login', { state: { message: 'Registro exitoso. Por favor, inicia sesión.' } });
      } else {
        setError(data.error);
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
          <h1 className="text-2xl font-bold tracking-tight uppercase text-[#E4E3E0]">Registro</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-950/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-xs font-mono uppercase text-center">
              {error}
            </div>
          )}

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
            <label className="block text-[10px] font-mono text-[#8E9299] uppercase tracking-widest mb-2">Contraseña</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F27D26] hover:bg-[#FF8C37] text-black font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Cuenta'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#8E9299]">
            ¿Ya tienes cuenta? <Link to="/login" className="text-[#F27D26] hover:underline font-bold">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
