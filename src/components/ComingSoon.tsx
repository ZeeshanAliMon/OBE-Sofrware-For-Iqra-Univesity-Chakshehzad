import { motion } from 'motion/react';

interface ComingSoonProps {
  userType: string;
  onLogout: () => void;
}

export default function ComingSoon({ userType, onLogout }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[24px] shadow-sm max-w-md w-full text-center"
      >
        <h1 className="text-3xl font-display font-medium text-gray-900 mb-4">Coming Soon</h1>
        <p className="text-gray-500 mb-8 font-sans">
          The dashboard for <span className="font-semibold text-gray-900">{userType}</span> is currently under development.
        </p>
        <button
          onClick={onLogout}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-sans font-medium hover:bg-gray-800 transition-colors"
        >
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}
