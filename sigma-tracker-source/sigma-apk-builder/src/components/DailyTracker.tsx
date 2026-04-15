import { DayData } from '../App';

interface DailyTrackerProps {
  currentDay: DayData | null;
  toggleTask: (taskId: string) => void;
  resetDay: () => void;
}

const DailyTracker = ({ currentDay, toggleTask, resetDay }: DailyTrackerProps) => {
  if (!currentDay) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <p className="text-zinc-400 font-bold uppercase tracking-wider">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const spiritualTasks = currentDay.tasks.filter(t => t.category === 'spiritual');
  const physicalTasks = currentDay.tasks.filter(t => t.category === 'physical');
  const mentalTasks = currentDay.tasks.filter(t => t.category === 'mental');
  const socialTasks = currentDay.tasks.filter(t => t.category === 'social');

  const completedCount = currentDay.tasks.filter(t => t.completed).length;
  const totalCount = currentDay.tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'spiritual':
        return {
          border: 'border-emerald-700',
          bg: 'from-emerald-900/30 to-emerald-950/30',
          header: 'bg-emerald-900/50',
          accent: 'bg-emerald-500'
        };
      case 'physical':
        return {
          border: 'border-orange-700',
          bg: 'from-orange-900/30 to-orange-950/30',
          header: 'bg-orange-900/50',
          accent: 'bg-orange-500'
        };
      case 'mental':
        return {
          border: 'border-blue-700',
          bg: 'from-blue-900/30 to-blue-950/30',
          header: 'bg-blue-900/50',
          accent: 'bg-blue-500'
        };
      case 'social':
        return {
          border: 'border-purple-700',
          bg: 'from-purple-900/30 to-purple-950/30',
          header: 'bg-purple-900/50',
          accent: 'bg-purple-500'
        };
      default:
        return {
          border: 'border-zinc-700',
          bg: 'from-zinc-900/30 to-zinc-950/30',
          header: 'bg-zinc-900/50',
          accent: 'bg-zinc-500'
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spiritual': return '🕌';
      case 'physical': return '💪';
      case 'mental': return '🧠';
      case 'social': return '🤝';
      default: return '📌';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'spiritual': return 'العبادة والروحانية';
      case 'physical': return 'الصحة والجسد';
      case 'mental': return 'التطوير الذهني';
      case 'social': return 'العلاقات الاجتماعية';
      default: return 'أخرى';
    }
  };

  const renderTasks = (tasks: typeof currentDay.tasks, category: string) => {
    const styles = getCategoryStyles(category);
    const completedInCategory = tasks.filter(t => t.completed).length;

    return (
      <div className={`bg-gradient-to-br ${styles.bg} rounded-xl border-2 ${styles.border} overflow-hidden`}>
        {/* Header - Steel Bar */}
        <div className={`${styles.header} px-5 py-4 border-b border-zinc-700`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              <span className="text-white font-black uppercase tracking-wider">{getCategoryName(category)}</span>
            </div>
            <div className="bg-zinc-900/80 px-3 py-1 rounded-lg border border-zinc-700">
              <span className="text-white font-bold tabular-nums">{completedInCategory}/{tasks.length}</span>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="p-4 space-y-3">
          {tasks.map(task => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-right border-2 ${
                task.completed
                  ? 'bg-green-900/40 border-green-700 hover:bg-green-900/60'
                  : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 hover:border-zinc-600'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all ${
                task.completed
                  ? 'bg-green-600 shadow-lg shadow-green-900/50'
                  : 'bg-zinc-700'
              }`}>
                {task.icon}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm leading-relaxed ${task.completed ? 'text-green-300 line-through' : 'text-white'}`}>
                  {task.name}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">⏰ {task.time}</span>
                  <span className="text-xs text-green-400 font-bold">+{task.points}</span>
                  {task.penaltyPoints > 0 && (
                    <span className="text-xs text-red-400 font-bold">-{task.penaltyPoints}</span>
                  )}
                </div>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-xl transition-all ${
                task.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-zinc-700 text-zinc-500'
              }`}>
                {task.completed ? '✓' : '○'}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header - Steel Panel */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">المهام اليومية</h2>
            <p className="text-zinc-500 text-sm mt-2 uppercase tracking-wider">{formatDate(currentDay.date)}</p>
          </div>
          <button
            onClick={resetDay}
            className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 hover:border-zinc-500 rounded-lg text-zinc-400 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <span>🔄</span>
            <span>إعادة تعيين</span>
          </button>
        </div>

        {/* Overall Progress - Steel Bar */}
        <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-400 font-bold uppercase tracking-wider">التقدم الكلي</span>
            <span className={`text-3xl font-black tabular-nums ${
              percentage >= 80 ? 'text-green-500' :
              percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {percentage}%
            </span>
          </div>
          <div className="h-5 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700">
            <div
              className={`h-full rounded-lg transition-all duration-1000 relative ${
                percentage >= 80
                  ? 'bg-gradient-to-r from-green-600 to-emerald-500'
                  : percentage >= 50
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-red-600 to-orange-500'
              }`}
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-white/40" />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <span className="text-zinc-500 text-sm uppercase tracking-wider">{completedCount} مكتمل</span>
            <span className="text-zinc-500 text-sm uppercase tracking-wider">{totalCount - completedCount} متبقي</span>
          </div>
        </div>

        {/* Status Messages */}
        {percentage === 100 && (
          <div className="mt-6 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl p-5 border-2 border-yellow-600 text-center">
            <span className="text-3xl">🏆</span>
            <p className="text-yellow-500 font-black text-xl mt-3 uppercase tracking-wider"> يوم مثالي! أحسنت!</p>
            <p className="text-yellow-500/60 text-sm mt-2">+100 نقطة إضافية</p>
          </div>
        )}

        {percentage >= 80 && percentage < 100 && (
          <div className="mt-6 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl p-5 border-2 border-green-700 text-center">
            <span className="text-2xl">🔥</span>
            <p className="text-green-500 font-black text-lg mt-2 uppercase tracking-wider">اقتربت من الإكمال!</p>
          </div>
        )}
      </div>

      {/* Task Categories - Steel Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-6">
          {renderTasks(spiritualTasks, 'spiritual')}
          {renderTasks(physicalTasks, 'physical')}
        </div>
        <div className="space-y-6">
          {renderTasks(mentalTasks, 'mental')}
          {renderTasks(socialTasks, 'social')}
        </div>
      </div>

      {/* Summary - Steel Plate */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6 sm:p-8">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <span>📊</span>
          <span>ملخص اليوم</span>
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-green-900/30 rounded-xl p-4 sm:p-5 border border-green-800 text-center">
            <p className="text-2xl sm:text-3xl font-black text-green-500 tabular-nums">+{currentDay.tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0)}</p>
            <p className="text-green-500/60 text-xs sm:text-sm uppercase tracking-wider mt-3">النقاط المكتسبة</p>
          </div>
          <div className="bg-red-900/30 rounded-xl p-4 sm:p-5 border border-red-800 text-center">
            <p className="text-2xl sm:text-3xl font-black text-red-500 tabular-nums">-{currentDay.deductions}</p>
            <p className="text-red-500/60 text-xs sm:text-sm uppercase tracking-wider mt-3">الخصومات</p>
          </div>
          <div className="bg-orange-900/30 rounded-xl p-4 sm:p-5 border border-orange-800 text-center">
            <p className="text-2xl sm:text-3xl font-black text-orange-500 tabular-nums">{currentDay.totalPoints + currentDay.bonusPoints}</p>
            <p className="text-orange-500/60 text-xs sm:text-sm uppercase tracking-wider mt-3">المجموع</p>
          </div>
          <div className={`rounded-xl p-4 sm:p-5 border text-center ${percentage >= 80 ? 'bg-green-900/30 border-green-800' : 'bg-zinc-800/50 border-zinc-700'}`}>
            <p className={`text-2xl sm:text-3xl font-black tabular-nums ${percentage >= 80 ? 'text-green-500' : 'text-white'}`}>
              {percentage >= 80 ? '✓' : `${percentage}%`}
            </p>
            <p className="text-zinc-500/60 text-xs sm:text-sm uppercase tracking-wider mt-3">
              {percentage >= 80 ? 'ممتاز!' : 'نسبة الإنجاز'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;
