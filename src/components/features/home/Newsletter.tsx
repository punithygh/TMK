'use client';
import { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      // ✅ Call the Django API endpoint
      await api.post('/newsletter/subscribe/', {
        email: email.trim().toLowerCase()
      });
      
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error('Newsletter subscribe error:', err);
      // Handle duplicate email gracefully (Django typically returns 400 for unique constraints)
      if (err.response?.status === 400 || err.response?.data?.email) {
        setErrorMsg(t('ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಆಗಿದೆ.', 'This email is already subscribed.'));
        setStatus('error');
      } else {
        setErrorMsg(t('ಏನೋ ತಪ್ಪಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.', 'Something went wrong. Please try again.'));
        setStatus('error');
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0c1220] to-slate-900 border-t border-b border-slate-800 py-16 px-4 md:px-[5%]">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/5 dark:bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Icon */}
        <div className="w-16 h-16 bg-red-600/10 dark:bg-sky-500/10 border border-red-600/20 dark:border-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(220,38,38,0.1)] dark:shadow-[0_0_30px_rgba(14,165,233,0.1)]">
          <Mail className="text-red-600 dark:text-sky-400" size={28} />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
          {t('ತುಮಕೂರಿನ ಹೊಸ ವಿಷಯ ತಿಳಿಯಿರಿ', 'Stay Updated with Tumkur')}
        </h2>
        <p className="text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto">
          {t(
            'ಹೊಸ ಬ್ಯುಸಿನೆಸ್‌ಗಳು, ಆಫರ್‌ಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಸುದ್ದಿ ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ಬರಲಿ.',
            'Get the latest local business updates, exclusive deals, and news delivered to your inbox.'
          )}
        </p>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="text-emerald-500" size={36} />
            </div>
            <p className="text-emerald-400 font-bold text-lg">
              {t('ಧನ್ಯವಾದ! ನೀವು ಸಫಲವಾಗಿ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಆಗಿದ್ದೀರಿ.', 'Thank you! You\'ve successfully subscribed.')}
            </p>
            <p className="text-slate-400 text-sm">{t('ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ಅಪ್‌ಡೇಟ್‌ಗಳು ಬರಲಿದ್ದಾವೆ.', 'Updates will arrive in your inbox soon.')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ...', 'Enter your email address...')}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-red-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-red-500/20 dark:focus:ring-sky-500/20 transition-all font-medium"
                required
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 dark:bg-sky-500 text-white font-bold hover:bg-red-700 dark:hover:bg-sky-400 transition-all shadow-lg shadow-red-600/25 dark:shadow-sky-500/25 active:scale-95 disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap"
            >
              {status === 'loading' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {t('ಸಬ್‌ಸ್ಕ್ರೈಬ್', 'Subscribe')}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {status === 'error' && errorMsg && (
          <p className="mt-3 text-red-400 text-sm font-medium animate-in fade-in">{errorMsg}</p>
        )}

        <p className="text-slate-600 text-xs mt-5">
          {t('ನಾವು ಸ್ಪ್ಯಾಮ್ ಕಳುಹಿಸುವುದಿಲ್ಲ. ಯಾವಾಗ ಬೇಕಾದರೂ ಅನ್‌ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಬಹುದು.', 'No spam. Unsubscribe at any time.')}
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
