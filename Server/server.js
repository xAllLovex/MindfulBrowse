require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mindfulbrowse', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define a schema for blocked sites
const blockedSiteSchema = new mongoose.Schema({
    url: String,
    timestamp: { type: Date, default: Date.now }
});

const BlockedSite = mongoose.model('BlockedSite', blockedSiteSchema);

// API Endpoint to Get Blocked Sites
app.get('/blocked-sites', async (req, res) => {
    try {
        const sites = await BlockedSite.find();
        res.json(sites);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// API Endpoint to Add a Blocked Site
app.post('/block-site', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        const newSite = new BlockedSite({ url });
        await newSite.save();
        res.status(201).json({ message: 'Site blocked successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// API Endpoint to Remove a Blocked Site
app.post('/unblock-site', async (req, res) => {
    try {
        const { url } = req.body;
        await BlockedSite.deleteOne({ url });
        res.json({ message: 'Site unblocked successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
