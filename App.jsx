import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ShoppingListProvider } from './context/ShoppingListContext'
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import Login from './components/Login'
import ListasOverview from './components/ListasOverview'
import ListaDetalhes from './components/ListaDetalhes'
import ProtectedRoute from './components/ProtectedRoute'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <ShoppingListProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />
            <main className="flex-grow py-6">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <motion.div
                        key="home"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Home />
                      </motion.div>
                    </ProtectedRoute>
                  } />
                  <Route path="/listas" element={
                    <ProtectedRoute>
                      <motion.div
                        key="listas"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ListasOverview />
                      </motion.div>
                    </ProtectedRoute>
                  } />
                  <Route path="/lista/:id" element={
                    <ProtectedRoute>
                      <motion.div
                        key="lista-detalhes"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ListaDetalhes />
                      </motion.div>
                    </ProtectedRoute>
                  } />
                  {/* Redirecionar rotas antigas para as novas */}
                  <Route path="/lista" element={<Navigate to="/listas" replace />} />
                  <Route path="/comprados" element={<Navigate to="/listas" replace />} />
                  {/* Rota catch-all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </main>
            <footer className="py-4 text-center text-sm text-muted-foreground border-t">
              <p>© {new Date().getFullYear()} Lista de Mercado App</p>
            </footer>
          </div>
        </Router>
      </ShoppingListProvider>
    </AuthProvider>
  )
}

export default App

