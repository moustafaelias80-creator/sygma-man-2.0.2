interface Notification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'danger';
}

interface NotificationsProps {
  notifications: Notification[];
}

const Notifications = ({ notifications }: NotificationsProps) => {
  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-700 to-emerald-800',
          border: 'border-green-500',
          icon: '✓',
          shadow: 'shadow-green-500/30'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-700 to-orange-800',
          border: 'border-yellow-500',
          icon: '⚠',
          shadow: 'shadow-yellow-500/30'
        };
      case 'danger':
        return {
          bg: 'bg-gradient-to-r from-red-700 to-rose-800',
          border: 'border-red-500',
          icon: '✗',
          shadow: 'shadow-red-500/30'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-700 to-indigo-800',
          border: 'border-blue-500',
          icon: 'ℹ',
          shadow: 'shadow-blue-500/30'
        };
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 space-y-2">
      {notifications.map((notification, index) => {
        const styles = getNotificationStyles(notification.type);
        return (
          <div
            key={notification.id}
            className={`${styles.bg} ${styles.border} border-2 rounded-xl p-4 shadow-xl ${styles.shadow} animate-slide-in`}
            style={{
              animation: `slideIn 0.3s ease-out forwards`,
              marginTop: `${index * 10}px`
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-white ${styles.bg.replace('bg-gradient-to-r from-', 'bg-').split(' ')[0]}`}>
                {styles.icon}
              </div>
              <p className="text-white font-bold flex-1">{notification.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
