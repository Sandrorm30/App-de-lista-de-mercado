import { ShoppingCart, CheckSquare, Plus, ShoppingBag, Sparkles, ArrowRight, List } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useShoppingList } from '@/context/ShoppingListContext'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import AlertNotification from '@/components/AlertNotification/AlertNotification'

const Home = () => {
  const { user } = useAuth()
  const { listas } = useShoppingList()

  const totalItens = listas.reduce((total, lista) => total + (lista.itens?.length || 0), 0)
  const totalComprados = listas.reduce((total, lista) => 
    total + (lista.itens?.filter(item => item.comprado).length || 0), 0
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <AlertNotification />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            className="icon-container p-6"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "loop",
              ease: "easeInOut"
            }}
          >
            <ShoppingBag className="h-14 w-14" />
          </motion.div>
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Lista de Mercado
        </h1>
        <p className="text-muted-foreground text-xl max-w-md mx-auto">
          Olá, {user?.email?.split('@')[0]}! Organize suas compras de forma simples e divertida!
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <motion.div 
          variants={item} 
          className="bg-gradient-card rounded-2xl border-2 border-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="icon-container">
              <List className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Minhas Listas
            </h2>
          </div>
          <p className="mb-4 text-2xl font-bold text-primary">
            {listas.length}
          </p>
          <Button asChild size="sm" className="w-full rounded-full button-primary">
            <Link to="/listas" className="flex items-center justify-center gap-2">
              Ver Todas
              <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>

        <motion.div 
          variants={item} 
          className="bg-gradient-card rounded-2xl border-2 border-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="icon-container">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Total de Itens
            </h2>
          </div>
          <p className="mb-4 text-2xl font-bold text-primary">
            {totalItens}
          </p>
          <Button asChild size="sm" variant="outline" className="w-full rounded-full button-secondary">
            <Link to="/listas" className="flex items-center justify-center gap-2">
              Gerenciar
              <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>

        <motion.div 
          variants={item} 
          className="bg-gradient-card rounded-2xl border-2 border-secondary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="icon-container" style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)' }}>
              <CheckSquare className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
              Itens Comprados
            </h2>
          </div>
          <p className="mb-4 text-2xl font-bold text-secondary">
            {totalComprados}
          </p>
          <Button asChild size="sm" variant="outline" className="w-full rounded-full button-secondary">
            <Link to="/listas" className="flex items-center justify-center gap-2">
              Ver Progresso
              <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Ações rápidas */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02 }}
        >
          <Button 
            asChild 
            size="lg" 
            className="w-full gap-3 px-8 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 button-primary"
          >
            <Link to="/listas">
              <List size={24} />
              <span>Ver Minhas Listas</span>
            </Link>
          </Button>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02 }}
        >
          <Button 
            asChild 
            size="lg" 
            variant="outline"
            className="w-full gap-3 px-8 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 button-accent"
          >
            <Link to="/listas">
              <Sparkles size={24} />
              <span>Criar Nova Lista</span>
              <Plus size={24} />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Listas recentes */}
      {listas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Listas Recentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listas.slice(0, 4).map((lista, index) => (
              <motion.div
                key={lista.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-xl border border-primary/20 p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-primary line-clamp-1">{lista.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {lista.itens?.length || 0} itens
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                  >
                    <Link to={`/lista/${lista.id}`}>
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Home

