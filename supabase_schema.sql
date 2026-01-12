-- =============================================
-- PROMPTFORGE v4.0 - SCHEMA SUPABASE
-- Tabelas para Sistema de Créditos
-- ✅ Janeiro 2026
-- =============================================

-- ==================== TABELA: user_credits ====================
-- Armazena o saldo de créditos de cada usuário

CREATE TABLE IF NOT EXISTS user_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    credits_remaining INTEGER DEFAULT 5 NOT NULL,
    credits_used_total INTEGER DEFAULT 0 NOT NULL,
    plan TEXT DEFAULT 'free' NOT NULL,
    last_reset TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_credits_email ON user_credits(email);
CREATE INDEX IF NOT EXISTS idx_user_credits_plan ON user_credits(plan);

-- Comentários
COMMENT ON TABLE user_credits IS 'Saldo de créditos de cada usuário';
COMMENT ON COLUMN user_credits.credits_remaining IS 'Créditos disponíveis para uso';
COMMENT ON COLUMN user_credits.credits_used_total IS 'Total histórico de créditos usados';
COMMENT ON COLUMN user_credits.plan IS 'Plano: free, mensal, anual';
COMMENT ON COLUMN user_credits.last_reset IS 'Data do último reset mensal';

-- ==================== TABELA: credit_usage ====================
-- Histórico detalhado de uso de créditos

CREATE TABLE IF NOT EXISTS credit_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    credits_used INTEGER NOT NULL,
    action TEXT NOT NULL,
    balance_after INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_credit_usage_email ON credit_usage(email);
CREATE INDEX IF NOT EXISTS idx_credit_usage_created_at ON credit_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_usage_action ON credit_usage(action);

-- Comentários
COMMENT ON TABLE credit_usage IS 'Histórico detalhado de uso de créditos';
COMMENT ON COLUMN credit_usage.credits_used IS 'Quantidade de créditos usados nesta ação';
COMMENT ON COLUMN credit_usage.action IS 'Tipo de ação: design_png, remove_background, etc';
COMMENT ON COLUMN credit_usage.balance_after IS 'Saldo após a dedução';
COMMENT ON COLUMN credit_usage.metadata IS 'Dados adicionais (nicho, estilo, etc)';

-- ==================== ROW LEVEL SECURITY (RLS) ====================

-- Habilitar RLS nas tabelas
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

-- Políticas para user_credits
-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own credits"
    ON user_credits
    FOR SELECT
    USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Usuários podem atualizar apenas seus próprios dados
CREATE POLICY "Users can update own credits"
    ON user_credits
    FOR UPDATE
    USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Qualquer usuário autenticado pode inserir (primeira vez)
CREATE POLICY "Users can insert own credits"
    ON user_credits
    FOR INSERT
    WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas para credit_usage
-- Usuários podem ver apenas seu próprio histórico
CREATE POLICY "Users can view own usage"
    ON credit_usage
    FOR SELECT
    USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Usuários podem inserir apenas no próprio histórico
CREATE POLICY "Users can insert own usage"
    ON credit_usage
    FOR INSERT
    WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

-- ==================== FUNÇÕES AUXILIARES ====================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para user_credits
DROP TRIGGER IF EXISTS update_user_credits_updated_at ON user_credits;
CREATE TRIGGER update_user_credits_updated_at
    BEFORE UPDATE ON user_credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==================== SINCRONIZAÇÃO COM SUBSCRIPTIONS ====================
-- Sincroniza créditos iniciais baseado nas assinaturas existentes

INSERT INTO user_credits (email, credits_remaining, plan, last_reset)
SELECT 
    email,
    CASE 
        WHEN plan = 'anual' THEN 100
        WHEN plan = 'mensal' THEN 30
        ELSE 5
    END as credits,
    plan,
    NOW()
FROM subscriptions
WHERE status = 'active'
ON CONFLICT (email) DO NOTHING;

-- ==================== VIEWS ÚTEIS ====================

-- View: Estatísticas de uso por usuário
CREATE OR REPLACE VIEW user_credit_stats AS
SELECT 
    uc.email,
    uc.plan,
    uc.credits_remaining,
    uc.credits_used_total,
    COUNT(cu.id) as total_transactions,
    SUM(cu.credits_used) as monthly_usage,
    uc.last_reset
FROM user_credits uc
LEFT JOIN credit_usage cu ON cu.email = uc.email 
    AND cu.created_at >= uc.last_reset
GROUP BY uc.email, uc.plan, uc.credits_remaining, uc.credits_used_total, uc.last_reset;

COMMENT ON VIEW user_credit_stats IS 'Estatísticas agregadas de créditos por usuário';

-- ==================== ÍNDICES ADICIONAIS ====================

-- Índice composto para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_usage_email_date 
    ON credit_usage(email, created_at DESC);

-- Índice para buscar por período
CREATE INDEX IF NOT EXISTS idx_usage_date_range 
    ON credit_usage(created_at) 
    WHERE created_at > NOW() - INTERVAL '30 days';

-- ==================== DADOS INICIAIS (OPCIONAL) ====================

-- Exemplo: Dar 5 créditos bônus para todos os usuários free
-- DESCOMENTAR SE NECESSÁRIO:
/*
UPDATE user_credits 
SET credits_remaining = credits_remaining + 5
WHERE plan = 'free' 
  AND created_at > NOW() - INTERVAL '7 days';
*/

-- ==================== VERIFICAÇÕES ====================

-- Verificar integridade
DO $$ 
BEGIN
    -- Verificar se tabelas existem
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_credits') THEN
        RAISE EXCEPTION 'Tabela user_credits não foi criada';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'credit_usage') THEN
        RAISE EXCEPTION 'Tabela credit_usage não foi criada';
    END IF;
    
    RAISE NOTICE '✅ Todas as tabelas foram criadas com sucesso!';
END $$;

-- ==================== BACKUP E MANUTENÇÃO ====================

-- Procedure para limpar histórico antigo (manter últimos 6 meses)
CREATE OR REPLACE FUNCTION cleanup_old_credit_usage()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM credit_usage
    WHERE created_at < NOW() - INTERVAL '6 months';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_credit_usage() IS 'Remove registros de uso com mais de 6 meses';

-- ==================== FIM DO SCHEMA ====================

-- Mostrar resumo
SELECT 
    'user_credits' as table_name,
    COUNT(*) as total_records,
    SUM(credits_remaining) as total_credits_available,
    SUM(credits_used_total) as total_credits_used
FROM user_credits
UNION ALL
SELECT 
    'credit_usage' as table_name,
    COUNT(*) as total_records,
    SUM(credits_used) as total_credits_in_history,
    NULL
FROM credit_usage;

-- ✅ Schema completo configurado!
