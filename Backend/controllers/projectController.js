const db = require('../config/db');

exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        // ✅ validation
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Project name is required" });
        }

        // ✅ check user from token
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized - user missing" });
        }

        const userId = req.user.id;

        await db.execute(
            'INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)',
            [name, description || null, userId]
        );

        res.status(201).json({ message: "Project created successfully" });

    } catch (err) {
        console.log("CREATE PROJECT ERROR:", err); // 🔥 important debug
        res.status(500).json({ message: "Server error" });
    }
};


exports.getAllProjects = async (req, res) => {
    try {
        const [projects] = await db.execute(`
            SELECT p.*, u.username AS created_by_name
            FROM projects p
            LEFT JOIN users u ON p.created_by = u.id
            ORDER BY p.id DESC
        `);

        res.json(projects);

    } catch (err) {
        console.log("GET PROJECTS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getProjectById = async (req, res) => {
    try {
        const [project] = await db.execute(`
            SELECT p.*, u.username AS created_by_name
            FROM projects p
            LEFT JOIN users u ON p.created_by = u.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (project.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project[0]);

    } catch (err) {
        console.log("GET PROJECT BY ID ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};