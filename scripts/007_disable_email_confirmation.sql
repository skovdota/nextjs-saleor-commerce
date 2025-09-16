-- Script para desabilitar confirmação de email no Supabase
-- Configurações para permitir login sem confirmação de email

-- Desabilitar confirmação de email
UPDATE auth.config 
SET email_confirm = false 
WHERE id = 1;

-- Permitir signup sem confirmação
UPDATE auth.config 
SET enable_signup = true,
    email_confirm = false,
    email_change_confirm = false
WHERE id = 1;

-- Comentário: Este script desabilita a necessidade de confirmação de email
-- permitindo que usuários façam login imediatamente após o cadastro
