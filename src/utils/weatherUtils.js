export const getWeatherDescriptionAndIcon = (code) => {
  switch (code) {
    case 0:
      return { description: 'Céu limpo', icon: '☀️' };
    case 1:
    case 2:
    case 3:
      return { description: 'Parcialmente nublado', icon: '⛅' };
    case 45:
    case 48:
      return { description: 'Neblina', icon: '🌫️' };
    case 51:
    case 53:
    case 55:
      return { description: 'Chuvisco', icon: '🌧️' };
    case 56:
    case 57:
      return { description: 'Chuvisco Gelado', icon: '🌨️' };
    case 61:
    case 63:
    case 65:
      return { description: 'Chuva', icon: '🌧️' };
    case 66:
    case 67:
      return { description: 'Chuva Congelante', icon: '🌨️' };
    case 71:
    case 73:
    case 75:
      return { description: 'Neve', icon: '❄️' };
    case 77:
      return { description: 'Grãos de Neve', icon: '🌨️' };
    case 80:
    case 81:
    case 82:
      return { description: 'Pancadas de Chuva', icon: '🌦️' };
    case 85:
    case 86:
      return { description: 'Pancadas de Neve', icon: '🌨️' };
    case 95:
      return { description: 'Trovoada', icon: '🌩️' };
    case 96:
    case 99:
      return { description: 'Trovoada com Granizo', icon: '⛈️' };
    default:
      return { description: 'Desconhecido', icon: '🤷' };
  }
};

export const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: 'short' };
  return date.toLocaleDateString('pt-BR', options).toUpperCase().replace('.', '');
};