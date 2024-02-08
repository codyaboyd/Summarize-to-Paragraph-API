import express from 'express'; 
import { pipeline } from '@xenova/transformers'; 
const app = express();
const pipe = await pipeline('summarization','Xenova/bart-large-cnn');
// Middleware to parse JSON requests
app.use(express.json());
// Endpoint to handle summarization
app.post('/summarize', async (req, res) => { const { text } = req.body;
 if (!text) 
    return res.status(400).json({ error: 'text is required' });
    
    try { 
        const summary = await pipe(text,{max_new_tokens: 1000,min_new_tokens: 100,});
          return res.json({ summary });
    } catch (error) {
        console.error('An error occurred:', error); return res.status(500).json({ 
        error: 'Internal Server Error' });
    }
});
// Command-line argument handling for port
if (process.argv.length !== 3) { console.error('Usage: node script.mjs <port>'); 
    process.exit(1);
}
const port = process.argv[2];
// Start the server
app.listen(port, () => { console.log(`Server is running on 
    http://localhost:${port}`);
});
