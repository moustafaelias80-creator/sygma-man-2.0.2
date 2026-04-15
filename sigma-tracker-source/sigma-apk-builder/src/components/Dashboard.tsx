import { useState, useEffect } from 'react';
import { UserStats, DayData, UserProfile } from '../App';

interface DashboardProps {
  userStats: UserStats;
  currentDay: DayData | null;
  dayHistory: DayData[];
  userProfile: UserProfile | null;
}

const Dashboard = ({ userStats, currentDay, dayHistory, userProfile }: DashboardProps) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const quotes = [
    { text: 'الإنسان الذي لديه هدف يسير إليه بقوة لا يتوقف', emoji: '🎯' },
    { text: 'لا تنتظر الفرصة، بل اصنعها', emoji: '⚡' },
    { text: 'الفرق بين النجاح والفشل هو الانضباط', emoji: '💪' },
    { text: 'كل يوم جديد هو فرصة جديدة لتكون أفضل', emoji: '🌅' },
    { text: 'الصبر مفتاح الفرج', emoji: '🔑' },
    { text: 'لا تستسلم، فالبدايات دائماً صعبة', emoji: '🔥' },
    { text: 'ثق بالله ثم بنفسك', emoji: '🤲' },
    { text: 'العمل الصامت أبلغ من الكلام', emoji: '📿' },
    { text: 'المستقبل للذين يسعون إليه', emoji: '🚀' },
    { text: 'لا تقارن نفسك بغيرك، قارن نفسك بالأمس', emoji: '📊' },
    { text: 'البداية هي أصعب خطوة', emoji: '👣' },
    { text: 'الذكاء الحقيقي هو الانضباط', emoji: '🧠' },
    { text: 'كل خطوة صغيرة تقربك من الهدف', emoji: '👟' },
    { text: 'النجاح ليس نهاية، والفشل ليس كارثة', emoji: '⚖️' },
    { text: 'الطريق طويل، لكن كل خطوة مهمة', emoji: '🛤️' },
  ];

  const currentQuote = quotes[quoteIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setIsAnimating(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const completionPercentage = currentDay
    ? Math.round((currentDay.tasks.filter(t => t.completed).length / currentDay.tasks.length) * 100)
    : 0;

  const spiritualTasks = currentDay?.tasks.filter(t => t.category === 'spiritual') || [];
  const physicalTasks = currentDay?.tasks.filter(t => t.category === 'physical') || [];
  const mentalTasks = currentDay?.tasks.filter(t => t.category === 'mental') || [];
  const socialTasks = currentDay?.tasks.filter(t => t.category === 'social') || [];

  const spiritualCompleted = spiritualTasks.filter(t => t.completed).length;
  const physicalCompleted = physicalTasks.filter(t => t.completed).length;
  const mentalCompleted = mentalTasks.filter(t => t.completed).length;
  const socialCompleted = socialTasks.filter(t => t.completed).length;

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 5) return { greeting: 'ساعات السحر', icon: '🌙', message: 'وقت الدعاء والذكر' };
    if (hour < 12) return { greeting: 'صباح النور', icon: '☀️', message: 'ابدأ يومك بقوة' };
    if (hour < 17) return { greeting: 'مساء الإصرار', icon: '🌤️', message: 'استمر في الطريق' };
    if (hour < 20) return { greeting: 'مساء الخير', icon: '🌅', message: 'حصّل إنجازاتك' };
    return { greeting: 'أمسية مباركة', icon: '🌙', message: 'جهّز ليوم الغد' };
  };

  const timeInfo = getTimeOfDay();
  const recentDays = dayHistory.slice(-7);

  return (
    <div className="space-y-8">
      {/* Hero Section with Muscular Man */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-2xl border-2 border-zinc-700 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 6px)'
          }} />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Muscular Man Image */}
        <div className="relative h-48 sm:h-64 md:h-72 flex items-end justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/20 to-orange-600/30" />
          <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
            alt="Strong Man"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 w-full p-6 sm:p-8 text-center">
            <p className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-2">{timeInfo.greeting}</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              {userProfile?.firstName} {userProfile?.lastName}
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg font-medium mb-4">{timeInfo.message}</p>

            {/* Steel Accent Line */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent to-orange-600 rounded-full" />
              <span className="text-2xl">{timeInfo.icon}</span>
              <div className="h-1 w-12 bg-gradient-to-l from-transparent to-orange-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Animated Quote Section */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-orange-600 to-red-700" />
        <div className={`relative transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">{currentQuote.emoji}</span>
              <div className="flex gap-1">
                {quotes.slice(0, 5).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === quoteIndex % 5 ? 'bg-orange-500 w-4' : 'bg-zinc-700 w-1'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-lg leading-relaxed">{currentQuote.text}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-zinc-500 text-sm">— تذكّر لماذا بدأت</p>
                <span className="text-xs text-zinc-600 uppercase tracking-wider">يتغير كل 10 ثوانٍ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Steel Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700 p-5 relative overflow-hidden group hover:border-yellow-600 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-600" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-sm">النقاط</span>
          </div>
          <p className="text-4xl font-black text-white tabular-nums">{userStats.totalPoints}</p>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-wider">نقطة مجمّعة</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700 p-5 relative overflow-hidden group hover:border-red-600 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-700" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔥</span>
            </div>
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-sm">السلسلة</span>
          </div>
          <p className="text-4xl font-black text-white tabular-nums">{userStats.currentStreak}</p>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-wider">يوم متتالي</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700 p-5 relative overflow-hidden group hover:border-green-600 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-emerald-700" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-2xl">✅</span>
            </div>
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-sm">مكتملة</span>
          </div>
          <p className="text-4xl font-black text-white tabular-nums">{userStats.perfectDays}</p>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-wider">يوم مثالي</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700 p-5 relative overflow-hidden group hover:border-blue-600 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-700" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏆</span>
            </div>
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-sm">المستوى</span>
          </div>
          <p className="text-4xl font-black text-white tabular-nums">{userStats.level}</p>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-wider">مستوى {userStats.level}</p>
        </div>
      </div>

      {/* Today's Progress - Steel Panel */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <span>📊</span>
            <span>تقدم اليوم</span>
          </h3>
          <span className="text-sm text-zinc-500 uppercase tracking-wider">اليوم {currentDay?.dayNumber || 1}</span>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400 uppercase tracking-wider text-sm font-bold">نسبة الإنجاز</span>
            <span className="text-3xl font-black text-white tabular-nums">{completionPercentage}%</span>
          </div>
          <div className="h-5 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 rounded-lg transition-all duration-1000 relative"
              style={{ width: `${completionPercentage}%` }}
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-white/40" />
            </div>
          </div>
          <p className="text-zinc-500 text-sm mt-3 uppercase tracking-wider">
            {currentDay?.tasks.filter(t => t.completed).length || 0} من {currentDay?.tasks.length || 0} مهمة
          </p>
        </div>

        {/* Category Progress - Steel Bars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🕌</span>
              <span className="text-zinc-400 text-xs sm:text-sm font-bold uppercase tracking-wider">العبادة</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {spiritualCompleted}/{spiritualTasks.length}
            </p>
            <div className="h-2 bg-zinc-700 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                style={{ width: `${spiritualTasks.length > 0 ? (spiritualCompleted / spiritualTasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💪</span>
              <span className="text-zinc-400 text-xs sm:text-sm font-bold uppercase tracking-wider">الجسد</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {physicalCompleted}/{physicalTasks.length}
            </p>
            <div className="h-2 bg-zinc-700 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                style={{ width: `${physicalTasks.length > 0 ? (physicalCompleted / physicalTasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🧠</span>
              <span className="text-zinc-400 text-xs sm:text-sm font-bold uppercase tracking-wider">العقل</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {mentalCompleted}/{mentalTasks.length}
            </p>
            <div className="h-2 bg-zinc-700 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                style={{ width: `${mentalTasks.length > 0 ? (mentalCompleted / mentalTasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🤝</span>
              <span className="text-zinc-400 text-xs sm:text-sm font-bold uppercase tracking-wider">اجتماعي</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {socialCompleted}/{socialTasks.length}
            </p>
            <div className="h-2 bg-zinc-700 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
                style={{ width: `${socialTasks.length > 0 ? (socialCompleted / socialTasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Steel Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border border-zinc-700 p-6">
          <h4 className="text-zinc-400 text-sm mb-5 font-bold uppercase tracking-wider flex items-center gap-2">
            <span>📈</span>
            <span>إحصائيات</span>
          </h4>
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 uppercase tracking-wider text-sm">أطول سلسلة</span>
              <span className="font-black text-white text-lg tabular-nums">{userStats.longestStreak} يوم</span>
            </div>
            <div className="h-px bg-zinc-800" />
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 uppercase tracking-wider text-sm">المهام المنجزة</span>
              <span className="font-black text-green-500 text-lg tabular-nums">{userStats.completedTasks}</span>
            </div>
            <div className="h-px bg-zinc-800" />
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 uppercase tracking-wider text-sm">المهام الفائتة</span>
              <span className="font-black text-red-500 text-lg tabular-nums">{userStats.missedTasks}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border border-zinc-700 p-6">
          <h4 className="text-zinc-400 text-sm mb-5 font-bold uppercase tracking-wider flex items-center gap-2">
            <span>📅</span>
            <span>آخر 7 أيام</span>
          </h4>
          <div className="flex items-end gap-2 sm:gap-3 h-20 sm:h-24">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = recentDays[recentDays.length - 7 + i];
              const height = day ? Math.max((day.tasks.filter(t => t.completed).length / day.tasks.length) * 100, 10) : 10;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      day?.completed
                        ? 'bg-gradient-to-t from-yellow-500 to-orange-500'
                        : day
                          ? 'bg-gradient-to-t from-zinc-600 to-zinc-500'
                          : 'bg-zinc-800'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-zinc-600 uppercase tracking-wider">
                    {day ? `ي${i + 1}` : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Day Points - Steel Plate */}
      {currentDay && (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6 sm:p-8">
          <h4 className="text-lg font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span>💰</span>
            <span>نقاط اليوم</span>
          </h4>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="bg-green-900/20 rounded-xl p-4 sm:p-5 border border-green-800">
              <p className="text-3xl sm:text-4xl font-black text-green-500 tabular-nums">+{currentDay.tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0)}</p>
              <p className="text-green-500/60 text-xs sm:text-sm uppercase tracking-wider mt-2">النقاط المكتسبة</p>
            </div>
            <div className="bg-red-900/20 rounded-xl p-4 sm:p-5 border border-red-800">
              <p className="text-3xl sm:text-4xl font-black text-red-500 tabular-nums">-{currentDay.deductions}</p>
              <p className="text-red-500/60 text-xs sm:text-sm uppercase tracking-wider mt-2">الخصومات</p>
            </div>
            <div className="bg-orange-900/20 rounded-xl p-4 sm:p-5 border border-orange-800">
              <p className="text-3xl sm:text-4xl font-black text-orange-500 tabular-nums">{currentDay.totalPoints + currentDay.bonusPoints}</p>
              <p className="text-orange-500/60 text-xs sm:text-sm uppercase tracking-wider mt-2">صافي اليوم</p>
            </div>
          </div>
          {currentDay.bonusPoints > 0 && (
            <div className="mt-6 bg-yellow-900/20 rounded-xl p-5 border border-yellow-700 text-center">
              <span className="text-yellow-500 font-black text-lg sm:text-xl">🏆 +{currentDay.bonusPoints} نقطة مكافأة!</span>
            </div>
          )}
        </div>
      )}

      {/* Motivational Banner */}
      <div className="bg-gradient-to-br from-orange-900/30 via-red-900/20 to-black rounded-xl border-2 border-orange-800 p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

        <div className="relative">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-orange-600" />
            <span className="text-4xl">💪</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-orange-600" />
          </div>
          <p className="text-white font-black text-xl sm:text-2xl uppercase tracking-widest">
            90 يوم تغيّر حياتك!
          </p>
          <p className="text-orange-400/80 text-sm mt-3 uppercase tracking-wider">
            كل يوم جديد أقرب إلى هدفك
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
