const db = require('../config/db');

// CREATE TASK
exports.createTask = async (req, res) => {
    try {
        const { project_id, title, description, assigned_to, due_date } = req.body;

        if (!project_id || !title) {
            return res.status(400).json({ message: "Project and title required" });
        }

        await db.execute(
            `INSERT INTO tasks (project_id, title, description, assigned_to, due_date) 
             VALUES (?, ?, ?, ?, ?)`,
            [project_id, title, description || null, assigned_to || null, due_date || null]
        );

        res.status(201).json({ message: "Task created successfully" });

    } catch (err) {
        console.log("CREATE TASK ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// GET TASKS
exports.getTasksByProject = async (req, res) => {
    try {
        const [tasks] = await db.execute(
            `SELECT tasks.*, users.username AS assigned_name 
             FROM tasks 
             LEFT JOIN users ON tasks.assigned_to = users.id 
             WHERE project_id = ?`,
            [req.params.projectId]
        );

        res.json(tasks);

    } catch (err) {
        console.log("GET TASK ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// UPDATE STATUS
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status required" });
        }

        await db.execute(
            "UPDATE tasks SET status = ? WHERE id = ?",
            [status, req.params.id]
        );

        res.json({ message: "Status updated successfully" });

    } catch (err) {
        console.log("UPDATE STATUS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};