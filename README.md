# Projeto de APIs do star wars

A intenção é fazer um CRUD em uma base de dados local de planetas do star wars atraves de uma API REST. Para cada planeta que for registrado na base de dados, ao realizar a obtenção do mesmo é obtido quantas vezes esse planeta ja participou de algum filme do star star wars. Para isso foi utilizado a api publica  [swapi](https://swapi.dev/).

A plataforma utilizada para o projeto foi o  [nodejs](https://nodejs.org/en/) na versão 14.17 LTS.
O banco de dados utilizado é um mongodb, e pode ser instalado atraves do site: [mongodb](https://www.mongodb.com/try/download/community).

## Preparando o ambiente
Para preparar o abiente, baixe o fonte e então execute dentro da pasta do projeto o seguinte comando:

    npm install
Com isso o ambiente ja vai estar preparado para rodar o servidor com a API.
Caso voce queira mudar URL do banco de dados modifique o arquivo `package.json` e troque o valor da propriedade `mongodbUrl`.
Caso voce queira trocar o valor default da porta que o servidor express vai rodar, modifique o arquivo `package.json` e troque o valor da propriedade `serverPort`.

## Executando o projeto
Para executar o projeto, basta rodar o comando`npm start` com isso a aplicação vai subir um servidor express e disponibilizar a API na porta configurada (default 3000)

Para executar a API utilize os seguinte conjunto de endpoint
| Metodo HTTP| URL | Descrição| 
|--|--|--|
| GET | {baseUrl}/api/planeta | Obtem a lista de planetas cadastrado na base de dados com a quantidade de filmes nos quais ele apareceu (caso tenha aparecido em algum). É possivel filtrar  pelo nome do fulme passando por `queryParam` o nome do filme, na propriedade `nome`, ex: `?nome=Tatooine`|
| GET | {baseUrl}/api/planeta/:id | Obtem um unico planeta a partir do ID dele juntamente com a quantidade de filmes nos quais o mesmo apareceu. |
| POST | {baseUrl}/api/planeta | Cadastra um novo planeta na base de dados.|
| PUT | {baseUrl}/api/planeta/:id | Modifica um planeta existente da base de dados a partir de um ID. |
| DELETE | {baseUrl}/api/planeta/:id | Exclui um planeta existente da base de dados |

## Testes
Para rodar os testes da aplicação, executar o seguinte comando `npm test`