import { useState } from 'react';

interface LoginScreenProps {
  onLogin: (firstName: string, lastName: string) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        onLogin(firstName.trim(), lastName.trim());
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      </div>

      {/* Steel Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 shadow-2xl border-2 border-zinc-600 mb-6">
            <span className="text-5xl font-black text-white">Σ</span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">سيجما تراكير</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest font-medium">صمم نفسك - 90 يوم</p>
        </div>

        {/* Login Form - Steel Card */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-3xl border-2 border-zinc-700 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">🚀 ابدأ رحلتك</h2>
            <p className="text-zinc-500 text-sm">سجل بياناتك للانطلاق</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-zinc-400 text-sm font-bold uppercase tracking-wider mb-3">
                الاسم الأول
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="مثال: أحمد"
                className="w-full bg-zinc-800/50 border-2 border-zinc-700 rounded-xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 transition-all text-right font-medium"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-zinc-400 text-sm font-bold uppercase tracking-wider mb-3">
                اللقب
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="مثال: المسلم"
                className="w-full bg-zinc-800/50 border-2 border-zinc-700 rounded-xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 transition-all text-right font-medium"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !firstName.trim() || !lastName.trim()}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-wider text-lg transition-all shadow-lg ${
                isSubmitting || !firstName.trim() || !lastName.trim()
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 to-red-700 text-white hover:from-orange-500 hover:to-red-600 shadow-orange-900/50 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  جاري البدء...
                </span>
              ) : (
                'ابدأ الآن'
              )}
            </button>
          </form>

          {/* Quote */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-zinc-500 text-sm text-center italic">
              "الإنسان الذي لديه هدف يسير إليه بقوة لا يتوقف"
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-zinc-600 text-xs text-center mt-6 uppercase tracking-widest">
          🐺 الذئب الوحيد يسير بسرعة
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
