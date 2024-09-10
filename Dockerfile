# Use a imagem oficial do Node.js
FROM node:18.16.0

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código-fonte para o diretório de trabalho
COPY . .
