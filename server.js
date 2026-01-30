import express from 'express';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

// --- Database Setup ---
const defaultData = { participants: [] };
const db = await JSONFilePreset('db.json', defaultData);

// --- Server Setup ---
const app = express();
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('Headers:', JSON.stringify(req.headers));
    next();
});

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// --- API Endpoints ---

// Register a new user
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, whatsapp, city, goal, area, course, consent } = req.body;

        if (!fullName || fullName.trim() === '') {
            return res.status(400).json({ error: 'El nombre es obligatorio' });
        }

        const newParticipant = {
            id: Date.now().toString(),
            name: fullName.trim(),
            whatsapp: whatsapp || '',
            city: city || '',
            goal: goal || '',
            area: area || '',
            course: course || '',
            consent: consent || 'NO',
            registeredAt: new Date().toISOString()
        };

        await db.update(({ participants }) => participants.push(newParticipant));

        res.json({ success: true, participant: newParticipant });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar los datos' });
    }
});

// Get all users (Admin)
app.get('/api/participants', async (req, res) => {
    await db.read();
    res.json(db.data.participants);
});

// Clear users (Admin - Optional)
app.post('/api/reset', async (req, res) => {
    await db.update(data => data.participants = []);
    res.json({ success: true });
});

// --- Start ---
app.listen(PORT, () => {
    console.log(`✅ Servidor Sorteo Premium corriendo en http://localhost:${PORT}`);
    console.log(`🔐 Panel de Admin disponible en http://localhost:${PORT}/admin.html`);
});
