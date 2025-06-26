import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, CheckSquare, Home, ShoppingBag, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

const Header = () => {
  const location = useLocation()
  const { user, signOut } = useAuth()
  
  // Atualizar o título da página com base na rota atual
  useEffect(() => {
    const titles = {
      '/': 'Início | Lista de Mercado',
      '/listas': 'Minhas Listas | Lista de Mercado',
      '/lista': 'Lista de Mercado',
      '/comprados': 'Itens Comprados | Lista de Mercado'
    }
    document.title = titles[location.pathname] || 'Lista de Mercado'
  }, [location.pathname])

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-header sticky top-0 z-10 shadow-md"
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-full shadow-md">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-white hidden sm:block">Lista de Mercado</h1>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Button
            variant={location.pathname === '/' ? 'default' : 'ghost'}
            size="sm"
            asChild
            className={location.pathname === '/' 
              ? 'bg-white text-primary hover:bg-white/90 rounded-full shadow-md' 
              : 'text-white hover:bg-white/20 rounded-full'}
          >
            <Link to="/" className="flex items-center gap-1 px-4">
              <Home size={18} />
              <span className="hidden sm:inline">Início</span>
            </Link>
          </Button>
          
          {user && (
            <>
              <Button
                variant={location.pathname === '/listas' ? 'default' : 'ghost'}
                size="sm"
                asChild
                className={location.pathname === '/listas' 
                  ? 'bg-white text-primary hover:bg-white/90 rounded-full shadow-md' 
                  : 'text-white hover:bg-white/20 rounded-full'}
              >
                <Link to="/listas" className="flex items-center gap-1 px-4">
                  <ShoppingCart size={18} />
                  <span className="hidden sm:inline">Listas</span>
                </Link>
              </Button>

              {/* Informações do usuário */}
              <div className="hidden md:flex items-center gap-2 text-white/80 text-sm">
                <User size={16} />
                <span>{user.email}</span>
              </div>

              {/* Botão de logout */}
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-1">Sair</span>
              </Button>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  )
}

export default Header

