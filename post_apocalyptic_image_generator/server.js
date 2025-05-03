const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.static('public'));

app.post('/api/generate', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;

    const response = await openai.images.edit({
      image: fs.createReadStream(imagePath),
      mask: fs.createReadStream(imagePath),
      prompt: "post-apocalyptic satellite view of Earth, destroyed cities, dark skies, realistic",
      n: 1,
      size: "1024x1024"
    });

    fs.unlinkSync(imagePath);

    res.json({ image_url: response.data[0].url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar imagem' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
