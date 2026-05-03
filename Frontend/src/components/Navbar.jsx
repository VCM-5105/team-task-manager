import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, User, Briefcase } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50">
            <div className="bg-white shadow-xl rounded-2xl px-6 py-3 flex items-center justify-between border border-gray-100">

                <Link to="/dashboard" className="flex items-center gap-2 font-bold text-indigo-600 text-xl">
                    <Briefcase size={22}/> TaskFlow
                </Link>

                <div className="flex items-center gap-6">

                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition">
                        <LayoutDashboard size={18}/> Dashboard
                    </Link>

                    <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border">
                        <div className="bg-indigo-600 text-white p-1 rounded-full">
                            <User size={14}/>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xs font-bold text-gray-800">{username}</span>
                            <span className="text-[10px] text-gray-400 uppercase">{role}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                        <LogOut size={20}/>
                    </button>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;