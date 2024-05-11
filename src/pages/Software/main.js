function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function generateRandomSoftwareData() {
  const softwares = [
    "Adobe",
    "Office",
    "Winrar",
    "Chrome",
    "Photoshop",
    "Visual Studio",
    "Skype",
    "AutoCAD",
    "Firefox",
    "Discord",
  ];
  const categorias = [
    "Arquivos",
    "Navegador",
    "Design",
    "3D",
    "Desenvolvimento",
    "Comunicação",
  ];

  const objetos = [];

  for (let i = 0; i < 5; i++) {
    const software = softwares[Math.floor(Math.random() * softwares.length)];
    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
    const mapeado = Math.random() < 0.5; // Aleatório true/false
    const primeiroInventario = getRandomDate(
      new Date(2022, 0, 1),
      new Date()
    ).toLocaleString("pt-BR");
    const ultimaUtilizacao = getRandomDate(
      new Date(2022, 0, 1),
      new Date()
    ).toLocaleString("pt-BR");
    const licenciado = Math.random() < 0.5; // Aleatório true/false
    const expiracaoLicenca = getRandomDate(
      new Date(2025, 0, 1),
      new Date(2027, 11, 31)
    ).toLocaleString("pt-BR");

    objetos.push({
      software,
      categoria,
      mapeado,
      primeiro_inventario: primeiroInventario,
      ultima_utilizacao: ultimaUtilizacao,
      licenciado,
      expiracao_licenca: expiracaoLicenca,
    });
  }

  return JSON.stringify(objetos, null, 4);
}

console.log(generateRandomSoftwareData());
