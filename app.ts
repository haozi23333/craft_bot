import Mirai, {Message} from "mirai-ts";
import mc from "./mc";
import {QQLink} from "./db";

const qq = new Mirai({
    host: '192.168.50.126',
    port: 8080,
    authKey: 'HAOZI233333',
    enableWebsocket: true
})

let bot_status = true

async function app() {
    await qq.link(2780167357)

    qq.on("GroupMessage", async (msg, ) => {
        const msg_slice = msg.plain.split(' ')
        const msg_length = msg_slice.length

        console.log(`群[${msg.sender.permission}][${msg.sender.group.id}][${msg.sender.group.name}][${new Date().toLocaleString()}] ${msg.plain}`)

        if (msg.plain.indexOf('#暂停机器人') === 0 && msg.sender.group.id === 782490531) {
            bot_status = false
            return msg.reply(`机器人已暂停`)
        }

        if (msg.plain.indexOf('#启用机器人') === 0 && msg.sender.group.id === 782490531) {
            bot_status = true
            return msg.reply(`机器人已启用`)
        }

        if(!bot_status) {
            return
        }

        try {
            if (msg.plain.indexOf('#申请白名单') === 0 && msg_length === 2) {
                const player_name = msg_slice[1]

                const player = await QQLink.findOne({ where: {qq: msg.sender.id + ''} })

                if (player && player.name !== null) {
                    return  await msg.reply([
                        Message.At(msg.sender.id),
                        Message.Plain(
                            ` 这里检测到您已经绑定过一个 游戏 ID  [${player.name}]了哦, 接下来请联系裙主解绑吧_(:з」∠)_`
                        )
                    ])
                }

                if (!/^[a-zA-Z0-9_].*$/.test(player_name) && player_name.length < 20) {
                    await msg.reply([
                        Message.At(msg.sender.id),
                        Message.Plain(
                            `\t 您申请的 [${player_name}]  不符合名称规则噢`
                        )
                    ])
                    return;
                }

                if (await mc.has_name(player_name)) {
                    return await msg.reply([
                        Message.At(msg.sender.id),
                        Message.Plain(
                            ` 您申请的 [${player_name}]  已经被使用了噢`
                        )
                    ])
                }

                if (player) {
                    await player.update({
                        name: player_name
                    })
                } else {
                    await QQLink.create({
                        qq: msg.sender.id,
                        name: player_name,
                        regDate: new Date(),
                        status: 1,
                        playerUuid: null
                    })
                }
                await mc.addWhiteName(player_name)
                // await qq.api.sendGroupMessage([], msg.sender.group.id)
                await msg.reply([
                    Message.At(msg.sender.id),
                    Message.Plain(
                        ` 您申请的 [${player_name}]  已经帮您绑定了呢~`
                    )
                ])
            }

            if (msg.plain.indexOf('#查询白名单') === 0 && msg_length === 1) {
                const player = await QQLink.findOne({ where: {qq: msg.sender.id + ''} })
                if (player && player.name !== null) {
                    return msg.reply(`您绑定的白名单是 ${player?.name}`)
                }
                return msg.reply(`您还没有绑定白名单`)
            }

            if (msg.plain.indexOf('#查询白名单') === 0 && msg_length === 2) {
                const player_name = msg_slice[1]
                const res = await QQLink.findOne({ where: {name: player_name} })
                if (res) {
                    return await msg.reply([
                        Message.At(msg.sender.id),
                        Message.Plain(
                            ` 您查询的 [${player_name}]  是 ${res.qq} 使用的`
                        )
                    ])
                }
                return await msg.reply([
                    Message.At(msg.sender.id),
                    Message.Plain(
                        ` 没有查询到 [${player_name}]`
                    )
                ])
            }

            if (msg.plain.indexOf('#解绑白名单') === 0 && msg_length === 2 && msg.sender.group.id === 782490531) {
                const qq = msg_slice[1]
                const player = await QQLink.findOne({ where: {qq} })

                if (!player) {
                    return msg.reply(`玩家[${qq}]信息不存在`)
                }
                if (player.name === null) {
                    return msg.reply(`玩家[${qq}] 还未绑定白名单`)
                }
                await mc.deleteWhiteName(player.name)
                await player.update({
                    name: null
                })
                return msg.reply(`玩家[${qq}]信息已解绑`)
            }

            if (msg.plain.indexOf('#服务器信息') === 0 && msg_length === 1) {
                const server_info = await mc.getServerInfo()
                const whitelist = await mc.getWhiteList()

                return msg.reply(`服务器白名单数量 ${whitelist.players.length} 在线玩家总数 ${server_info.players.length}, 分别为 ${server_info.players.join(', ')}`)
            }

            if (msg.plain.indexOf('#执行命令') === 0 && msg.sender.group.id === 782490531) {
                const [,...cmd] = msg_slice
                await mc.dispatchCommand(cmd.join(' '))
                return msg.reply(`命令 ${cmd.join(' ')} 执行完毕`)
            }


        } catch (e) {
            return msg.reply([
                Message.Plain('傻逼 '),
                Message.At(1067770480),
                Message.Plain('服务器挂了, 快去看!')
            ])
        }

    })
    qq.on("GroupRecallEvent", ({ operator }) => {
        if (operator) {
            const text = `${operator?.memberName} 撤回了一条消息，并拜托你不要再发色图了。`;
            qq.api.sendGroupMessage(text, operator.group.id);
        }
    });
    qq.listen()
}


app()