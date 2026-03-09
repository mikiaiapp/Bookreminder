import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Loader2, ArrowRight } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 text-center">
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-8 max-w-md w-full">
          <p className="text-red-500 mb-4 font-mono uppercase text-xs">Token inválido o no proporcionado</p>
          <Link to="/login" className="text-[#F27D26] hover:underline font-bold text-xs uppercase tracking-widest">Ir al login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight uppercase text-[#E4E3E0] mb-2">Nueva Contraseña</h1>
          <p className="text-xs text-[#8E9299] font-mono uppercase">Introduce tu nueva contraseña</p>
        </div>

        {success ? (
          <div className="text-center">
            <p className="text-green-500 mb-4 font-mono uppercase text-xs">Contraseña actualizada con éxito</p>
            <p className="text-[#8E9299] text-xs">Redirigiendo al login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-950/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-xs font-mono uppercase text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono text-[#8E9299] uppercase tracking-widest mb-2">Nueva Contraseña</label>
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
              disabled={loading || password.length < 6}
              className="w-full bg-[#F27D26] hover:bg-[#FF8C37] text-black font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Actualizar Contraseña'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
