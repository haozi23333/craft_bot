import {DataTypes, Optional, Sequelize, Model} from "sequelize";

const sequelize = new Sequelize({
    host: 'mysql.haozi.local',  // 内网地址  ==
    username: 'crafttown',
    password: 'Minecraft@kangna.io',
    port: 3306,
    database: 'craftTown',
    dialect: "mariadb"
})

export class QQLink extends Model {
   public id!: number
   public qq!: string
   public playerUuid!: string
   public regDate!: Date
   public status!: boolean
   public name!: string
}
QQLink.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    qq: {
        type: DataTypes.STRING,
    },
    playerUuid: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
    },  regDate: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'qq_link',
    sequelize,
    createdAt: false,
    updatedAt: false
})
