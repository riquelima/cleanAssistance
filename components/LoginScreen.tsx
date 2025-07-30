import React, { useState } from 'react';

const LottieIcon = () => (
    <dotlottie-wc 
        src="https://lottie.host/0ffc67e0-0fdc-4a9d-97a1-a6d79908267c/9AdLC2EdVQ.lottie" 
        style={{ width: '120px', height: '120px' }}
        speed="1" 
        autoplay 
        loop>
    </dotlottie-wc>
);

interface LoginScreenProps {
  onLogin: (user: string, pass: string) => boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(username, password);
    if (!success) {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="bg-[#1E1E1E] h-screen flex flex-col items-center justify-center font-sans text-white p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
            <LottieIcon />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1 text-gray-100">Bem-vindo!</h1>
        <p className="text-center text-gray-400 mb-8">Faça login para acessar o assistente.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#2A2A2A] text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow placeholder-gray-500"
              placeholder="admin"
              aria-label="Campo de usuário"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#2A2A2A] text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow placeholder-gray-500"
              placeholder="••••••••"
              aria-label="Campo de senha"
            />
          </div>
          
          {error && (
            <p role="alert" className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full mt-4 p-3 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-500 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E1E1E] focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
