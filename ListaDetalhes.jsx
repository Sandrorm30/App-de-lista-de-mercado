import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Check, X, Edit3, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { useShoppingList } from '../context/ShoppingListContext'
import AlertNotification from './AlertNotification/AlertNotification'

const ListaDetalhes = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { listas, addItemToLista, updateItemInLista, removeItemFromLista, filterSuggestions } = useShoppingList()
  
  const [lista, setLista] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [nomeItem, setNomeItem] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [suggestions, setSuggestions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const listaEncontrada = listas.find(l => l.id === id)
    if (listaEncontrada) {
      setLista(listaEncontrada)
    } else if (listas.length > 0) {
      // Se a lista não foi encontrada e já carregamos as listas, redirecionar
      navigate('/listas')
    }
  }, [id, listas, navigate])

  useEffect(() => {
    if (nomeItem) {
      const filteredSuggestions = filterSuggestions(nomeItem)
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }, [nomeItem, filterSuggestions])

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!nomeItem.trim()) return

    await addItemToLista(id, nomeItem, quantidade)
    setNomeItem('')
    setQuantidade(1)
    setSuggestions([])
    setShowAddForm(false)
  }

  const handleSuggestionClick = (suggestion) => {
    setNomeItem(suggestion)
    setSuggestions([])
  }

  const handleToggleComprado = async (itemId, comprado) => {
    await updateItemInLista(id, itemId, { comprado: !comprado })
  }

  const handleRemoveItem = async (itemId, nomeItem) => {
    if (window.confirm(`Tem certeza que deseja remover "${nomeItem}" da lista?`)) {
      await removeItemFromLista(id, itemId)
    }
  }

  const filteredItems = lista?.itens?.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const itensNaoComprados = filteredItems.filter(item => !item.comprado)
  const itensComprados = filteredItems.filter(item => item.comprado)

  if (!lista) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <AlertNotification />
      
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="rounded-full"
        >
          <Link to="/listas">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {lista.nome}
          </h1>
          <p className="text-muted-foreground">
            {lista.itens?.length || 0} itens • {itensComprados.length} comprados
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center gap-2 rounded-full button-primary px-6 py-3"
        >
          <Plus size={18} />
          <span className="font-bold">Adicionar Item</span>
        </Button>
      </div>

      {/* Formulário de adição */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-card rounded-2xl border-2 border-primary/20 p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-primary">Adicionar Item</h3>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Nome do item"
                    value={nomeItem}
                    onChange={(e) => setNomeItem(e.target.value)}
                    className="rounded-full border-2 border-primary/30"
                    required
                  />
                  
                  {/* Sugestões */}
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 z-10 mt-2 bg-white border-2 border-primary/20 rounded-2xl shadow-lg max-h-48 overflow-y-auto"
                      >
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-3 hover:bg-primary/10 first:rounded-t-2xl last:rounded-b-2xl transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex gap-4">
                  <Input
                    type="number"
                    placeholder="Quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-32 rounded-full border-2 border-primary/30"
                  />
                  <Button
                    type="submit"
                    className="rounded-full button-primary px-6"
                  >
                    Adicionar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      setNomeItem('')
                      setQuantidade(1)
                      setSuggestions([])
                    }}
                    className="rounded-full"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Busca */}
      {lista.itens?.length > 0 && (
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

      {/* Lista de itens */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <h3 className="text-2xl font-bold mb-4 text-muted-foreground">
            {lista.itens?.length === 0 ? 'Lista vazia' : 'Nenhum item encontrado'}
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            {lista.itens?.length === 0 
              ? 'Adicione itens à sua lista para começar a organizar suas compras!'
              : `Nenhum item encontrado para "${searchTerm}"`
            }
          </p>
          {lista.itens?.length === 0 && (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="gap-2 px-8 py-4 text-lg font-bold rounded-full button-primary"
            >
              <Plus size={20} />
              Adicionar Primeiro Item
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Itens não comprados */}
          {itensNaoComprados.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-primary">
                Para Comprar ({itensNaoComprados.length})
              </h3>
              <div className="space-y-3">
                {itensNaoComprados.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl border-2 border-primary/20 p-4 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleComprado(item.id, item.comprado)}
                        className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-primary/30 hover:border-primary transition-colors flex items-center justify-center"
                      >
                        {item.comprado && <Check size={14} className="text-primary" />}
                      </button>
                      
                      <div className="flex-1">
                        <span className="font-medium text-lg">{item.nome}</span>
                        {item.quantidade > 1 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            (x{item.quantidade})
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.id, item.nome)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Itens comprados */}
          {itensComprados.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-secondary">
                Comprados ({itensComprados.length})
              </h3>
              <div className="space-y-3">
                {itensComprados.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-secondary/10 rounded-2xl border-2 border-secondary/20 p-4 shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleComprado(item.id, item.comprado)}
                        className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary border-2 border-secondary transition-colors flex items-center justify-center"
                      >
                        <Check size={14} className="text-white" />
                      </button>
                      
                      <div className="flex-1">
                        <span className="font-medium text-lg line-through text-muted-foreground">
                          {item.nome}
                        </span>
                        {item.quantidade > 1 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            (x{item.quantidade})
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.id, item.nome)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ListaDetalhes

