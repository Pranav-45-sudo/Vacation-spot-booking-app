const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors()); // This prevents the "CORS error"

// 1. Connect to MongoDB (Local or Atlas)
const dbURI = 'mongodb+srv://pranav17827_db_user:[EMAIL_ADDRESS]/?appName=Vacmode';
mongoose.connect(dbURI)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.log("Database connection error:", err));

// 2. Define how a User looks (Schema)
const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 3. The Registration Route (for create.html)
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Secure the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User saved to MongoDB!" });
    } catch (err) {
        res.status(400).json({ error: "Email already exists!" });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
module.exports = app;