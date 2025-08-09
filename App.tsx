
import React, { useState, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { LoginScreen } from './components/LoginScreen';
import { type Message, Sender, type User, type NewUser } from './types';
import { getBotResponse } from './services/webhookService';
import { SettingsModal } from './components/SettingsModal';
import { supabase } from './services/supabaseClient';


const initialMessage: Message = {
      id: 'initial-1',
      sender: Sender.Bot,
      text: `Olá! Sou seu assistente virtual para cotação de limpeza. 👋

Para gerar o orçamento, por favor, me informe os seguintes dados: 

🏠 Tipo de Limpeza (Standard, Deep, Move in/out, Pós-construção): 
📏 Área (em sqft):
🛏️ Quartos:
🚽 Banheiros:

Além disso, deseja incluir algum destes itens extras?

🔥 Forno
🧊 Geladeira
👚 Lavanderia
🚗 Garagem
📦 Organização
🧼 Carpet Shampooing
🪟 Janelas

É só me enviar tudo e eu calculo o valor para você! ✨`,
      timestamp: '09:52',
    };

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
        // This robust script ensures the admin user exists with the correct password in the new table.
        const flag = 'admin_user_users_north_v1'; // Use a new flag to re-run for the new table name
        if (!localStorage.getItem(flag)) {
            console.log("Garantindo a configuração do usuário 'admin' na tabela 'users_north'...");

            // Step 1: Find any user with a case-insensitive 'admin' username.
            const { data: existingAdmin, error: findError } = await supabase
                .from('users_north')
                .select('id, username')
                .ilike('username', 'admin')
                .limit(1)
                .maybeSingle(); 

            if (findError) {
                console.error("Erro ao verificar o usuário admin:", findError.message);
            } else if (existingAdmin) {
                // Step 2a: User exists. Update password and normalize username to lowercase.
                console.log(`Usuário admin encontrado ('${existingAdmin.username}'). Atualizando para credenciais padrão.`);
                const { error: updateError } = await supabase
                    .from('users_north')
                    .update({ password: 'North_448', username: 'admin' }) // Enforce lowercase username
                    .eq('id', existingAdmin.id);

                if (updateError) {
                    console.error('Falha ao ATUALIZAR o usuário admin:', updateError.message);
                } else {
                    console.log('Usuário admin atualizado com sucesso.');
                    localStorage.setItem(flag, 'true');
                }
            } else {
                // Step 2b: User does not exist. Create it.
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
        }
        // The app is ready to display the login screen.
        setIsReady(true);
    };

    initializeApp();
  }, []);

  // Fetch all users once authenticated.
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users_north').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    };
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Load chat history when the current user changes.
  useEffect(() => {
    if (currentUser) {
      try {
        const storedMessages = localStorage.getItem(`chat_history_${currentUser.username}`);
        setMessages(storedMessages ? JSON.parse(storedMessages) : [initialMessage]);
      } catch (e) {
        console.error("Failed to parse messages from localStorage", e);
        setMessages([initialMessage]);
      }
    }
  }, [currentUser]);

  // Save chat history when messages change.
  useEffect(() => {
    if (currentUser && isAuthenticated) {
      localStorage.setItem(`chat_history_${currentUser.username}`, JSON.stringify(messages));
    }
  }, [messages, currentUser, isAuthenticated]);

  const handleLogin = async (username: string, pass: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('users_north')
      .select('*')
      .eq('username', username.toLowerCase())
      .eq('password', pass)
      .maybeSingle();
    
    if (error || !data) {
      if (error) {
        // Log only actual database errors, not "no user found" scenarios.
        console.error('Login failed:', error.message);
      }
      return false;
    }

    setCurrentUser(data);
    setIsAuthenticated(true);
    return true;
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const addUser = async (newUser: NewUser): Promise<boolean> => {
    const { data: existingUser, error: findError } = await supabase
        .from('users_north')
        .select('username')
        .eq('username', newUser.username.toLowerCase())
        .single();
    
    if (findError && findError.code !== 'PGRST116') { // PGRST116: "exact one row not found"
        console.error('Error checking for existing user:', findError);
        return false;
    }

    if (existingUser) {
        return false; // User already exists
    }
    
    const { data, error } = await supabase
        .from('users_north')
        .insert([{ ...newUser, username: newUser.username.toLowerCase() }])
        .select()
        .single();
    
    if (error) {
        console.error('Error adding user:', error);
        return false;
    }

    if (data) {
      setUsers(prev => [...prev, data]);
    }
    return true;
};


  const deleteUser = async (username: string) => {
    if (username === 'admin') return;
    
    const { error } = await supabase
      .from('users_north')
      .delete()
      .eq('username', username);
      
    if (error) {
        console.error('Error deleting user:', error);
        return;
    }

    setUsers(prev => prev.filter(u => u.username !== username));
    localStorage.removeItem(`chat_history_${username}`);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const timestamp = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: Sender.User,
      text,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botText = await getBotResponse(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: Sender.Bot,
        text: botText,
        timestamp: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: Sender.Bot,
        text: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
        timestamp: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isReady) {
    return (
      <div className="bg-[#1E1E1E] h-screen flex flex-col items-center justify-center font-sans text-white p-4">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-6">
              <img 
                src="https://raw.githubusercontent.com/riquelima/cleanAssistance/refs/heads/main/NorthLogo.png" 
                alt="Logo"
                className="w-60 h-auto"
              />
          </div>
          <p className="text-lg text-gray-300 animate-pulse">Inicializando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="bg-black h-screen font-sans">
      <div className="w-full h-full bg-[#1E1E1E] flex flex-col overflow-hidden">
        <ChatHeader 
          currentUser={currentUser}
          onToggleSettings={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
        />
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        {currentUser?.username === 'admin' && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            users={users}
            addUser={addUser}
            deleteUser={deleteUser}
          />
        )}
      </div>
    </div>
  );
};

export default App;