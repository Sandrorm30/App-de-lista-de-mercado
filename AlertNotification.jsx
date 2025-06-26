import { useShoppingList } from '@/context/ShoppingListContext';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertNotification = () => {
  const { alert } = useShoppingList();
  
  if (!alert.show) return null;
  
  const getIcon = () => {
    switch (alert.type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'error':
        return <X className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  const getNotificationClass = () => {
    switch (alert.type) {
      case 'success':
        return 'notification-success';
      case 'warning':
        return 'notification-warning';
      case 'error':
        return 'notification-error';
      default:
        return 'notification-info';
    }
  };
  
  return (
    <AnimatePresence>
      {alert.show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.div 
            className={`flex items-center gap-3 px-6 py-4 rounded-full shadow-xl text-white ${getNotificationClass()}`}
            whileHover={{ scale: 1.05 }}
            animate={{ 
              y: [0, -5, 0],
            }}
            transition={{ 
              y: { repeat: 2, duration: 0.3, ease: "easeInOut" },
            }}
          >
            <div className="bg-white/20 p-1 rounded-full">
              {getIcon()}
            </div>
            <span className="font-bold">{alert.message}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertNotification;

