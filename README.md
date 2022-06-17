# Owen API by Baileys

Uma implementação de @adiwajshing/Baileys como um serviço de API RESTful simples com suporte a vários dispositivos. Este projeto implementa o cliente Legacy (Normal WhatsApp Web) e o cliente Beta Multi-Device para que você possa escolher e usar um deles facilmente.

## Caso queiram ajudar financeiramente a manter o projeto, pode contribuir no link abaixo ou via PIX: 
- [Contribuir](https://pag.ae/) 
- ## CHAVE PIX ALEATORIA; d80c574e-4c5a-4f93-ae26-d5ba1806ee9c
## Instalando a Owen API

## Requerimentos

-   **Ubutun** version **20.x** ou superior
-   **NodeJS** version **16.x** ou superior.
-   **PM2** version **8.x** ou superior.

## Instalação

1. Fazer download ou Clone do Repositorio
2. Acessar o repositorio do projeto.
3. Instalar as dependencias.
4. Inicializar a aplicação.

## Configurando o `.env` 

```env
# Listening Host
HOST=127.0.0.1 (caso utilize, insira o ip da VPS ou Dominio aqui.)

# Listening Port
PORT=3000

# Maximum Reconnect Attempts
MAX_RETRIES=5

# Reconnect Interval (in Milliseconds)
RECONNECT_INTERVAL=5000
```
## Uso

1. Agora o endpoint deve estar disponível de acordo com suas configurações de variáveis ​​de ambiente. O padrão é em http://localhost:3000 e/ou http://127.0.0.1:3000.
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
