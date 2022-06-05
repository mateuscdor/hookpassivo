# Owen API By Baileys

Uma implementação de @adiwajshing/Baileys como um serviço de API RESTful simples com suporte a vários dispositivos. Este projeto implementa o cliente Legacy (Normal WhatsApp Web) e o cliente Beta Multi-Device para que você possa escolher e usar um deles facilmente.

## Requirements

-   **NodeJS** version **16.x** ou superior.

## Instalando a Owen API

1. Baixando e Instalando as dependências..
1.1 - ```sudo apt install -y git && git clone https://github.com/owenzap/apiowen.git && sudo chmod -R 777 ./OwenAPI && cd && cd ./OwenAPI```
1.2 - ```sudo npm install && sudo npm install -g pm2 && pm2 start app.js --name Owen_API && pm2 save```

## `.env` Configurations

```env
# Listening Host
HOST=127.0.0.1

# Listening Port
PORT=8000

# Maximum Reconnect Attempts
MAX_RETRIES=5

# Reconnect Interval (in Milliseconds)
RECONNECT_INTERVAL=5000
```

## Usage

1. You can start the app by executing `npm run start` or `node .`.
2. Now the endpoint should be available according to your environment variable configurations. Default is at `http://localhost:8000`.

Also check out the `examples` directory for the basic usage examples.

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

For more examples, check out Baileys's docs [here](https://github.com/adiwajshing/Baileys#sending-messages).

## Notes

-   The app only provide a very simple validation, you may want to implement your own.
-   When sending message, your `message` property will not be validated, so make sure you sent the right data!
-   There's no authentication, you may want to implement your own.
-   The **Beta Multi-Device** client use provided Baileys's `makeInMemoryStore` method which will store your data in memory and a json file, you may want to use a better data management.
-   Automatically reading incoming messages is now disabled by default. Uncomment `whatsapp.js:91-105` to enable this behaviour.
-   If you have problems when deploying on **CPanel** or any other similar hosting, transpiling your code into **CommonJS** should fix the problems.

## Notice

This project is intended for learning purpose only, don't use it for spamming or any activities that's prohibited by **WhatsApp**.
