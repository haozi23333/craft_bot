import axios  from 'axios'

const server = axios.create({
    timeout: 3000
})

export default class mc {

    static async getWhiteList(): Promise<{players: string[]}> {
        const { data, status } = await server.get<{players: string}>('http://192.168.50.126:8099/whitelist')
        if( status !== 200) {
            throw Error("服务器无法连接~")
        }
        return {
            players: JSON.parse(data.players)
        }
    }

    static async addWhiteName(name: string) {
        const { data, status } = await server.put('http://192.168.50.126:8099/whitelist', { name })
        console.log(status)
        if( status !== 200) {
            throw Error("服务器无法连接~")
        }
        return data
    }
    static async deleteWhiteName(name: string) {
        const { data, status } = await server.delete(`http://192.168.50.126:8099/whitelist/${name}`)
        if( status !== 200) {
            throw Error("服务器无法连接~")
        }
        return data
    }

    static async has_name(name: string) {
       const { players } = await mc.getWhiteList()
        return players.indexOf(name) > -1
    }

    static async dispatchCommand(cmd: string) {

        const { data, status } = await server.post(`http://192.168.50.126:8099/server/dispatchCommand`, {cmd})
        if( status !== 200) {
            throw Error("服务器无法连接~")
        }
        return data
    }

    static async getServerInfo() {
        const { data, status } = await server.get<{players: string[], serverName: string}>(`http://192.168.50.126:8099/server/serverinfo`)
        if( status !== 200) {
            throw Error("服务器无法连接~")
        }
        return data
    }
}