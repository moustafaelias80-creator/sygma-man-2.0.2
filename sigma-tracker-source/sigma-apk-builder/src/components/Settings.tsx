import { useState } from 'react';
import { UserProfile } from '../App';

interface SettingsProps {
  startFresh: () => void;
  startDate: Date;
  userProfile: UserProfile | null;
  onUpdateProfile: (firstName: string, lastName: string) => void;
}

const Settings = ({ startFresh, startDate, userProfile, onUpdateProfile }: SettingsProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState(userProfile?.firstName || '');
  const [editLastName, setEditLastName] = useState(userProfile?.lastName || '');

  const handleStartFresh = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين كل شيء والبدء من جديد؟')) {
      startFresh();
    }
  };

  const handleSaveProfile = () => {
    if (editFirstName.trim() && editLastName.trim()) {
      onUpdateProfile(editFirstName.trim(), editLastName.trim());
      setIsEditingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setEditFirstName(userProfile?.firstName || '');
    setEditLastName(userProfile?.lastName || '');
    setIsEditingProfile(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatJoinDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header - Steel Plate */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <span>⚙️</span>
          <span>الإعدادات</span>
        </h2>
        <p className="text-zinc-500 text-sm mt-2 uppercase tracking-wider">إدارة حسابك وتفضيلاتك</p>
      </div>

      {/* Profile Section - Steel Panel */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span>👤</span>
            <span>الملف الشخصي</span>
          </h3>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600 rounded-lg text-orange-500 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <span>✏️</span>
              <span>تعديل</span>
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">الاسم الأول</label>
              <input
                type="text"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                className="w-full bg-zinc-800/50 border-2 border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 transition-all font-medium"
                placeholder="أدخل الاسم الأول"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">اللقب</label>
              <input
                type="text"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                className="w-full bg-zinc-800/50 border-2 border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 transition-all font-medium"
                placeholder="أدخل اللقب"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={!editFirstName.trim() || !editLastName.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all border-2 border-green-600 shadow-lg shadow-green-900/50 uppercase tracking-wider"
              >
                ✓ حفظ التعديلات
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold rounded-xl transition-all border-2 border-zinc-700 uppercase tracking-wider"
              >
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400 uppercase tracking-wider text-sm">الاسم</span>
              <span className="font-black text-white">{userProfile?.firstName} {userProfile?.lastName}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400 uppercase tracking-wider text-sm">تاريخ الالتحاق</span>
              <span className="font-black text-orange-500">{userProfile?.joinDate ? formatJoinDate(userProfile.joinDate) : formatDate(startDate)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Current Progress - Steel Panel */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
          <span>📊</span>
          <span>حالة الرحلة</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-zinc-800">
            <span className="text-zinc-400 uppercase tracking-wider text-sm">تاريخ البدء</span>
            <span className="font-black text-white">{formatDate(startDate)}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-zinc-400 uppercase tracking-wider text-sm">مدة الرحلة</span>
            <span className="font-black text-orange-500 text-lg">
              {Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} يوم
            </span>
          </div>
        </div>
      </div>

      {/* Actions - Steel Buttons */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
          <span>🎮</span>
          <span>إجراءات</span>
        </h3>
        <div className="space-y-4">
          <button
            onClick={handleStartFresh}
            className="w-full bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-black py-4 px-6 rounded-xl transition-all border-2 border-red-600 shadow-lg shadow-red-900/50 flex items-center justify-center gap-3 uppercase tracking-wider"
          >
            <span className="text-2xl">🔄</span>
            <span>البدء من جديد</span>
          </button>
          <p className="text-zinc-500 text-sm text-center uppercase tracking-wider">
            سيتم حذف جميع البيانات والبدء من اليوم الأول
          </p>
        </div>
      </div>

      {/* About - Steel Plate */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
          <span>ℹ️</span>
          <span>عن التطبيق</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-600 via-zinc-700 to-zinc-800 flex items-center justify-center text-3xl font-black text-white shadow-xl border border-zinc-500">
              Σ
            </div>
            <div>
              <h4 className="font-black text-white text-xl uppercase tracking-wider">سيجما تراكير</h4>
              <p className="text-zinc-400 text-sm">نسخة 2.0.0</p>
            </div>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
            <p className="text-zinc-300 text-sm leading-relaxed">
              تطبيق متكامل لتتبع رحلة 90 يوم نحو成為 رجل سيجما. يتضمن:
            </p>
            <ul className="mt-4 space-y-3 text-zinc-400 text-sm">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-green-900/50 border border-green-700 rounded flex items-center justify-center text-green-500 font-bold text-xs">✓</span>
                <span>تتبع يومي شامل للمهام</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-green-900/50 border border-green-700 rounded flex items-center justify-center text-green-500 font-bold text-xs">✓</span>
                <span>نظام نقاط ومكافآت</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-green-900/50 border border-green-700 rounded flex items-center justify-center text-green-500 font-bold text-xs">✓</span>
                <span>إحصائيات وتقدم مرئي</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-green-900/50 border border-green-700 rounded flex items-center justify-center text-green-500 font-bold text-xs">✓</span>
                <span>تنبيهات فورية</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-green-900/50 border border-green-700 rounded flex items-center justify-center text-green-500 font-bold text-xs">✓</span>
                <span>حفظ تلقائي للبيانات</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips - Steel Cards */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border-2 border-zinc-700 p-6">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
          <span>💡</span>
          <span>نصائح</span>
        </h3>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
            <p className="text-zinc-300 text-sm">
              <span className="text-yellow-500 font-black uppercase tracking-wider">🌙:</span> حاول إكمال جميع الصلوات في وقتها للحصول على نقاط إضافية
            </p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
            <p className="text-zinc-300 text-sm">
              <span className="text-orange-500 font-black uppercase tracking-wider">💪:</span> الرياضة الصباحية تحسن طاقتك طوال اليوم
            </p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
            <p className="text-zinc-300 text-sm">
              <span className="text-blue-500 font-black uppercase tracking-wider">📚:</span> القراءة اليومية تنمي عقلك وتوسّع أفقك
            </p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
            <p className="text-zinc-300 text-sm">
              <span className="text-green-500 font-black uppercase tracking-wider">⏰:</span> النوم المبكر أساس الإنتاجية العالية
            </p>
          </div>
        </div>
      </div>

      {/* Motivation - Steel Banner */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-xl border-2 border-zinc-700 p-8 text-center relative overflow-hidden">
        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

        <div className="relative">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-orange-600" />
            <span className="text-4xl">🐺</span>
            <div className="h-px flex-1 bg-gradient-to-r from-orange-600 via-zinc-700 to-transparent" />
          </div>
          <p className="text-white font-black text-2xl uppercase tracking-widest">
            الذئب الوحيد يسير بسرعة
          </p>
          <p className="text-zinc-500 text-sm mt-3 uppercase tracking-wider">
            لكن مع الانضباط والاستمرار، ستصبح النسخة الأفضل من نفسك
          </p>
          <div className="mt-6">
            <div className="inline-block bg-gradient-to-r from-orange-700 to-red-800 px-6 py-3 rounded-xl border border-orange-600 shadow-lg shadow-orange-900/30">
              <p className="text-white font-black text-lg uppercase tracking-wider">90 يوم تغير حياتك!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
