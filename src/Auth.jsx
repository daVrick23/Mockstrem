import React, { useState } from 'react';

export default function Auth() {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegister) {
            console.log('Register:', { username, email, password });
        } else {
            console.log('Login:', { email, password });
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-cyan-500">
            <title>MockStream: Auth</title>
            <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md transition-all duration-500">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
                    {isRegister ? 'Register' : 'Login'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {isRegister && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition-all duration-300"
                    >
                        {isRegister ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <p className="text-sm text-center text-slate-500 mt-4">
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{' '}
                    <span
                        className="text-blue-500 cursor-pointer font-semibold"
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </span>
                </p>
            </div>
        </div>
    );
}
