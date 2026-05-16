import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserType } from '../types';
import { GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (userType: UserType, name: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [userType, setUserType] = useState<UserType>('student');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name === 'zeeshan' && password === 'zeeshan') {
      onLogin(userType, name);
    } else {
      setError('Invalid name or password (hint: zeeshan/zeeshan)');
    }
  };

  const userTypes: { type: UserType; label: string; icon: any }[] = [
    { type: 'student', label: 'Student', icon: GraduationCap },
    { type: 'instructor', label: 'Instructor', icon: BookOpen },
    { type: 'QA', label: 'QA / Quality Assurance', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm max-w-lg w-full"
      >
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-display font-medium text-gray-900 tracking-tight mb-2">UniOBE</h1>
          <p className="text-gray-500 font-sans">University Outcome Based Education Manager</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-3">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-gray-400 ml-1">
              Select User Type
            </span>
            <div className="grid grid-cols-3 gap-3">
              {userTypes.map((t) => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setUserType(t.type)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    userType === t.type
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-transparent bg-gray-50/50 hover:bg-gray-100'
                  }`}
                >
                  <t.icon className={`w-6 h-6 mb-2 ${userType === t.type ? 'text-gray-900' : 'text-gray-400'}`} />
                  <span className={`text-[10px] font-sans font-bold uppercase tracking-tighter text-center leading-none ${
                    userType === t.type ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {t.type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-gray-400 ml-1 mb-2">
                Program / Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="zeeshan"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-sans focus:ring-2 focus:ring-gray-900/10 transition-all outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-gray-400 ml-1 mb-2">
                Access Token / Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="zeeshan"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-sans focus:ring-2 focus:ring-gray-900/10 transition-all outline-none"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm font-sans text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-sans font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-gray-900/20"
          >
            Enter Dashboard
          </button>
        </form>

        <div className="mt-8 text-center">
          <button type="button" className="text-gray-400 font-sans text-sm hover:text-gray-600 transition-colors">
            Register new account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
