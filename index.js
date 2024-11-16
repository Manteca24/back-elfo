const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// Middlewares
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("elfo backend is working! 🎉");
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});