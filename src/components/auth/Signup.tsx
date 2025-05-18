import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Reusable Input with Icon
const InputWithIcon = ({
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ElementType;
}) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="input-field pl-10"
    />
  </div>
);

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock signup logic
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('Mock signup successful:', { name, email, password });
      setLoading(false);
      navigate('/');
    }, 1500); // Simulate network delay
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text mb-2">
            Productivity Flow
          </h1>
          <p className="text-gray-400">Create your account to get started.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <InputWithIcon
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              icon={User}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <InputWithIcon
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              icon={Mail}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <InputWithIcon
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              icon={Lock}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse">Signing Up...</span>
            ) : (
              <>
                <UserPlus size={18} className="mr-2" />
                Sign Up
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-400 hover:text-primary-300"
            >
              Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
