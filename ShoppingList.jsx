import { useState } from 'react';
import { Plus, ShoppingCart, Search, Sparkles } from 'lucide-react';
import { useShoppingList } from '@/context/ShoppingListContext';
import ListItem from './ListItem';
import { Button } from '@/components/ui/button';
import AddItemForm from '../AddItemForm/AddItemForm';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteConfirmation from '../DeleteConfirmation/DeleteConfirmation';
import AlertNotification from '../AlertNotification/AlertNotification';

const ShoppingList = () => {
  const { items } = useShoppingList();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddClick = () => {
    setIsAddingItem(true);
  };

  const handleCloseForm = () => {
    setIsAddingItem(false);
  };

  // Filtrar itens com base no termo de pesquisa
  const filteredItems = searchTerm.trim() 
    ? items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : items;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <AlertNotification />
      <DeleteConfirmation />
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="icon-container">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Lista de Mercado
          </h2>
        </div>
        <Button 
          onClick={handleAddClick} 
          className="flex items-center gap-2 rounded-full button-primary px-5 py-6"
        >
          <Plus size={18} />
          <span className="font-bold">Adicionar Item</span>
        </Button>
      </div>

      <AnimatePresence>
        {isAddingItem && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <AddItemForm onClose={handleCloseForm} />
          </motion.div>
        )}
      </AnimatePresence>

      {items.length > 0 && (
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-primary" />
          </div>
          <input
            type="text"
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 w-full rounded-full border-2 border-primary/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-md"
          />
        </div>
      )}

      <AnimatePresence>
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center p-10 border-2 border-primary/20 rounded-xl bg-gradient-card shadow-md"
          >
            {items.length === 0 ? (
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
                >
                  <ShoppingCart className="h-12 w-12" />
                </motion.div>
                <p className="text-lg text-muted-foreground">Sua lista está vazia. Adicione itens para começar!</p>
                <Button 
                  onClick={handleAddClick} 
                  className="mt-2 rounded-full button-accent px-6 py-6 font-bold text-lg"
                >
                  <Sparkles className="mr-2" size={20} />
                  Adicionar primeiro item
                </Button>
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
            <ListItem key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ShoppingList;

