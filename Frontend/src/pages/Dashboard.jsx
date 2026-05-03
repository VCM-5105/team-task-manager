import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: ''
    });

    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCreateProject = async () => {
        if (!newProject.name.trim()) {
            alert("Project name is required");
            return;
        }

        try {
            await api.post('/projects', newProject);

            // reset form
            setNewProject({ name: '', description: '' });

            // close modal
            setShowModal(false);

            // refresh projects
            fetchProjects();

        } catch (err) {
            console.log(err);
            alert("Failed to create project");
        }
    };

    return (
        <div className="pt-28 px-8 max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900">Projects</h1>
                    <p className="text-gray-500">Manage and track your work</p>
                </div>

                {role === 'Admin' && (
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
                    >
                        + Create Project
                    </button>
                )}
            </div>

            {/* PROJECT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {projects.map(p => (
                    <div 
                        key={p.id} 
                        onClick={() => navigate(`/project/${p.id}`)}
                        className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
                    >
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition">
                            {p.name}
                        </h3>

                        <p className="text-gray-500 mt-2 text-sm line-clamp-3">
                            {p.description || "No description provided"}
                        </p>

                        <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
                            <span>View Details →</span>
                            <span>ID: {p.id}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE PROJECT MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl">

                        <h2 className="text-xl font-bold mb-4">Create New Project</h2>

                        <input
                            type="text"
                            placeholder="Project Name"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <textarea
                            placeholder="Project Description"
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                            <button 
                                onClick={handleCreateProject}
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                Create
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;