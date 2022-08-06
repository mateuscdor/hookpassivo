/* eslint-disable prettier/prettier */
import { rmSync, readdir } from 'fs'
import { join } from 'path'
import pino from 'pino'
import makeWASocket, {
    makeWALegacySocket,
    useMultiFileAuthState,
    useSingleFileLegacyAuthState,
    makeInMemoryStore,
    Browsers,
    DisconnectReason,
    delay,
} from '@adiwajshing/baileys'
import { toDataURL } from 'qrcode'
import __dirname from './dirname.js'
import response from './response.js'

import axios from 'axios';
axios.defaults.timeout = 60000;

const sessions = new Map()
const retries = new Map()

const sessionsDir = (sessionId = '') => {
    return join(__dirname, 'sessions', sessionId ? sessionId : '')
}

const isSessionExists = (sessionId) => {
    return sessions.has(sessionId)
}

const shouldReconnect = (sessionId) => {
    let maxRetries = parseInt(process.env.MAX_RETRIES ?? 0)
    let attempts = retries.get(sessionId) ?? 0

    maxRetries = maxRetries < 1 ? 1 : maxRetries

    if (attempts < maxRetries) {
        ++attempts

        console.log('Reconnecting...', { attempts, sessionId })
        retries.set(sessionId, attempts)

        return true
    }

    return false
}

const createSession = async (sessionId, isLegacy = false, res = null) => {
    const sessionFile = (isLegacy ? 'legacy_' : 'md_') + sessionId + (isLegacy ? '.json' : '')

    const logger = pino({ level: 'warn' })
    const store = makeInMemoryStore({ logger })

    let state, saveState

    if (isLegacy) {
        ;({ state, saveState } = useSingleFileLegacyAuthState(sessionsDir(sessionFile)))
    } else {
        ;({ state, saveCreds: saveState } = await useMultiFileAuthState(sessionsDir(sessionFile)))
    }

    /**
     * @type {import('@adiwajshing/baileys').CommonSocketConfig}
     */
    const waConfig = {
        auth: state,
        printQRInTerminal: true,
        logger,
        browser: Browsers.ubuntu('Chrome'),
    }

    /**
     * @type {import('@adiwajshing/baileys').AnyWASocket}
     */
    const wa = isLegacy ? makeWALegacySocket(waConfig) : makeWASocket.default(waConfig)

    if (!isLegacy) {
        store.readFromFile(sessionsDir(`${sessionId}_store.json`))
        store.bind(wa.ev)
    }

    sessions.set(sessionId, { ...wa, store, isLegacy })

    wa.ev.on('creds.update', saveState)

    wa.ev.on('chats.set', ({ chats }) => {
        if (isLegacy) {
            store.chats.insertIfAbsent(...chats)
        }
    })

    // Automatically read incoming messages, uncomment below codes to enable this behaviour
    wa.ev.on('messages.upsert', async (m) => {      
        try {
            const message = m.messages[0]
            if (typeof message.key.participant !== 'undefined') {
                return
            }

            const sendNumber = message.key.remoteJid
            if (!message.key.fromMe && m.type === 'notify') {
                if (typeof message.message === 'undefined') {
                    const session = getSession(sessionId)
                    const mesagemDeErro =
                        'Ops!\nSabe quando o WhatsApp fico carregando a mensagem mas não exibe? Aconteceu isso agora.🙄\nPoderia reenviar a última mensagem?'
                    await session.sendMessage(sendNumber, { text: mesagemDeErro })
                    console.log('erro de mensagem primaria', sendNumber)
                    return
                }

                const body =
                    message.message.listResponseMessage === null
                        ? message.message.extendedTextMessage === null
                            ? message.message.conversation
                            : message.message.extendedTextMessage.text
                        : message.message.listResponseMessage.title             

                await delay(1000)
                if (isLegacy) {
                    await wa.chatRead(message.key, 1)
                } else {
                    await wa.sendReadReceipt(message.key.remoteJid, message.key.participant, [message.key.id])
                }

                try {
                    const payload = {
                        user: sendNumber.split('@')[0],
                        message: body,
                        sessionId,
                        fullData: message
                    }
                    console.log(payload.user, 'recebida', body, new Date())
                    await axios
                        .post('https://us-central1-marcaai-a6efb.cloudfunctions.net/chatbothook', payload)
                        .then(async (response) => {
                            console.log(response.data.tipo)
                            if (response.data.tipo === 0) {
                                const responseMessage = response.data.message

                                const { body } = responseMessage
                                const { title } = responseMessage
                                const { footer } = responseMessage
                                const { titleListButton } = responseMessage
                                const { sections } = responseMessage

                                const listMessage = {
                                    text: body,
                                    footer,
                                    title,
                                    buttonText: titleListButton,
                                    sections,
                                }

                                try {
                                    const session = getSession(sessionId)
                                    await session.sendMessage(sendNumber, listMessage)
                                } catch (e) {
                                    console.log('error', e)
                                    const session = getSession(sessionId)
                                    await session.sendMessage(sendNumber, {
                                        text: 'Ops, tivemos um erro inesperado, favor enviar novamente a última mensagem',
                                    })
                                    console.log(sendNumber, 'erro', new Date())
                                }
                            } else {
                                const session = getSession(sessionId)
                                await session.sendMessage(sendNumber, { text: response.data.message })
                            }
                        })
                    console.log(payload.user, 'repondida', new Date())
                } catch (e) {
                    const session = getSession(sessionId)
                    await session.sendMessage(sendNumber, {
                        text: 'Ops, tivemos um erro inesperado, favor enviar novamente a última mensagem',
                    })
                    console.log(sendNumber, 'erro', new Date())
                    console.log('error http', e)
                }
            }
        } catch (e) {
            try {
                console.log('error geral', e)
                const message = m.messages[0]
                const sendNumber = message.key.remoteJid
                const session = getSession(sessionId)
                await session.sendMessage(sendNumber, {
                    text: 'Ops, tivemos um erro inesperado, favor enviar novamente a última mensagem',
                })
                console.log(sendNumber, 'erro', new Date())
            } catch (e) {
                console.log('aqui ', e)
            }
        }
    })

    wa.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        const statusCode = lastDisconnect?.error?.output?.statusCode

        if (connection === 'open') {
            retries.delete(sessionId)
        }

        if (connection === 'close') {
            if (statusCode === DisconnectReason.loggedOut || !shouldReconnect(sessionId)) {
                if (res && !res.headersSent) {
                    response(res, 500, false, 'Não foi possível criar a sessão.')
                }

                return deleteSession(sessionId, isLegacy)
            }

            setTimeout(
                () => {
                    createSession(sessionId, isLegacy, res)
                },
                statusCode === DisconnectReason.restartRequired ? 0 : parseInt(process.env.RECONNECT_INTERVAL ?? 0)
            )
        }

        if (update.qr) {
            if (res && !res.headersSent) {
                try {
                    const qr = await toDataURL(update.qr)

                    response(res, 200, true, 'Código gerado, por favor digitalize o QR Code.', { qr })

                    return
                } catch {
                    response(res, 500, false, 'Não foi possível Gerar o código QR.')
                }
            }

            try {
                await wa.logout()
            } catch {
            } finally {
                deleteSession(sessionId, isLegacy)
            }
        }
    })
}

/**
 * @returns {(import('@adiwajshing/baileys').AnyWASocket|null)}
 */
const getSession = (sessionId) => {
    return sessions.get(sessionId) ?? null
}

const deleteSession = (sessionId, isLegacy = false) => {
    const sessionFile = (isLegacy ? 'legacy_' : 'md_') + sessionId + (isLegacy ? '.json' : '')
    const storeFile = `${sessionId}_store.json`
    const rmOptions = { force: true, recursive: true }

    rmSync(sessionsDir(sessionFile), rmOptions)
    rmSync(sessionsDir(storeFile), rmOptions)

    sessions.delete(sessionId)
    retries.delete(sessionId)
}

const getChatList = (sessionId, isGroup = false) => {
    const filter = isGroup ? '@g.us' : '@s.whatsapp.net'

    return getSession(sessionId).store.chats.filter((chat) => {
        return chat.id.endsWith(filter)
    })
}

/**
 * @param {import('@adiwajshing/baileys').AnyWASocket} session
 */
const isExists = async (session, jid, isGroup = false) => {
    try {
        let result

        if (isGroup) {
            result = await session.groupMetadata(jid)

            return Boolean(result.id)
        }

        if (session.isLegacy) {
            result = await session.onWhatsApp(jid)
        } else {
            ;[result] = await session.onWhatsApp(jid)
        }

        return result.exists
    } catch {
        return false
    }
}

/**
 * @param {import('@adiwajshing/baileys').AnyWASocket} session
 */
const sendMessage = async (session, receiver, message, delayMs = 1000) => {
    try {
        await delay(parseInt(delayMs))

        return session.sendMessage(receiver, message)
    } catch {
        return Promise.reject(null) // eslint-disable-line prefer-promise-reject-errors
    }
}

const formatPhone = (phone) => {
    if (phone.endsWith('@s.whatsapp.net')) {
        return phone
    }

    let formatted = phone.replace(/\D/g, '')

    return (formatted += '@s.whatsapp.net')
}

const formatGroup = (group) => {
    if (group.endsWith('@g.us')) {
        return group
    }

    let formatted = group.replace(/[^\d-]/g, '')

    return (formatted += '@g.us')
}

const cleanup = () => {
    console.log('Running cleanup before exit.')

    sessions.forEach((session, sessionId) => {
        if (!session.isLegacy) {
            session.store.writeToFile(sessionsDir(`${sessionId}_store.json`))
        }
    })
}

const init = () => {
    readdir(sessionsDir(), (err, files) => {
        if (err) {
            throw err
        }

        for (const file of files) {
            if ((!file.startsWith('md_') && !file.startsWith('legacy_')) || file.endsWith('_store')) {
                continue
            }

            const filename = file.replace('.json', '')
            const isLegacy = filename.split('_', 1)[0] !== 'md'
            const sessionId = filename.substring(isLegacy ? 7 : 3)

            createSession(sessionId, isLegacy)
        }
    })
}

export {
    isSessionExists,
    createSession,
    getSession,
    deleteSession,
    getChatList,
    isExists,
    sendMessage,
    formatPhone,
    formatGroup,
    cleanup,
    init,
}
