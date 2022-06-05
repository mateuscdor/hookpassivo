# Owen API by Baileys

Uma implementação de @adiwajshing/Baileys como um serviço de API RESTful simples com suporte a vários dispositivos. Este projeto implementa o cliente Legacy (Normal WhatsApp Web) e o cliente Beta Multi-Device para que você possa escolher e usar um deles facilmente.

## Instalando a Owen API

##  Preparando o ambiente para instalação
1 - ```sudo apt update && sudo apt install unzip && curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh && sudo bash nodesource_setup.sh && sudo apt install nodejs && sudo apt update && sudo apt install mysql-server -y```

## Baixando Repositorio OwenAPI
2 - ```sudo apt install -y git && git clone https://github.com/owenzap/apiowen.git && sudo chmod -R 777 ./OwenAPI && cd ./OwenAPI```

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

The API documentation is available online [here](https://documenter.getpostman.com/view/18988925/UVeNni36). You can also import the **Postman Collection File** `(postman_collection.json)` into your Postman App alternatively.

The server will respond in following JSON format:

```javascript
{
    success: true|false, // bool
    message: "", // string
    data: {}|[] // object or array of object
}
```

## Sending Message

All send message endpoints is now accept a JSON body, this gives you the ability to send any kind of supported message. You can pass any kind supported message into the `message` property.

Here's some examples:

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

## Notes

-   The app only provide a very simple validation, you may want to implement your own.
-   When sending message, your `message` property will not be validated, so make sure you sent the right data!
-   There's no authentication, you may want to implement your own.
-   The **Beta Multi-Device** client use provided Baileys's `makeInMemoryStore` method which will store your data in memory and a json file, you may want to use a better data management.
-   Automatically reading incoming messages is now disabled by default. Uncomment `whatsapp.js:91-105` to enable this behaviour.

## Notice

This project is intended for learning purpose only, don't use it for spamming or any activities that's prohibited by **WhatsApp**.
