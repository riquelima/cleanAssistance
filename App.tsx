import React, { useState, useEffect } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { LoginScreen } from './components/LoginScreen';
import { type Message, Sender, type User } from './types';
import { getBotResponse } from './services/webhookService';
import { SettingsModal } from './components/SettingsModal';
import { SupabaseSetup } from './components/SupabaseSetup';
import { type Database } from './services/database.types';


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
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // On initial load, check for saved Supabase credentials and create a client.
  useEffect(() => {
    const supabaseUrl = localStorage.getItem('supabaseUrl');
    const supabaseAnonKey = localStorage.getItem('supabaseAnonKey');

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const client = createClient<Database>(supabaseUrl, supabaseAnonKey);
        setSupabase(client);
      } catch (error) {
        console.error("Failed to create Supabase client:", error);
        // Clear broken credentials
        localStorage.removeItem('supabaseUrl');
        localStorage.removeItem('supabaseAnonKey');
      }
    }
  }, []);

  // Fetch all users once the Supabase client is available.
  useEffect(() => {
    if (supabase) {
      const fetchUsers = async () => {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
          console.error('Error fetching users:', error);
          // This might happen with incorrect credentials.
          // Consider clearing credentials here if error is auth-related.
        } else {
          setUsers(data || []);
        }
      };
      fetchUsers();
    }
  }, [supabase]);

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

  const handleSupabaseSave = (url: string, key: string) => {
    localStorage.setItem('supabaseUrl', url);
    localStorage.setItem('supabaseAnonKey', key);
    const client = createClient<Database>(url, key);
    setSupabase(client);
  };

  const handleLogin = async (username: string, pass: string): Promise<boolean> => {
    if (!supabase) return false;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase())
      .eq('password', pass)
      .single();
    
    if (error || !data) {
      console.error('Login failed:', error?.message);
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

  const addUser = async (newUser: User): Promise<boolean> => {
    if (!supabase) return false;

    const { data: existingUser, error: findError } = await supabase
        .from('users')
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
        .from('users')
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
    if (!supabase || username === 'admin') return;
    
    const { error } = await supabase
      .from('users')
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
  
  if (!supabase) {
    return <SupabaseSetup onSave={handleSupabaseSave} />;
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