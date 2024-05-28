import fs from "fs";
import axios from "axios";

// Lê o arquivo JSON
fs.readFile("./gpu.json", "utf8", (err, data) => {
  if (err) {
    console.error("Erro ao ler o arquivo JSON:", err);
    return;
  }

  // Converte o conteúdo do arquivo JSON em um array de objetos JavaScript
  const data = JSON.parse(data);

  // Define a URL da sua API
  const apiUrl = "http://localhost:3000/hardware/gpu";

  // Função para enviar um objeto para a API
  async function postArticle(article) {
    try {
      //   console.log(article);
      const response = await axios.post(apiUrl, article);
      // console.log(article);
      console.log("Artigo inserido com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao inserir artigo:", error.response.data);
    }
  }

  // Itera sobre cada objeto e o envia para a API
  data.forEach((article) => {
    postArticle(article);
  });
});
