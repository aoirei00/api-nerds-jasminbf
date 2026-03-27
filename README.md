# 👩🏻‍💻 API de Procesamiento de Texto

Esta es una API RESTful construida con **Node.js** y **Express**, diseñada para procesar y manipular cadenas de texto. Implementa validaciones estrictas, manejo global de excepciones y respuestas estructuradas en JSON.

🌍 **Live Demo:** [https://api-nerds-jasminbf.vercel.app/]

## 🦾 ¿Cómo está construida?
* **Base:** Node.js y Express.js.
* **Conectividad:** Configurada para permitir conexiones externas y procesamiento de datos en formato JSON.
* **Estabilidad:** Incluye una Manejo Global de Errores que evita que la aplicación se detenga ante entradas inesperadas.
* **Monitoreo:** Sistema de mensajes en consola para rastrear cada petición y facilitar el mantenimiento.

## ⚙️ Instalación y Ejecución Local

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/aoirei00/api-nerds-jasminbf
   ```
2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
El servidor estará escuchando en `http://localhost:3000`.

---

## 📌 Documentación de Endpoints

### 1. Inversión por Paréntesis Anidados
Busca y resuelve grupos de palabras entre paréntesis desde el nivel más interno hacia el externo.

* **URL:** `/text/process`
* **Método:** `POST`
* **Headers:** `Content-Type: application/json`
* **Body (Payload):**
  ```json
  {
    "text": "(Hola (Mundo))"
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "result": [
      "(Hola (Mundo))",
      "(Hola odnuM)",
      "Mundo aloH"
    ]
  }
  ```

### 2. Transformación de Texto Múltiple
Aplica tres operaciones simultáneas: capitalización alternada (reseteando mayúsculas al inicio de cada palabra), rotación secuencial de vocales y extracción de palabras únicas.

* **URL:** `/text/transform`
* **Método:** `POST`
* **Headers:** `Content-Type: application/json`
* **Body (Payload):**
  ```json
  {
    "text": "Hello world! This is a test. Hello again."
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "alternating_caps": "HeLlO WoRlD! ThIs Is A TeSt. HeLlO AgAiN.",
    "vowel_replacement": "Hille wurld! Thus os e tist. Hille egen.",
    "unique_words": [
      "world", 
      "This", 
      "is", 
      "a", 
      "test", 
      "again"
    ]
  }
  ```

---

## 🛡️ Manejo de Errores y Excepciones
Para garantizar la estabilidad del servicio, la API está blindada contra malas peticiones. Retornará códigos HTTP estándar acompañados de un JSON descriptivo:

* **400 Bad Request:** Cuando el payload no contiene el campo `text`, el valor enviado no es un `string`, o el JSON está malformado.
* **404 Not Found:** Cuando se intenta acceder a una ruta no registrada.
* **500 Internal Server Error:** Atrapado por un Global Error Handler para evitar la caída del proceso ante fallos lógicos.