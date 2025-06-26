-- Script SQL para configurar o banco de dados Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Criar a tabela 'listas'
CREATE TABLE IF NOT EXISTS public.listas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    itens JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.listas ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de RLS

-- Política para SELECT: usuários só podem ver suas próprias listas
CREATE POLICY "Users can view own listas" ON public.listas
    FOR SELECT USING (auth.uid() = user_id);

-- Política para INSERT: usuários só podem inserir listas com seu próprio user_id
CREATE POLICY "Users can insert own listas" ON public.listas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE: usuários só podem atualizar suas próprias listas
CREATE POLICY "Users can update own listas" ON public.listas
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para DELETE: usuários só podem excluir suas próprias listas
CREATE POLICY "Users can delete own listas" ON public.listas
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_listas_user_id ON public.listas(user_id);
CREATE INDEX IF NOT EXISTS idx_listas_created_at ON public.listas(created_at);

-- 5. Comentários para documentação
COMMENT ON TABLE public.listas IS 'Tabela para armazenar as listas de mercado dos usuários';
COMMENT ON COLUMN public.listas.id IS 'Identificador único da lista';
COMMENT ON COLUMN public.listas.user_id IS 'ID do usuário proprietário da lista';
COMMENT ON COLUMN public.listas.nome IS 'Nome da lista de mercado';
COMMENT ON COLUMN public.listas.itens IS 'Array JSON com os itens da lista (nome, quantidade, comprado)';
COMMENT ON COLUMN public.listas.created_at IS 'Data e hora de criação da lista';

-- Exemplo de estrutura do campo 'itens':
-- [
--   {
--     "id": "1234567890",
--     "nome": "Banana",
--     "quantidade": 3,
--     "comprado": false
--   },
--   {
--     "id": "1234567891",
--     "nome": "Arroz",
--     "quantidade": 1,
--     "comprado": true
--   }
-- ]

