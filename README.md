# Owen API by Baileys

Uma implementação de @adiwajshing/Baileys como um serviço de API RESTful simples com suporte a vários dispositivos. Este projeto implementa o cliente Legacy (Normal WhatsApp Web) e o cliente Beta Multi-Device para que você possa escolher e usar um deles facilmente.

## Instalando a Owen API


## iniciando o auto instalador OwenAPI
- ```sudo apt install -y git && git clone https://github.com/owenzap/apiowen.git ./OwenAPI/ && sudo chmod -R 777 ./OwenAPI && cd ./OwenAPI && sudo ./OwenAPI.sh```

##  Preparando o ambiente para instalação
1 - ```sudo apt update && sudo apt install unzip && curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh && sudo bash nodesource_setup.sh && sudo apt install nodejs && sudo apt update && sudo apt install mysql-server -y```

## Baixando Repositorio OwenAPI
2 - ```sudo apt install -y git && git clone https://github.com/owenzap/apiowen.git ./OwenAPI/ && sudo chmod -R 777 ./OwenAPI && cd ./OwenAPI```

## Instalando as dependências & Inicializando..
3 - ```cd && cd ./OwenAPI && sudo npm install && sudo npm install -g pm2 && pm2 start app.js --name Owen_API && pm2 startup && pm2 save```

## Configurando o `.env` 

```env
# Listening Host
HOST=127.0.0.1 (Caso utilize, altere aqui para o IP da VPS ou dominio)

# Listening Port
PORT=8000

# Maximum Reconnect Attempts
MAX_RETRIES=5

# Reconnect Interval (in Milliseconds)
RECONNECT_INTERVAL=5000
```

## Uso

1. Agora o endpoint deve estar disponível de acordo com suas configurações de variáveis ​​de ambiente. O padrão é em http://localhost:8000.
Confira também o examplesdiretório para os exemplos básicos de uso.

## API Docs

A documentação da API está disponível online aqui . Você também pode importar o arquivo de coleção Postman (postman_collection.json) em seu aplicativo Postman alternativamente.

O servidor responderá no seguinte formato JSON:

```javascript
{
    success: true|false, // bool
    message: "", // string
    data: {}|[] // object or array of object
}
```

## Sending Message

Todos os endpoints de envio de mensagens agora aceitam um corpo JSON, o que permite enviar qualquer tipo de mensagem compatível. Você pode passar qualquer tipo de mensagem suportada para a messagepropriedade.

Aqui estão alguns exemplos:

```javascript
// Send text message
{
    receiver: '628231xxxxx',
    message: {
        text: 'Hello there!'
    }
}

// Send image
{
    receiver: '628231xxxxx',
    message: {
        image: {
            url: 'https://example.com/logo.png'
        },
        caption: 'My logo'
    }
}

// Send video
{
    receiver: '628231xxxxx',
    message: {
        video: {
            url: 'https://example.com/intro.mp4'
        },
        caption: 'My intro'
    }
}

// Send document
{
    receiver: '628231xxxxx',
    message: {
        document: {
            url: 'https://example.com/presentation.pdf'
        },
        mimetype: 'application/pdf',
        fileName: 'presentation-1.pdf'
    }
}
```

Para mais exemplos, confira os documentos de Baileys aqui .

## Notas

- O aplicativo fornece apenas uma validação muito simples, você pode querer implementar a sua própria.
- Ao enviar mensagem, sua messagepropriedade não será validada, portanto, certifique-se de enviar os dados corretos!
- Não há autenticação, você pode querer implementar a sua própria.
- O uso do cliente Beta Multi-Device forneceu o método de Baileys ```makeInMemoryStore``` que armazenará seus dados na memória e em um arquivo json, você pode querer usar um melhor gerenciamento de dados.
- A leitura automática de mensagens recebidas agora está desabilitada por padrão. Descomente whatsapp.js:91-105para habilitar esse comportamento.

## Notificação

Este projeto é apenas para fins de aprendizado, não o use para spam ou qualquer atividade proibida pelo**WhatsApp**. .
