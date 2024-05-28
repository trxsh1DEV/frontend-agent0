import fs from "fs";

// Lê o arquivo JSON
fs.readFile("./data.json", "utf8", (err, data) => {
  if (err) {
    console.error("Erro ao ler o arquivo JSON:", err);
    return;
  }

  try {
    // Converte o conteúdo do arquivo JSON em um array de objetos JavaScript
    const articles = JSON.parse(data);

    // Modifica o campo "score" de cada objeto, convertendo-o para número
    articles.forEach((article) => {
      if (typeof article.score !== "number") {
        article.score = Number(article.score.replace(",", ".")); // Convertendo para número
      }
    });

    // Escreve o arquivo de volta com os objetos modificados
    fs.writeFile("./data.json", JSON.stringify(articles, null, 2), (err) => {
      if (err) {
        console.error("Erro ao escrever o arquivo JSON:", err);
        return;
      }
      console.log("Arquivo JSON atualizado com sucesso!");
    });
  } catch (parseError) {
    console.error("Erro ao fazer o parse do arquivo JSON:", parseError);
  }
});
