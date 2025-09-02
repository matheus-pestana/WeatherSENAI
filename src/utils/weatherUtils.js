// Arquivo: src/utils/weatherUtils.js (VERSÃO CORRIGIDA) ✅

export const getDayOfWeek = (dateString) => {
  // A API retorna "YYYY-MM-DD". Vamos quebrar a string para evitar
  // que o JavaScript a interprete como UTC.
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Criamos a data usando os números. O mês em JavaScript é 0-indexado (0=Janeiro, 11=Dezembro),
  // por isso subtraímos 1 do mês. Isso cria a data no fuso horário local.
  const date = new Date(year, month - 1, day);

  const options = { weekday: 'short' };
  // Usamos 'pt-BR' para garantir que os dias sejam em português.
  let dayName = new Intl.DateTimeFormat('pt-BR', options).format(date);

  // Remove o ponto final que alguns navegadores adicionam (ex: "sáb.")
  return dayName.replace('.', '').toUpperCase();
};


export const getWeatherDescriptionAndIcon = (code) => {
  // ... sua lógica para ícones e descrições continua aqui ...
  // Exemplo:
  if (code === 0) return { description: 'Céu limpo', icon: '☀️' };
  if (code === 1 || code === 2 || code === 3) return { description: 'Parcialmente nublado', icon: '⛅️' };
  // ... adicione todos os outros códigos aqui
  return { description: 'Desconhecido', icon: '❓' };
};