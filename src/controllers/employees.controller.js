import { pool } from "../db.js"

const getEmployees = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM employee")
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            msg: "Something goes wrong"
        })
    }

}

const getEmployeesById = async (req, res) => {
    try {
        const { id } = req.params
        const [row] = await pool.query(`SELECT * FROM employee WHERE id = ? `, [id])

        if (row.length <= 0) return res.status(404).json({
            msg: "Employee not found"
        })
        res.json(row[0])
    } catch (error) {
        return res.status(500).json({
            msg: "Something goes wrong"
        })
    }
}

const createEmployees = async (req, res) => {
    try {
        const { name, salary } = req.body
        const [rows] = await pool.query("INSERT INTO employee (name,salary) VALUES (?,?)", [name, salary])
        res.json({
            id: rows.insertId,
            name,
            salary
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Something goes wrong"
        })
    }
}

const updateEmployees = async (req, res) => {
    const { id } = req.params
    const { name, salary } = req.body
    try {
        const [result] = await pool.query(`UPDATE employee SET name = IFNULL(?,name), salary = IFNULL(?,salary) WHERE id = ?`, [name, salary, id])
        if (result.affectedRows === 0) return res.status(404).json({
            msg: "Employee not found"
        })

        const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [id])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            msg: "Something goes wrong"
        })
    }
}

const deleteEmployees = async (req, res) => {
    const { id } = req.params
    try {
        const [result] = await pool.query("DELETE FROM employee WHERE id = ?", [id])
        if (result.affectedRows === 0) return res.status(404).json({ msg: "El usuario no se pudo eliminar" })

        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            msg: "Something goes wrong"
        })
    }

}

export {
    getEmployees,
    createEmployees,
    updateEmployees,
    deleteEmployees,
    getEmployeesById
}