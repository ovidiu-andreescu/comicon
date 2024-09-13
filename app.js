const express = require('express');
const connectDB = require('./db');
const Character = require('./models/Character');
const { Universe } = require('./models/Universe');
const { md5 } = require('./utils/hashing');

connectDB();

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    res.send('Running...')
    res.send()   
})

app.get('/universes', async (req, res) => {
    try {
        const universes = await Universe.find();
        res.json(universes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch universes' });
    }
});

app.get('/characters', async (req, res) => {
    try {
        const characters = await Character.find();
        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
});

app.get('/universes', async (req, res) => {
    const { name, frequency } = req.query;
    try {
        let query = {};
        if (name) query.name = name;
        if (frequency) query.frequency = frequency;
        
        const universes = await Universe.find(query);
        res.json(universes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch universes' });
    }
});

app.get('/characters', async (req, res) => {
    const { name, universe, apparitions } = req.query;
    try {
        let query = {};
        if (name) query.name = name;
        if (universe) query.universe = universe;
        if (apparitions) query.apparitions = apparitions;
        
        const universes = await Universe.find(query);
        res.json(universes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch universes' });
    }
});

app.post('/create/characters', async (req, res) => {
    const { name, universe } = req.body;
    try {
        let query = {};
        if (universe) query.name = universe;

        // looks for a pre-existing corresponding universe
        const existingUniverse = await Universe.find(query);
        console.log(name, universe, existingUniverse);

        // if there isn't one then we create a new one
        if (existingUniverse.length === 0){
            console.log("nu exista");
            const newUniverse = new Universe({
                name: universe,
                frequency: md5(universe)
            });

            await newUniverse.save();
        }

        const now = new Date();

        const newCharacter = new Character({
            name,
            universe,
            apparitions: [now]
        });
        
        await newCharacter.save();
        
        res.status(201).json(newCharacter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create character' });
    }
});

app.post('/universes', async (req, res) => {
    const { name, frequency } = req.body;
    try {
        const newUniverse = new Universe({
            name,
            frequency
        });
        
        await newUniverse.save();
        
        res.status(201).json(newUniverse); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create universe' });
    }
});

app.post('/characters', async (req, res) => {
    const { name, universe, apparitions } = req.body;
    try {
        const newCharacter = new Character({
            name,
            universe,
            apparitions
        });
        
        await newCharacter.save();
        
        res.status(201).json(newCharacter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create character' });
    }
});

app.delete('/universes', async (req, res) => {
    const { id } = req.query;
    try {
        const universe = await Universe.findOneAndDelete({ _id: id });
        if (!universe) {
            return res.status(404).json({ error: 'Universe not found' });
        }
        const universeName = universe.name;

        const characters = await Character.deleteMany({ universe: universeName });

        res.json({ message: 'Universe deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete universe' });
    }
});

app.delete('/characters', async (req, res) => {
    const { id } = req.query;
    try {
        const character = await Character.findOneAndDelete({ _id: id });
        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }
        res.json({ message: 'Character deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete character' });
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));