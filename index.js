const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`\n📥 [${req.method}] ${req.url} - Petición recibida`);
    console.log(`📦 Body recibido:`, req.body);
    next();
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error("❌ [Error 400] JSON malformado enviado por el cliente.");
        return res.status(400).json({ error: "El cuerpo de la petición contiene un JSON inválido o malformado." });
    }
    next(); 
});

app.post('/text/process', (req, res, next) => {
    try {
        const { text } = req.body;

        if (text === undefined || text === null) {
            console.warn("⚠️ [Error 400] Falta el campo 'text'");
            return res.status(400).json({ error: "El campo 'text' es requerido en el cuerpo de la petición." });
        }
        if (typeof text !== 'string') {
            console.warn(`⚠️ [Error 400] Tipo de dato incorrecto. Se recibió: ${typeof text}`);
            return res.status(400).json({ error: "El campo 'text' debe ser una cadena de texto (string)." });
        }

        let stepsArray = [text];
        let currentString = text;
        const innerRegex = /\(([^()]+)\)/g;

        let previousString = "";

        while (currentString.includes('(') && currentString !== previousString) {
            previousString = currentString;
            
            currentString = currentString.replace(innerRegex, (match, innerContent) => {
                return innerContent.split('').reverse().join('');
            });
            
            if (currentString !== previousString) {
                stepsArray.push(currentString);
            }
        }

        if (currentString.includes('(') || currentString.includes(')')) {
            console.warn("⚠️ [Error 400] Paréntesis desbalanceados detectados.");
            return res.status(400).json({ 
                error: "Sintaxis incorrecta: Paréntesis desbalanceados o sin cerrar." 
            });
        }

        console.log("✅ [Éxito 200] Paréntesis procesados correctamente.");
        res.status(200).json({ result: stepsArray });

    } catch (error) {
        next(error); 
    }
});

app.post('/text/transform', (req, res, next) => {
    try {
        const { text } = req.body;

        if (text === undefined || text === null) {
            console.warn("⚠️ [Error 400] Falta el campo 'text'");
            return res.status(400).json({ error: "El campo 'text' es requerido en el cuerpo de la petición." });
        }
        if (typeof text !== 'string') {
            console.warn(`⚠️ [Error 400] Tipo de dato incorrecto. Se recibió: ${typeof text}`);
            return res.status(400).json({ error: "El campo 'text' debe ser una cadena de texto (string)." });
        }

        let alternatingCaps = '';
        let isUpper = true; 

        for (let char of text) {
            if (/[a-zA-Z]/.test(char)) {
                alternatingCaps += isUpper ? char.toUpperCase() : char.toLowerCase();
                isUpper = !isUpper; 
            } else {
                alternatingCaps += char;
                isUpper = true; 
            }
        }

        const vowelMap = { 
            'a':'e', 'e':'i', 'i':'o', 'o':'u', 'u':'a',
            'A':'E', 'E':'I', 'I':'O', 'O':'U', 'U':'A' 
        };
        const vowelReplacement = text.replace(/[aeiouAEIOU]/g, match => vowelMap[match]);

        const wordsList = text.match(/\b[a-zA-Z]+\b/g) || [];
        const frequencyCounter = {};

        wordsList.forEach(word => {
            let normalizedWord = word.toLowerCase();
            frequencyCounter[normalizedWord] = (frequencyCounter[normalizedWord] || 0) + 1;
        });

        const uniqueWords = wordsList.filter(word => frequencyCounter[word.toLowerCase()] === 1);

        console.log("✅ [Éxito 200] Transformaciones de texto completadas.");
        res.status(200).json({
            alternating_caps: alternatingCaps,
            vowel_replacement: vowelReplacement,
            unique_words: uniqueWords
        });

    } catch (error) {
        next(error);
    }
});

app.get('/', (req, res) => {
    res.status(200).json({
        mensaje: "🚀 API de Procesamiento de Texto en línea",
        estado: "Funcionando correctamente",
        documentacion: "Consulta el repositorio para ver los endpoints disponibles (POST /text/process y POST /text/transform)"
    });
});

app.use((req, res) => {
    console.warn(`⚠️ [Error 404] Intento de acceso a ruta inexistente: ${req.url}`);
    res.status(404).json({ 
        error: "Endpoint no encontrado.", 
        message: "Las rutas válidas son POST /text/process y POST /text/transform" 
    });
});

app.use((err, req, res, next) => {
    console.error("🔥 [Error 500] Falla crítica en el servidor:", err.message);
    console.error(err.stack);
    
    res.status(500).json({ 
        error: "Error interno del servidor.", 
        message: "Ocurrió un problema inesperado al procesar la solicitud." 
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n🧐 API de procesamiento iniciada en el puerto ${PORT}`);
    console.log(`👀 Esperando peticiones...`);
});

module.exports = app;