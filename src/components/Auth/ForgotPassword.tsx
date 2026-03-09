import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight uppercase text-[#E4E3E0] mb-2">Recuperar Contraseña</h1>
          <p className="text-xs text-[#8E9299] font-mono uppercase">Te enviaremos un enlace para restablecerla</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-950/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm text-[#E4E3E0] mb-6">Si el email existe en nuestro sistema, recibirás un enlace en breve.</p>
            <Link to="/login" className="text-[#F27D26] hover:underline font-bold text-xs uppercase tracking-widest">Volver al login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-[#F27D26] hover:bg-[#FF8C37] text-black font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar Enlace'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-8 text-center">
            <Link to="/login" className="text-[#8E9299] hover:text-[#E4E3E0] font-bold text-xs uppercase tracking-widest transition-colors">
              Volver al login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
