import { useState, useEffect, useCallback, useRef } from 'react';
import Dashboard from './components/Dashboard';
import DailyTracker from './components/DailyTracker';
import Notifications from './components/Notifications';
import ProgressChart from './components/ProgressChart';
import Settings from './components/Settings';
import LoginScreen from './components/LoginScreen';

export interface UserProfile {
  firstName: string;
  lastName: string;
  joinDate: string;
}

export interface DailyTask {
  id: string;
  name: string;
  icon: string;
  points: number;
  penaltyPoints: number;
  completed: boolean;
  time: string;
  category: 'spiritual' | 'physical' | 'mental' | 'social';
}

export interface DayData {
  date: string;
  dayNumber: number;
  tasks: DailyTask[];
  totalPoints: number;
  bonusPoints: number;
  deductions: number;
  completed: boolean;
}

export interface UserStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  perfectDays: number;
  level: number;
  totalDays: number;
  completedTasks: number;
  missedTasks: number;
}

const defaultTasks: Omit<DailyTask, 'completed'>[] = [
  // الفترة الليلية
  { id: 'night-prayer', name: 'صلاة قيام الليل + وتر', icon: '🌟', points: 60, penaltyPoints: 0, time: '4:30', category: 'spiritual' },

  // الصباح الباكر
  { id: 'water-morning', name: 'شرب ماء على الريق', icon: '💧', points: 15, penaltyPoints: 10, time: '4:45', category: 'physical' },
  { id: 'wakeup', name: 'الاستيقاظ قبل 5:00', icon: '⏰', points: 20, penaltyPoints: 20, time: '4:30', category: 'physical' },
  { id: 'fajr', name: 'صلاة الفجر في وقتها', icon: '🌙', points: 50, penaltyPoints: 30, time: '5:15', category: 'spiritual' },
  { id: 'dhikr-morning', name: 'أذكار الصباح', icon: '📿', points: 25, penaltyPoints: 10, time: '5:30', category: 'spiritual' },
  { id: 'quran', name: 'قراءة قرآن (جزء كامل)', icon: '📖', points: 40, penaltyPoints: 20, time: '5:50', category: 'spiritual' },
  { id: 'planning', name: 'تخطيط اليوم + مراجعة الأهداف', icon: '📋', points: 30, penaltyPoints: 15, time: '6:20', category: 'mental' },

  // الرياضة والصحة
  { id: 'exercise', name: 'رياضة/مشي 55 دقيقة', icon: '💪', points: 50, penaltyPoints: 30, time: '6:35', category: 'physical' },
  { id: 'cold-shower', name: 'دش بارد صباحي', icon: '🧊', points: 25, penaltyPoints: 15, time: '7:30', category: 'physical' },
  { id: 'water-3l', name: 'شرب 3 لتر ماء', icon: '🚰', points: 20, penaltyPoints: 15, time: 'يومي', category: 'physical' },

  // الصلوات
  { id: 'zuhr', name: 'صلاة الظهر في وقتها', icon: '☀️', points: 30, penaltyPoints: 20, time: '12:15', category: 'spiritual' },
  { id: 'asr', name: 'صلاة العصر في وقتها', icon: '🌤️', points: 30, penaltyPoints: 20, time: '15:45', category: 'spiritual' },
  { id: 'maghrib', name: 'صلاة المغرب في وقتها', icon: '🌅', points: 30, penaltyPoints: 20, time: '18:00', category: 'spiritual' },
  { id: 'isha', name: 'صلاة العشاء في وقتها', icon: '🌃', points: 30, penaltyPoints: 20, time: '19:45', category: 'spiritual' },

  // التطوير الذهني
  { id: 'reading', name: 'قراءة كتاب 30 دقيقة', icon: '📚', points: 30, penaltyPoints: 15, time: '16:00', category: 'mental' },
  { id: 'focus-work', name: 'مهام عمل مركزة (2 ساعة)', icon: '🎯', points: 45, penaltyPoints: 25, time: '8:00', category: 'mental' },
  { id: 'diary', name: 'كتابة اليوميات + محاسبة النفس', icon: '✍️', points: 30, penaltyPoints: 15, time: '20:00', category: 'mental' },
  { id: 'skills', name: 'تعلم مهارات جديدة', icon: '🧠', points: 25, penaltyPoints: 10, time: '20:30', category: 'mental' },

  // النوم والصحة
  { id: 'sleep', name: 'النوم قبل 22:00 (7 ساعات)', icon: '😴', points: 40, penaltyPoints: 25, time: '21:30', category: 'physical' },

  // الصحة
  { id: 'healthy-food', name: 'أكل صحي', icon: '🥗', points: 15, penaltyPoints: 10, time: 'يومي', category: 'physical' },

  // الاجتماعية
  { id: 'social-relations', name: 'صلة رحم / زيارة الأحبة', icon: '🤝', points: 35, penaltyPoints: 15, time: '18:30', category: 'social' },
  { id: 'family-time', name: 'وقت عائلي هادئ', icon: '👨‍👩‍👧', points: 25, penaltyPoints: 10, time: '21:00', category: 'social' },

  // الانضباط
  { id: 'no-social-morning', name: 'بدون سوشيال ميديا صباحاً', icon: '📵', points: 20, penaltyPoints: 15, time: 'مستمر', category: 'mental' },
  { id: 'night-dhikr', name: 'أذكار المساء + نوافل', icon: '🌙', points: 20, penaltyPoints: 10, time: '19:45', category: 'spiritual' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tracker' | 'progress' | 'settings'>('dashboard');
  const [notifications, setNotifications] = useState<{id: string; message: string; type: 'success' | 'warning' | 'info' | 'danger'}[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    perfectDays: 0,
    level: 1,
    totalDays: 1,
    completedTasks: 0,
    missedTasks: 0
  });
  const [dayHistory, setDayHistory] = useState<DayData[]>([]);
  const [currentDay, setCurrentDay] = useState<DayData | null>(null);
  const [startDate, setStartDate] = useState<Date>(() => {
    const saved = localStorage.getItem('sigmaStartDate');
    return saved ? new Date(saved) : new Date();
  });

  const historyRef = useRef<DayData[]>([]);
  const startDateRef = useRef<Date>(new Date());

  useEffect(() => {
    historyRef.current = dayHistory;
  }, [dayHistory]);

  useEffect(() => {
    startDateRef.current = startDate;
  }, [startDate]);

  // Check for existing login on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('sigmaUserProfile');
    const savedHistory = localStorage.getItem('sigmaDayHistory');
    const savedStats = localStorage.getItem('sigmaStats');
    const savedStartDate = localStorage.getItem('sigmaStartDate');

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setIsLoggedIn(true);

      // Load existing data
      let loadedHistory: DayData[] = [];
      if (savedHistory) {
        loadedHistory = JSON.parse(savedHistory);
        setDayHistory(loadedHistory);
        historyRef.current = loadedHistory;
      }

      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      }

      if (savedStartDate) {
        const date = new Date(savedStartDate);
        setStartDate(date);
        startDateRef.current = date;
      }

      // Initialize current day
      const today = new Date().toISOString().split('T')[0];
      const startDateValue = savedStartDate ? new Date(savedStartDate) : new Date();
      const dayNumber = Math.floor((new Date().getTime() - startDateValue.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const existingDay = loadedHistory.find(d => d.date === today);

      if (existingDay) {
        setCurrentDay(existingDay);
      } else {
        const newDay: DayData = {
          date: today,
          dayNumber: dayNumber > 0 ? dayNumber : 1,
          tasks: defaultTasks.map(t => ({ ...t, completed: false })),
          totalPoints: 0,
          bonusPoints: 0,
          deductions: 0,
          completed: false
        };
        setCurrentDay(newDay);
      }
    }
  }, []);

  const handleLogin = (firstName: string, lastName: string) => {
    const profile: UserProfile = {
      firstName,
      lastName,
      joinDate: new Date().toISOString()
    };
    localStorage.setItem('sigmaUserProfile', JSON.stringify(profile));
    setUserProfile(profile);
    setIsLoggedIn(true);

    // Initialize start date if new user
    const newStartDate = new Date();
    localStorage.setItem('sigmaStartDate', newStartDate.toISOString());
    setStartDate(newStartDate);
    startDateRef.current = newStartDate;

    // Initialize first day
    const today = newStartDate.toISOString().split('T')[0];
    const newDay: DayData = {
      date: today,
      dayNumber: 1,
      tasks: defaultTasks.map(t => ({ ...t, completed: false })),
      totalPoints: 0,
      bonusPoints: 0,
      deductions: 0,
      completed: false
    };
    setCurrentDay(newDay);
    setDayHistory([newDay]);
    historyRef.current = [newDay];
    localStorage.setItem('sigmaDayHistory', JSON.stringify([newDay]));
  };

  const handleUpdateProfile = (firstName: string, lastName: string) => {
    if (userProfile) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        firstName,
        lastName
      };
      localStorage.setItem('sigmaUserProfile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      addNotification('✓ تم تحديث الملف الشخصي بنجاح', 'success');
    }
  };

  const addNotification = useCallback((message: string, type: 'success' | 'warning' | 'info' | 'danger') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const calculateStats = useCallback((history: DayData[], start: Date): UserStats => {
    if (history.length === 0) {
      const daysSinceStart = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return {
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        perfectDays: 0,
        level: Math.max(1, Math.floor(daysSinceStart / 30) + 1),
        totalDays: Math.max(1, daysSinceStart),
        completedTasks: 0,
        missedTasks: 0
      };
    }

    const totalCompletedTasks = history.reduce((sum, d) =>
      sum + d.tasks.filter(t => t.completed).length, 0);
    const totalPossibleTasks = history.reduce((sum, d) => sum + d.tasks.length, 0);
    const totalMissedTasks = totalPossibleTasks - totalCompletedTasks;
    const totalPoints = history.reduce((sum, d) => sum + d.totalPoints + d.bonusPoints, 0);
    const perfectDays = history.filter(d => d.completed).length;

    const sortedDays = [...history].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let longestStreak = 0;
    let tempStreak = 0;

    for (const day of sortedDays) {
      if (day.completed) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = 0;
    const todayOrYesterdayExists = sortedDays.some(d => d.date === today || d.date === yesterdayStr);

    if (todayOrYesterdayExists) {
      let checkDate = sortedDays.find(d => d.date === today || d.date === yesterdayStr);
      if (checkDate) {
        currentStreak = 1;
        let currentIndex = sortedDays.indexOf(checkDate);

        for (let i = currentIndex - 1; i >= 0; i--) {
          if (sortedDays[i].completed) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    const daysSinceStart = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const level = Math.floor(daysSinceStart / 30) + 1;

    return {
      totalPoints,
      currentStreak,
      longestStreak,
      perfectDays,
      level: Math.max(1, level),
      totalDays: Math.max(1, daysSinceStart),
      completedTasks: totalCompletedTasks,
      missedTasks: totalMissedTasks
    };
  }, []);

  useEffect(() => {
    if (historyRef.current.length > 0 || dayHistory.length > 0) {
      const stats = calculateStats(dayHistory, startDateRef.current);
      setUserStats(stats);
      localStorage.setItem('sigmaStats', JSON.stringify(stats));
    }
  }, [dayHistory, calculateStats]);

  const toggleTask = useCallback((taskId: string) => {
    if (!currentDay) return;

    const task = currentDay.tasks.find(t => t.id === taskId);
    if (!task) return;

    const wasCompleted = task.completed;
    const newCompleted = !wasCompleted;

    const updatedTasks = currentDay.tasks.map(t =>
      t.id === taskId ? { ...t, completed: newCompleted } : t
    );

    const completedCount = updatedTasks.filter(t => t.completed).length;
    const earnedPoints = updatedTasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);
    const missedPenalty = updatedTasks.filter(t => !t.completed && t.penaltyPoints > 0).reduce((sum, t) => sum + t.penaltyPoints, 0);
    const allRequiredCompleted = updatedTasks.filter(t => t.penaltyPoints > 0).every(t => t.completed);
    const bonusPoints = allRequiredCompleted ? 100 : 0;

    const updatedDay: DayData = {
      ...currentDay,
      tasks: updatedTasks,
      totalPoints: earnedPoints - missedPenalty,
      bonusPoints: bonusPoints,
      deductions: missedPenalty,
      completed: completedCount >= updatedTasks.length * 0.8
    };

    setCurrentDay(updatedDay);

    const today = updatedDay.date;

    setDayHistory(prevHistory => {
      const existingIndex = prevHistory.findIndex(d => d.date === today);
      let newHistory: DayData[];

      if (existingIndex >= 0) {
        newHistory = [...prevHistory];
        newHistory[existingIndex] = updatedDay;
      } else {
        newHistory = [...prevHistory, updatedDay];
      }

      localStorage.setItem('sigmaDayHistory', JSON.stringify(newHistory));

      return newHistory;
    });

    if (newCompleted) {
      addNotification(`✓ +${task.points} نقطة! أكملت: ${task.name}`, 'success');
      if (completedCount === updatedTasks.length) {
        addNotification('🏆 يوم مثالي! +100 نقطة إضافية!', 'success');
      }
    } else {
      addNotification(`✗ -${task.penaltyPoints} نقطة! فاتتك: ${task.name}`, 'danger');
    }
  }, [currentDay, addNotification]);

  const resetDay = useCallback(() => {
    if (currentDay) {
      const resetTasks = currentDay.tasks.map(t => ({ ...t, completed: false }));
      const resetDay: DayData = {
        ...currentDay,
        tasks: resetTasks,
        totalPoints: 0,
        bonusPoints: 0,
        deductions: 0,
        completed: false
      };

      setCurrentDay(resetDay);

      const today = resetDay.date;
      setDayHistory(prevHistory => {
        const newHistory = prevHistory.map(d =>
          d.date === today ? resetDay : d
        );
        localStorage.setItem('sigmaDayHistory', JSON.stringify(newHistory));
        return newHistory;
      });

      addNotification('🔄 تم إعادة تعيين اليوم', 'info');
    }
  }, [currentDay, addNotification]);

  const startFresh = useCallback(() => {
    const newStartDate = new Date();

    localStorage.removeItem('sigmaDayHistory');
    localStorage.removeItem('sigmaCurrentDay');
    localStorage.removeItem('sigmaStats');
    localStorage.setItem('sigmaStartDate', newStartDate.toISOString());

    const initialStats = {
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      perfectDays: 0,
      level: 1,
      totalDays: 1,
      completedTasks: 0,
      missedTasks: 0
    };

    setDayHistory([]);
    historyRef.current = [];
    setUserStats(initialStats);
    setStartDate(newStartDate);
    startDateRef.current = newStartDate;

    const newDay: DayData = {
      date: newStartDate.toISOString().split('T')[0],
      dayNumber: 1,
      tasks: defaultTasks.map(t => ({ ...t, completed: false })),
      totalPoints: 0,
      bonusPoints: 0,
      deductions: 0,
      completed: false
    };

    setCurrentDay(newDay);
    addNotification('🚀 بداية جديدة! اليوم يومك الأول', 'success');
  }, [addNotification]);

  const currentDayNumber = currentDay?.dayNumber || 1;

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-black text-white overflow-x-hidden">
      <Notifications notifications={notifications} />

      {/* Header - Steel/Masculine Design */}
      <header className="bg-gradient-to-b from-zinc-900 to-black border-b-2 border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-2xl border border-zinc-600">
                  Σ
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-600 rounded-full border-2 border-black" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase">
                  سيجما تراكير
                </h1>
                <p className="text-zinc-400 text-sm font-bold">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-orange-600 to-red-700 rounded-full" />
                  <span className="text-xs text-zinc-400 font-medium">اليوم {currentDayNumber} / 90</span>
                </div>
              </div>
            </div>

            {/* Stats Display */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl px-3 sm:px-5 py-2 sm:py-3 border border-zinc-700 shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-base sm:text-xl font-black text-white">⚡</span>
                  </div>
                  <div>
                    <p className="font-black text-lg sm:text-2xl text-white tabular-nums">{userStats.totalPoints}</p>
                    <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">نقطة</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl px-3 sm:px-5 py-2 sm:py-3 border border-zinc-700 shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 to-orange-700 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-base sm:text-xl font-black text-white">🔥</span>
                  </div>
                  <div>
                    <p className="font-black text-lg sm:text-2xl text-white tabular-nums">{userStats.currentStreak}</p>
                    <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">يوم</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-2 mt-5 overflow-x-auto pb-2">
            {[
              { id: 'dashboard', label: 'لوحة القيادة', icon: '⚔️' },
              { id: 'tracker', label: 'المهام', icon: '🎯' },
              { id: 'progress', label: 'التقدم', icon: '📊' },
              { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-bold uppercase tracking-wider transition-all whitespace-nowrap border-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white border-orange-600 shadow-lg shadow-orange-900/50'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                <span className="text-base sm:text-lg">{tab.icon}</span>
                <span className="text-sm sm:text-base">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-zinc-950 border-b-2 border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-widest mb-2 sm:mb-3">
            <span className={currentDayNumber <= 30 ? 'text-orange-500 font-bold' : 'text-zinc-500'}>المرحلة 1</span>
            <span className={currentDayNumber > 30 && currentDayNumber <= 60 ? 'text-orange-500 font-bold' : 'text-zinc-500'}>المرحلة 2</span>
            <span className={currentDayNumber > 60 ? 'text-red-500 font-bold' : 'text-zinc-500'}>المرحلة 3</span>
          </div>
          <div className="h-3 sm:h-4 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <div
              className="h-full bg-gradient-to-r from-orange-600 via-red-600 to-red-700 rounded-full transition-all duration-1000 relative"
              style={{ width: `${Math.min((currentDayNumber / 90) * 100, 100)}%` }}
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-white/30" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-zinc-600 uppercase tracking-widest mt-2 font-bold">
            <span>1</span>
            <span>45</span>
            <span>90</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            userStats={userStats}
            currentDay={currentDay}
            dayHistory={dayHistory}
            userProfile={userProfile}
          />
        )}
        {activeTab === 'tracker' && (
          <DailyTracker
            currentDay={currentDay}
            toggleTask={toggleTask}
            resetDay={resetDay}
          />
        )}
        {activeTab === 'progress' && (
          <ProgressChart dayHistory={dayHistory} />
        )}
        {activeTab === 'settings' && (
          <Settings
            startFresh={startFresh}
            startDate={startDate}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t-2 border-zinc-800 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            <span className="text-xl sm:text-2xl">🐺</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
          </div>
          <p className="text-zinc-500 text-sm font-medium text-center uppercase tracking-widest">
            الذئب الوحيد يسير بسرعة
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-400 font-bold uppercase">
              المستوى {userStats.level}
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-400 font-bold uppercase">
              {userStats.totalDays} يوم
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-400 font-bold uppercase">
              {userStats.perfectDays} يوم مثالي
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
