
import React, { useState } from 'react';
import { type User, type NewUser } from '../types';
import { TrashIcon, UserAvatarIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  addUser: (user: NewUser) => Promise<boolean>;
  deleteUser: (username: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  users,
  addUser,
  deleteUser,
}) => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      setError('Usuário e senha são obrigatórios.');
      return;
    }
    setIsLoading(true);
    setError('');
    const success = await addUser({ username: newUsername, password: newPassword });
    if (success) {
      setNewUsername('');
      setNewPassword('');
    } else {
        setError('Este nome de usuário já está em uso.');
    }
    setIsLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className="bg-[#2A2A2A] rounded-xl shadow-2xl w-full max-w-md m-4 text-gray-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <h2 id="settings-title" className="text-xl font-semibold">Configurações de Usuários</h2>
          <p className="text-sm text-gray-400 mt-1">Adicione ou remova usuários do sistema.</p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Add User Form */}
          <form onSubmit={handleAddUser} className="space-y-4">
            <h3 className="text-lg font-medium border-b border-white/10 pb-2 mb-3">Adicionar Novo Usuário</h3>
            <div>
              <label htmlFor="new-username" className="block text-sm font-medium text-gray-400 mb-2">Novo Usuário</label>
              <input
                id="new-username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-4 py-2 bg-[#1E1E1E] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="ex: joao.silva"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="new-password"className="block text-sm font-medium text-gray-400 mb-2">Nova Senha</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#1E1E1E] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button 
              type="submit" 
              className="w-full p-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-500 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar Usuário'}
            </button>
          </form>

          {/* User List */}
          <div className="space-y-3">
             <h3 className="text-lg font-medium border-b border-white/10 pb-2 mb-3">Usuários Atuais</h3>
            {users.map((user) => (
              <div key={user.username} className="flex items-center justify-between bg-[#1E1E1E] p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <UserAvatarIcon className="w-8 h-8" />
                    <span className="font-medium">{user.username}</span>
                </div>
                {user.username !== 'admin' && (
                  <button 
                    onClick={() => deleteUser(user.username)}
                    className="p-1.5 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    aria-label={`Deletar usuário ${user.username}`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-[#1E1E1E] border-t border-white/10 flex justify-end flex-shrink-0">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg font-semibold bg-gray-600 hover:bg-gray-500 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
