import { useState, useEffect } from 'react';
import { X, Search, Plus, Sparkles } from 'lucide-react';
import { useShoppingList } from '@/context/ShoppingListContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const AddItemForm = ({ onClose }) => {
  const [itemName, setItemName] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const { addItem, filterSuggestions } = useShoppingList();

  // Atualizar sugestões filtradas quando o texto mudar
  useEffect(() => {
    if (itemName.trim()) {
      setFilteredSuggestions(filterSuggestions(itemName));
    } else {
      setFilteredSuggestions([]);
    }
  }, [itemName, filterSuggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName.trim()) {
      addItem(itemName);
      setItemName('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    addItem(suggestion);
    setItemName('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card p-6 rounded-xl border shadow-lg"
    >
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <div className="icon-container">
            <Sparkles size={20} />
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Adicionar Produto
          </h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted rounded-full">
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-primary" />
          </div>
          <Input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Digite o nome do produto..."
            className="pl-10 pr-16 py-6 text-base rounded-full border-2 border-primary/30 focus:ring-2 focus:ring-primary/50 shadow-md"
            autoFocus
          />
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1 rounded-full button-primary"
          >
            <Plus size={16} />
            <span>Adicionar</span>
          </Button>
        </div>
      </form>

      {/* Sugestões em tempo real */}
      <AnimatePresence>
        {itemName.trim() && filteredSuggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 border-2 border-secondary/30 rounded-xl p-4 bg-gradient-card shadow-md"
          >
            <h4 className="text-sm font-bold mb-3 text-secondary flex items-center gap-2">
              <Sparkles size={16} className="text-secondary" />
              Sugestões para "{itemName}":
            </h4>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-sm border-2 border-secondary/30 rounded-full hover:scale-105 transition-all button-secondary"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddItemForm;

