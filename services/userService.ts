import { supabase } from './supabaseClient';

/**
 * Garante que o usuário admin exista na tabela 'users_north' com as credenciais corretas.
 * Esta função é idempotente e segura para ser executada na inicialização do aplicativo.
 * Ela usa uma flag no localStorage para evitar verificações desnecessárias no banco de dados em carregamentos subsequentes.
 */
export const ensureAdminUser = async (): Promise<void> => {
    // Uma flag única para esta tarefa de configuração para garantir que ela só seja executada quando necessário.
    const flag = 'admin_user_users_north_v1';
    
    // Se a flag já estiver definida, assumimos que o usuário admin está configurado.
    if (localStorage.getItem(flag)) {
        return;
    }

    console.log("Garantindo a configuração do usuário 'admin' na tabela 'users_north'...");

    // Passo 1: Encontrar qualquer usuário com o nome de usuário 'admin' (case-insensitive).
    const { data: existingAdmin, error: findError } = await supabase
        .from('users_north')
        .select('id, username')
        .ilike('username', 'admin')
        .limit(1)
        .maybeSingle(); 

    if (findError) {
        console.error("Erro ao verificar o usuário admin:", findError.message);
        // Não definimos a flag em caso de erro, para que possa tentar novamente na próxima vez.
        return;
    }

    if (existingAdmin) {
        // Passo 2a: O usuário existe. Atualize a senha e normalize o nome de usuário para minúsculas.
        console.log(`Usuário admin encontrado ('${existingAdmin.username}'). Atualizando para credenciais padrão.`);
        const { error: updateError } = await supabase
            .from('users_north')
            .update({ password: 'North_448', username: 'admin' }) // Garante o nome de usuário em minúsculas
            .eq('id', existingAdmin.id);

        if (updateError) {
            console.error('Falha ao ATUALIZAR o usuário admin:', updateError.message);
        } else {
            console.log('Usuário admin atualizado com sucesso.');
            localStorage.setItem(flag, 'true');
        }
    } else {
        // Passo 2b: O usuário não existe. Crie-o.
        console.log("Usuário 'admin' não encontrado. Criando usuário admin padrão.");
        const { error: insertError } = await supabase
            .from('users_north')
            .insert({ username: 'admin', password: 'North_448' });

        if (insertError) {
            console.error('Falha ao CRIAR o usuário admin:', insertError.message);
        } else {
            console.log('Usuário admin criado com sucesso.');
            localStorage.setItem(flag, 'true');
        }
    }
};
