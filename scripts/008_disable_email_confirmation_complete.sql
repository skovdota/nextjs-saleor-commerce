-- Script completo para desabilitar confirmação de email no Supabase
-- Remove completamente a necessidade de confirmação de email

-- Desabilitar confirmação de email para novos usuários
UPDATE auth.config 
SET 
  enable_signup = true,
  email_confirm_required = false,
  email_change_confirm_required = false,
  enable_confirmations = false
WHERE true;

-- Confirmar todos os usuários existentes que não foram confirmados
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Comentário: Este script remove completamente a confirmação de email
-- e confirma automaticamente todos os usuários existentes
