const path = require('path');
const dotenv = require('dotenv')

// Carga de .env de forma relativa al directorio backend del servidor
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = require('./src/app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});