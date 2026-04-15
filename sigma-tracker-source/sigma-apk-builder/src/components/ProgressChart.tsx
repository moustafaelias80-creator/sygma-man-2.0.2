import { DayData } from '../App';

interface ProgressChartProps {
  dayHistory: DayData[];
}

const ProgressChart = ({ dayHistory }: ProgressChartProps) => {
  const last30Days = dayHistory.slice(-30);
  const last7Days = dayHistory.slice(-7);

  const getMaxPoints = () => {
    return Math.max(
      ...last30Days.map(d => d.totalPoints + d.bonusPoints),
      100
    );
  };

  const getWeeklyAverage = () => {
    if (last7Days.length === 0) return 0;
    const total = last7Days.reduce((sum, d) => sum + d.totalPoints + d.bonusPoints, 0);
    return Math.round(total / last7Days.length);
  };

  const getCompletionRate = () => {
    if (last7Days.length === 0) return 0;
    const totalTasks = last7Days.reduce((sum, d) => sum + d.tasks.length, 0);
    const completedTasks = last7Days.reduce((sum, d) => sum + d.tasks.filter(t => t.completed).length, 0);
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getDayLabel = (day: DayData) => {
    const date = new Date(day.date);
    return date.toLocaleDateString('ar-SA', { weekday: 'short' });
  };

  const perfectDaysCount = dayHistory.filter(d => d.completed).length;
  const totalPointsEarned = dayHistory.reduce((sum, d) => sum + d.totalPoints + d.bonusPoints, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats - Steel Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📊</span>
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-sm">المتوسط</span>
          </div>
          <p className="text-3xl font-black text-yellow-500 tabular-nums">{getWeeklyAverage()}</p>
          <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">نقطة/يوم</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">✅</span>
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-sm">نسبة الإنجاز</span>
          </div>
          <p className="text-3xl font-black text-green-500 tabular-nums">{getCompletionRate()}%</p>
          <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">آخر 7 أيام</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🏆</span>
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-sm">الأيام المثالية</span>
          </div>
          <p className="text-3xl font-black text-blue-500 tabular-nums">{perfectDaysCount}</p>
          <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">يوم كامل</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💎</span>
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-sm">إجمالي النقاط</span>
          </div>
          <p className="text-3xl font-black text-purple-500 tabular-nums">{totalPointsEarned}</p>
          <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">نقطة</p>
        </div>
      </div>

      {/* Last 7 Days Chart - Steel Panel */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6">
        <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <span>📈</span>
          <span>آخر 7 أيام</span>
        </h3>
        <div className="flex items-end justify-between gap-3 h-52">
          {last7Days.map((day, i) => {
            const height = getMaxPoints() > 0 ? ((day.totalPoints + day.bonusPoints) / getMaxPoints()) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-sm text-zinc-500 tabular-nums font-bold">
                  {day.totalPoints + day.bonusPoints}
                </p>
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    day.completed
                      ? 'bg-gradient-to-t from-yellow-500 to-orange-400'
                      : 'bg-gradient-to-t from-zinc-600 to-zinc-500'
                  }`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
                <span className="text-xs text-zinc-500 uppercase tracking-wider">{getDayLabel(day)}</span>
              </div>
            );
          })}
          {last7Days.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-end h-full">
              <p className="text-zinc-500 text-sm">لا توجد بيانات بعد</p>
            </div>
          )}
        </div>
      </div>

      {/* Last 30 Days Heatmap - Steel Grid */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6">
        <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <span>📊</span>
          <span>آخر 30 يوم</span>
        </h3>
        <div className="grid grid-cols-10 md:grid-cols-15 lg:grid-cols-30 gap-2">
          {Array.from({ length: 30 }).map((_, i) => {
            const day = last30Days[i];
            const hasData = day !== undefined;
            const isCompleted = day?.completed || false;
            const intensity = hasData && getMaxPoints() > 0
              ? Math.min((day.totalPoints + day.bonusPoints) / getMaxPoints(), 1)
              : 0;

            return (
              <div
                key={i}
                className={`aspect-square rounded transition-all ${
                  hasData
                    ? isCompleted
                      ? 'bg-gradient-to-t from-yellow-500 to-orange-400'
                      : 'bg-zinc-700'
                    : 'bg-zinc-800/50'
                }`}
                style={{
                  opacity: hasData ? Math.max(intensity * 0.7 + 0.3, 0.3) : 0.2
                }}
                title={hasData ? `${day.date}: ${day.totalPoints + day.bonusPoints} نقطة` : ''}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-800/50 rounded" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">لا بيانات</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-700 rounded" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">ناقص</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-t from-yellow-500 to-orange-400 rounded" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">ممتاز</span>
          </div>
        </div>
      </div>

      {/* Achievements - Steel Plates */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6">
        <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <span>🎖️</span>
          <span>الإنجازات</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`rounded-xl p-4 text-center border-2 ${perfectDaysCount >= 1 ? 'bg-yellow-900/30 border-yellow-600' : 'bg-zinc-800/50 border-zinc-700'}`}>
            <span className="text-3xl">{perfectDaysCount >= 1 ? '🏆' : '🔒'}</span>
            <p className="text-sm mt-2 font-bold uppercase tracking-wider">{perfectDaysCount >= 1 ? 'اليوم المثالي الأول' : 'احصل على يوم مثالي'}</p>
          </div>
          <div className={`rounded-xl p-4 text-center border-2 ${perfectDaysCount >= 7 ? 'bg-yellow-900/30 border-yellow-600' : 'bg-zinc-800/50 border-zinc-700'}`}>
            <span className="text-3xl">{perfectDaysCount >= 7 ? '🔥' : '🔒'}</span>
            <p className="text-sm mt-2 font-bold uppercase tracking-wider">7 أيام مثالية</p>
          </div>
          <div className={`rounded-xl p-4 text-center border-2 ${totalPointsEarned >= 1000 ? 'bg-yellow-900/30 border-yellow-600' : 'bg-zinc-800/50 border-zinc-700'}`}>
            <span className="text-3xl">{totalPointsEarned >= 1000 ? '💎' : '🔒'}</span>
            <p className="text-sm mt-2 font-bold uppercase tracking-wider">{totalPointsEarned >= 1000 ? '1000+ نقطة' : 'اجمع 1000 نقطة'}</p>
          </div>
          <div className={`rounded-xl p-4 text-center border-2 ${dayHistory.length >= 30 ? 'bg-yellow-900/30 border-yellow-600' : 'bg-zinc-800/50 border-zinc-700'}`}>
            <span className="text-3xl">{dayHistory.length >= 30 ? '⭐' : '🔒'}</span>
            <p className="text-sm mt-2 font-bold uppercase tracking-wider">30 يوم متتالي</p>
          </div>
        </div>
      </div>

      {/* Monthly Summary - Steel Plate */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
          <span>📋</span>
          <span>ملخص الرحلة</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-zinc-800">
            <span className="text-zinc-400 uppercase tracking-wider text-sm">أجمالي الأيام</span>
            <span className="font-black text-white text-lg tabular-nums">{dayHistory.length} يوم</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-zinc-800">
            <span className="text-zinc-400 uppercase tracking-wider text-sm">أجمالي المهام المنجزة</span>
            <span className="font-black text-green-500 text-lg tabular-nums">
              {dayHistory.reduce((sum, d) => sum + d.tasks.filter(t => t.completed).length, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-zinc-400 uppercase tracking-wider text-sm">نسبة النجاح الإجمالية</span>
            <span className="font-black text-yellow-500 text-lg tabular-nums">
              {dayHistory.length > 0
                ? Math.round(
                    (dayHistory.reduce((sum, d) => sum + d.tasks.filter(t => t.completed).length, 0) /
                      dayHistory.reduce((sum, d) => sum + d.tasks.length, 0)) * 100
                  )
                : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
