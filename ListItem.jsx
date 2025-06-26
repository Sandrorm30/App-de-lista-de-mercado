import { Check, X, RotateCcw, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShoppingList } from '@/context/ShoppingListContext';
import { motion } from 'framer-motion';

const ListItem = ({ item, isPurchased = false }) => {
  const { markAsPurchased, unmarkAsPurchased, confirmRemoveItem } = useShoppingList();

  const handleMarkAsPurchased = () => {
    markAsPurchased(item.id);
  };

  const handleUnmarkAsPurchased = () => {
    unmarkAsPurchased(item.id);
  };

  const handleRemove = () => {
    confirmRemoveItem(item.id, isPurchased);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
      className={`flex items-center justify-between p-5 border-2 rounded-xl mb-4 shadow-md 
        ${isPurchased 
          ? 'bg-gradient-card border-secondary/30 text-muted-foreground' 
          : 'bg-gradient-card border-primary/30 hover:shadow-lg'} 
        transition-all duration-300 hover:scale-[1.01]`}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-4 flex-grow">
        {isPurchased ? (
          <div className="icon-container p-2" style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)' }}>
            <Check size={14} />
          </div>
        ) : (
          <div className="icon-container p-2">
            <ShoppingBag size={14} />
          </div>
        )}
        <span className={`font-bold text-lg ${isPurchased ? 'line-through text-muted-foreground' : ''}`}>
          {item.name}
        </span>
        
        {isPurchased && (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles size={16} className="text-secondary ml-2" />
          </motion.div>
        )}
      </div>
      
      <div className="flex gap-2">
        {isPurchased ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleUnmarkAsPurchased}
            title="Mover de volta para a lista"
            className="flex items-center gap-1 rounded-full border-2 border-secondary/30 button-secondary"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline font-bold">Restaurar</span>
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMarkAsPurchased}
            title="Marcar como comprado"
            className="flex items-center gap-1 rounded-full border-2 border-primary/30 button-primary"
          >
            <Check size={14} />
            <span className="hidden sm:inline font-bold">Comprado</span>
          </Button>
        )}
        
        <Button 
          variant="outline"
          size="sm"
          onClick={handleRemove}
          title="Remover item"
          className="flex items-center gap-1 rounded-full border-2 border-destructive/30 button-destructive"
        >
          <X size={14} />
          <span className="hidden sm:inline font-bold">Remover</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default ListItem;

