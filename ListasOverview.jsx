import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ShoppingCart, Calendar, Trash2, Edit3, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { useShoppingList } from '../context/ShoppingListContext'
import AlertNotification from './AlertNotification/AlertNotification'

const ListasOverview = () => {
  const { listas, loading, createLista, deleteLista } = useShoppingList()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [nomeLista, setNomeLista] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateLista = async (e) => {
    e.preventDefault()
    if (!nomeLista.trim()) return

    setIsCreating(true)
    const { error } = await createLista(nomeLista)
    
    if (!error) {
      setNomeLista('')
      setShowCreateForm(false)
    }
    setIsCreating(false)
  }

  const handleDeleteLista = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir a lista "${nome}"?`)) {
      await deleteLista(id)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getItemsCount = (lista) => {
    return lista.itens?.length || 0
  }

  const getCompradosCount = (lista) => {
    return lista.itens?.filter(item => item.comprado).length || 0
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <AlertNotification />
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="icon-container">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Minhas Listas de Mercado
          </h2>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)} 
          className="flex items-center gap-2 rounded-full button-primary px-6 py-3"
        >
          <Plus size={18} />
          <span className="font-bold">Nova Lista</span>
        </Button>
      </div>

      {/* Formulário de criação */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-card rounded-2xl border-2 border-primary/20 p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-primary">Criar Nova Lista</h3>
              <form onSubmit={handleCreateLista} className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Nome da lista (ex: Compras da Semana)"
                  value={nomeLista}
                  onChange={(e) => setNomeLista(e.target.value)}
                  className="flex-1 rounded-full border-2 border-primary/30"
                  required
                />
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-full button-primary px-6"
                >
                  {isCreating ? 'Criando...' : 'Criar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNomeLista('')
                  }}
                  className="rounded-full"
                >
                  Cancelar
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de listas */}
      {listas.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="flex justify-center mb-6">
            <div className="icon-container p-8" style={{ background: 'linear-gradient(135deg, var(--muted) 0%, var(--muted-foreground) 100%)' }}>
              <Package className="h-16 w-16" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-muted-foreground">
            Nenhuma lista criada ainda
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Crie sua primeira lista de mercado para começar a organizar suas compras!
          </p>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="gap-2 px-8 py-4 text-lg font-bold rounded-full button-primary"
          >
            <Plus size={20} />
            Criar Primeira Lista
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listas.map((lista, index) => (
            <motion.div
              key={lista.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-card rounded-2xl border-2 border-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-primary line-clamp-2">
                  {lista.nome}
                </h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                  >
                    <Edit3 size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteLista(lista.id, lista.nome)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total de itens:</span>
                  <span className="font-bold text-primary">{getItemsCount(lista)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Comprados:</span>
                  <span className="font-bold text-secondary">{getCompradosCount(lista)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  <span>Criada em {formatDate(lista.created_at)}</span>
                </div>
              </div>

              <Button
                asChild
                className="w-full rounded-full button-primary py-3 font-bold"
              >
                <Link to={`/lista/${lista.id}`}>
                  Abrir Lista
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListasOverview

