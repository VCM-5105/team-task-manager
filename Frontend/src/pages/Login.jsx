import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post('/auth/login', formData);

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
        localStorage.setItem('username', res.data.user.username);

        navigate('/dashboard');

    } catch (err) { 
        console.log(err.response?.data);
        alert(err.response?.data?.msg || "Login failed");
    }
};

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Creative Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-30"></div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Please enter your details to sign in</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input 
                            type="email" placeholder="Email Address" 
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input 
                            type="password" placeholder="Password" 
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95">
                        Sign In
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;