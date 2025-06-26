import { useState } from 'react';
import { useShoppingList } from '@/context/ShoppingListContext';
import ListItem from '../ShoppingList/ListItem';
import { CheckSquare, Search, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteConfirmation from '../DeleteConfirmation/DeleteConfirmation';
import AlertNotification from '../AlertNotification/AlertNotification';

const PurchasedList = () => {
  const { purchasedItems } = useShoppingList();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar itens com base no termo de pesquisa
  const filteredItems = searchTerm.trim() 
    ? purchasedItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : purchasedItems;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <AlertNotification />
      <DeleteConfirmation />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="icon-container" style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)' }}>
          <CheckSquare className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
          Itens Comprados
        </h2>
      </div>

      {purchasedItems.length > 0 && (
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Buscar itens comprados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 w-full rounded-full border-2 border-secondary/30 bg-background focus:outline-none focus:ring-2 focus:ring-secondary/50 shadow-md"
          />
        </div>
      )}

      <AnimatePresence>
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center p-10 border-2 border-secondary/20 rounded-xl bg-gradient-card shadow-md"
          >
            {purchasedItems.length === 0 ? (
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    repeatType: "loop",
                    ease: "easeInOut"
                  }}
                  className="icon-container p-5" 
                  style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)' }}
                >
                  <ShoppingBag className="h-12 w-12" />
                </motion.div>
                <p className="text-lg text-muted-foreground">
                  Nenhum item foi comprado ainda. Marque itens como comprados na sua lista!
                </p>
              </div>
            ) : (
              <p className="text-lg text-muted-foreground">Nenhum item encontrado para "{searchTerm}"</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="space-y-3">
        <AnimatePresence>
          {filteredItems.map(item => (
            <ListItem key={item.id} item={item} isPurchased={true} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PurchasedList;

