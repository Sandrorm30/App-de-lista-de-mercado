import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

// Lista de sugestões de produtos
const productSuggestions = [
  'Arroz', 'Feijão', 'Açúcar', 'Café', 'Leite', 'Pão', 'Manteiga', 'Óleo', 'Sal',
  'Farinha de trigo', 'Macarrão', 'Molho de tomate', 'Carne', 'Frango', 'Ovos',
  'Queijo', 'Presunto', 'Iogurte', 'Frutas', 'Legumes', 'Verduras', 'Papel higiênico',
  'Sabonete', 'Shampoo', 'Detergente', 'Sabão em pó', 'Água mineral', 'Refrigerante',
  'Cerveja', 'Suco', 'Azeite', 'Vinagre', 'Margarina', 'Biscoito', 'Chocolate',
  'Batata', 'Cebola', 'Alho', 'Tomate', 'Cenoura', 'Banana', 'Maçã', 'Laranja'
]

// Criação do contexto
const ShoppingListContext = createContext()

// Hook personalizado para usar o contexto
export const useShoppingList = () => {
  return useContext(ShoppingListContext)
}

// Provedor do contexto
export const ShoppingListProvider = ({ children }) => {
  const { user } = useAuth()
  const [listas, setListas] = useState([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  // Função para mostrar alerta
  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type })
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' })
    }, 3000)
  }

  // Buscar todas as listas do usuário
  const fetchListas = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('listas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setListas(data || [])
    } catch (error) {
      console.error('Erro ao buscar listas:', error)
      showAlert('Erro ao carregar listas', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Criar uma nova lista
  const createLista = async (nome) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('listas')
        .insert([
          {
            user_id: user.id,
            nome: nome.trim(),
            itens: []
          }
        ])
        .select()
        .single()

      if (error) throw error
      
      setListas(prev => [data, ...prev])
      showAlert(`Lista "${nome}" criada com sucesso!`, 'success')
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao criar lista:', error)
      showAlert('Erro ao criar lista', 'error')
      return { data: null, error }
    }
  }

  // Atualizar uma lista
  const updateLista = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('listas')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setListas(prev => prev.map(lista => 
        lista.id === id ? data : lista
      ))
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao atualizar lista:', error)
      showAlert('Erro ao atualizar lista', 'error')
      return { data: null, error }
    }
  }

  // Excluir uma lista
  const deleteLista = async (id) => {
    try {
      const { error } = await supabase
        .from('listas')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setListas(prev => prev.filter(lista => lista.id !== id))
      showAlert('Lista excluída com sucesso!', 'success')
      return { error: null }
    } catch (error) {
      console.error('Erro ao excluir lista:', error)
      showAlert('Erro ao excluir lista', 'error')
      return { error }
    }
  }

  // Adicionar item a uma lista
  const addItemToLista = async (listaId, nomeItem, quantidade = 1) => {
    const lista = listas.find(l => l.id === listaId)
    if (!lista) return

    // Verificar se o item já existe
    const itemExists = lista.itens.some(item => 
      item.nome.toLowerCase() === nomeItem.toLowerCase()
    )

    if (itemExists) {
      showAlert(`"${nomeItem}" já está na lista!`, 'warning')
      return
    }

    const novoItem = {
      id: Date.now().toString(),
      nome: nomeItem.trim(),
      quantidade: quantidade,
      comprado: false
    }

    const novosItens = [...lista.itens, novoItem]
    
    const { error } = await updateLista(listaId, { itens: novosItens })
    if (!error) {
      showAlert(`"${nomeItem}" adicionado à lista!`, 'success')
    }
  }

  // Atualizar item de uma lista
  const updateItemInLista = async (listaId, itemId, updates) => {
    const lista = listas.find(l => l.id === listaId)
    if (!lista) return

    const novosItens = lista.itens.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    )

    await updateLista(listaId, { itens: novosItens })
  }

  // Remover item de uma lista
  const removeItemFromLista = async (listaId, itemId) => {
    const lista = listas.find(l => l.id === listaId)
    if (!lista) return

    const item = lista.itens.find(i => i.id === itemId)
    const novosItens = lista.itens.filter(item => item.id !== itemId)

    const { error } = await updateLista(listaId, { itens: novosItens })
    if (!error && item) {
      showAlert(`"${item.nome}" removido da lista!`, 'info')
    }
  }

  // Função para filtrar sugestões com base no texto digitado
  const filterSuggestions = (text) => {
    if (!text) return []
    
    const lowerText = text.toLowerCase()
    
    return productSuggestions.filter(suggestion => {
      const lowerSuggestion = suggestion.toLowerCase()
      
      if (lowerSuggestion.startsWith(lowerText)) {
        return true
      }
      
      const words = lowerSuggestion.split(' ')
      for (let i = 1; i < words.length; i++) {
        if (words[i].startsWith(lowerText)) {
          return true
        }
      }
      
      return false
    }).slice(0, 6)
  }

  // Carregar listas quando o usuário fizer login
  useEffect(() => {
    if (user) {
      fetchListas()
    } else {
      setListas([])
    }
  }, [user])

  const value = {
    listas,
    loading,
    alert,
    showAlert,
    fetchListas,
    createLista,
    updateLista,
    deleteLista,
    addItemToLista,
    updateItemInLista,
    removeItemFromLista,
    filterSuggestions
  }

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  )
}

