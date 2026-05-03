import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Clock, CheckCircle, PlayCircle } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [showTaskModal, setShowTaskModal] = useState(false);

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        due_date: '',
        assigned_to: ''
    });

    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchProject();
        fetchTasks();
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await api.get(`/projects/${id}`);
            setProject(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await api.get(`/tasks/project/${id}`);
            setTasks(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // ✅ CREATE TASK
    const createTask = async () => {
        try {
            await api.post('/tasks', {
                ...taskData,
                project_id: id
            });

            setShowTaskModal(false);
            setTaskData({
                title: '',
                description: '',
                due_date: '',
                assigned_to: ''
            });

            fetchTasks();

        } catch (err) {
            console.log(err);
            alert("Failed to create task");
        }
    };

    // ✅ UPDATE STATUS
    const updateStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}/status`, {
                status: newStatus
            });

            fetchTasks();
        } catch (err) {
            console.log(err);
        }
    };

    const columns = [
        { title: 'To Do', status: 'Todo', icon: <Clock size={16}/> },
        { title: 'In Progress', status: 'In Progress', icon: <PlayCircle size={16}/> },
        { title: 'Completed', status: 'Completed', icon: <CheckCircle size={16}/> },
    ];

    if (!project) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="pt-28 px-8 max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="flex justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900">
                        {project.name}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {project.description}
                    </p>
                </div>

                {role === 'Admin' && (
                    <button 
                        onClick={() => setShowTaskModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 shadow-md"
                    >
                        <Plus size={18}/> Add Task
                    </button>
                )}
            </div>

            {/* KANBAN BOARD */}
            <div className="grid md:grid-cols-3 gap-6">
                {columns.map(col => (
                    <div key={col.status} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">

                        {/* COLUMN HEADER */}
                        <div className="flex justify-between mb-4 font-semibold text-sm text-gray-600">
                            <div className="flex gap-2 items-center">
                                {col.icon} {col.title}
                            </div>
                            <span className="text-xs bg-white px-2 py-0.5 rounded-full border">
                                {tasks.filter(t => t.status === col.status).length}
                            </span>
                        </div>

                        {/* TASKS */}
                        <div className="space-y-3">
                            {tasks
                                .filter(t => t.status === col.status)
                                .map(task => {

                                    const isOverdue =
                                        task.due_date &&
                                        new Date(task.due_date) < new Date() &&
                                        task.status !== "Completed";

                                    return (
                                        <div 
                                            key={task.id} 
                                            className={`p-4 rounded-xl border transition shadow-sm hover:shadow-md
                                            ${isOverdue 
                                                ? "bg-red-50 border-red-200" 
                                                : "bg-white border-gray-100"
                                            }`}
                                        >

                                            {/* TITLE */}
                                            <h4 className={`font-semibold ${
                                                isOverdue ? "text-red-600" : "text-gray-800"
                                            }`}>
                                                {task.title}
                                            </h4>

                                            {/* DESCRIPTION */}
                                            <p className="text-sm text-gray-500 mt-1">
                                                {task.description}
                                            </p>

                                            {/* STATUS */}
                                            <select
                                                value={task.status}
                                                onChange={(e) => updateStatus(task.id, e.target.value)}
                                                className="mt-3 w-full p-2 border rounded-lg text-sm"
                                            >
                                                <option value="Todo">Todo</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>

                                            {/* FOOTER */}
                                            <div className="flex justify-between mt-3 text-xs font-medium">
                                                <span className="text-gray-400">
                                                    {task.assigned_name || "Unassigned"}
                                                </span>

                                                <span className={`${
                                                    isOverdue 
                                                        ? "text-red-500 font-bold" 
                                                        : "text-gray-400"
                                                }`}>
                                                    {task.due_date 
                                                        ? new Date(task.due_date).toLocaleDateString() 
                                                        : "No date"}
                                                </span>
                                            </div>

                                            {/* OVERDUE */}
                                            {isOverdue && (
                                                <div className="mt-2 text-[10px] text-red-500 font-bold uppercase">
                                                    Overdue
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>

                    </div>
                ))}
            </div>

            {/* CREATE TASK MODAL */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl">

                        <h2 className="text-xl font-bold mb-4">Create Task</h2>

                        <input
                            type="text"
                            placeholder="Task Title"
                            value={taskData.title}
                            onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                            className="w-full mb-3 p-3 border rounded-lg"
                        />

                        <textarea
                            placeholder="Description"
                            value={taskData.description}
                            onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                            className="w-full mb-3 p-3 border rounded-lg"
                        />

                        <input
                            type="date"
                            value={taskData.due_date}
                            onChange={(e) => setTaskData({...taskData, due_date: e.target.value})}
                            className="w-full mb-3 p-3 border rounded-lg"
                        />

                        <input
                            type="number"
                            placeholder="Assign User ID (optional)"
                            value={taskData.assigned_to}
                            onChange={(e) => setTaskData({...taskData, assigned_to: e.target.value})}
                            className="w-full mb-4 p-3 border rounded-lg"
                        />

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowTaskModal(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200"
                            >
                                Cancel
                            </button>

                            <button 
                                onClick={createTask}
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
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

export default ProjectDetails;