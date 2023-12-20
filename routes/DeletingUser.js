const express = require('express');
const router = express.Router();
const User = require('../models/User');

// DELETE route to delete a user
router.delete("/:id", async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});

module.exports = router;
