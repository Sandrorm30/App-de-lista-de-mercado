import { useShoppingList } from '@/context/ShoppingListContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const DeleteConfirmation = () => {
  const { deleteConfirmation, cancelRemoveItem, confirmAndRemoveItem, items, purchasedItems } = useShoppingList();
  
  if (!deleteConfirmation.show) return null;
  
  // Encontrar o nome do item para exibir na confirmação
  const itemName = deleteConfirmation.isPurchased
    ? purchasedItems.find(item => item.id === deleteConfirmation.itemId)?.name
    : items.find(item => item.id === deleteConfirmation.itemId)?.name;
  
  return (
    <AlertDialog open={deleteConfirmation.show} onOpenChange={cancelRemoveItem}>
      <AlertDialogContent className="border-2 border-destructive/30 rounded-xl bg-gradient-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-xl">
            <motion.div 
              className="icon-container p-2" 
              style={{ background: 'linear-gradient(135deg, var(--destructive) 0%, oklch(0.7 0.35 10) 100%)' }}
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            >
              <AlertTriangle className="h-5 w-5" />
            </motion.div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-destructive to-red-500 font-bold">
              Confirmar exclusão
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base mt-4">
            Tem certeza que deseja remover <strong className="text-destructive font-bold">"{itemName}"</strong> da sua lista?
            <br />Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel 
            onClick={cancelRemoveItem}
            className="rounded-full border-2 border-muted font-bold"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmAndRemoveItem}
            className="rounded-full button-destructive font-bold"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmation;

