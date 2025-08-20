# ☀️ Weather App

## 📝 Sobre o Projeto
Este é um aplicativo de previsão do tempo dinâmico e responsivo, construído com React.js. Ele resolve um problema comum: a necessidade de uma interface de clima limpa, intuitiva e sem distrações.

Ao consumir dados da Open-Meteo API, o aplicativo oferece informações essenciais do clima em tempo real, como temperatura atual, umidade, sensação térmica e uma previsão para os próximos dias. Todo o design é focado na experiência do usuário, permitindo que qualquer pessoa obtenha as informações que precisa de forma rápida e eficiente.

## 🚀 Tecnologias Utilizadas
- React.js: Biblioteca JavaScript para a construção da interface do usuário.
- Fetch API: Para realizar as requisições HTTP e buscar os dados de clima da API.
- Open-Meteo API: Uma fonte de dados gratuita sobre o clima.
- CSS Modules: Para estilização isolada e modular de cada componente.

## ⚙️ Como Instalar e Rodar Localmente
Siga os passos abaixo para ter uma cópia do projeto rodando em sua máquina.

Pré-requisitos
- Node.js e npm (ou yarn) instalados.

Passos
- Clone o repositório:
git clone https://github.com/matheus-pestana/WeatherSENAI.git

- Navegue até a pasta do projeto:
cd seu-repositorio

- Instale as dependências:
npm install
ou
yarn install

- Inicie o servidor de desenvolvimento:
npm start
ou
yarn start

O projeto será iniciado e aberto automaticamente no seu navegador padrão em http://localhost:3000.

## 💻 Como o Projeto Funciona
O projeto utiliza a Fetch API em conjunto com a sintaxe async/await para fazer as requisições HTTP de forma moderna e limpa. A lógica de busca de dados é implementada dentro de um useEffect para garantir que as informações sejam carregadas quando o componente é montado ou quando a cidade de busca é alterada.

Além disso, o projeto possui um tratamento de erros robusto. Ele verifica se a resposta da API foi bem-sucedida (response.ok) e usa um bloco try/catch para lidar com qualquer erro de rede ou de status HTTP, garantindo que o usuário receba uma mensagem de feedback clara caso algo dê errado.

## 🤝 Contribuições
Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request com melhorias.

## 📧 Contato
Matheus Arcangelo Pestana - https://www.linkedin.com/in/matheus-arcangelo/ - matheus0pestana@gmail.com  
Eduardo de Oliveira Couto - https://www.linkedin.com/in/eduardo-couto-a0a858279/ - d.couto1314@gmail.com  
Pedro Gabriel Moreira dos Santos - https://www.linkedin.com/in/pedro-santos-74480726b/ - pedrogabrielxx268@gmail.com
