import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

export default function Setup2FA({ onComplete }: { onComplete: () => void }) {
  const { token, user, login } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSetup = async () => {
      const res = await fetch('/api/auth/2fa/setup', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setQrCode(data.qrCodeUrl);
      setSecret(data.secret);
    };
    fetchSetup();
  }, [token]);

  const handleEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ token: totpToken })
      });
      
      if (res.ok) {
        if (user) {
          login(token!, { ...user, is_totp_enabled: true });
        }
        onComplete();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-8 max-w-md mx-auto mt-12">
      <div className="flex items-center justify-center gap-3 mb-6">
        <ShieldCheck className="text-[#F27D26] w-8 h-8" />
        <h2 className="text-xl font-bold tracking-tight uppercase text-[#E4E3E0]">Configurar 2FA</h2>
      </div>

      <p className="text-sm text-[#8E9299] mb-6 text-center">
        Escanea este código QR con tu aplicación Authenticator (Google Authenticator, Authy, etc.)
      </p>

      {qrCode ? (
        <div className="flex justify-center mb-6 bg-white p-4 rounded-xl w-fit mx-auto">
          <img src={qrCode} alt="QR Code" className="w-48 h-48" />
        </div>
      ) : (
        <div className="flex justify-center mb-6 h-48 items-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#F27D26]" />
        </div>
      )}

      <div className="mb-6 text-center">
        <p className="text-[10px] font-mono text-[#8E9299] uppercase tracking-widest mb-1">Clave secreta manual</p>
        <code className="bg-[#141414] px-3 py-1 rounded text-[#F27D26] text-xs font-mono">{secret}</code>
      </div>

      <form onSubmit={handleEnable} className="space-y-4">
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-xs font-mono uppercase text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-[10px] font-mono text-[#8E9299] uppercase tracking-widest mb-2 text-center">Introduce el código de 6 dígitos</label>
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

        <button
          type="submit"
          disabled={loading || totpToken.length !== 6}
          className="w-full bg-[#F27D26] hover:bg-[#FF8C37] text-black font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activar 2FA'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
