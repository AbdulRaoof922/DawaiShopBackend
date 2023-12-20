const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET route to fetch all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

module.exports = router;
