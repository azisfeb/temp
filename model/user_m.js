//var Sequelize = require('sequelize');

module.exports = function(Sequelize, sequelize){

    this.user = sequelize.define('tbl_user', {
                username: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: 'compositeIndex'
                },
                password: {
                    type: Sequelize.STRING,
                    unique: 'compositeIndex'
                },
            },
                {
                    timestamps: false, //to ignore create_at and update_at column name
                    freezeTableName: true, //to avoid adding tablenames automatically
                    tableName: 'tbl_user' //define table name
                }
            );
    
    this.article = sequelize.define('tbl_article', {
                    user_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false
                    },
                    title: {
                        type: Sequelize.STRING,
                    },
                    content: {
                        type: Sequelize.TEXT
                    }
                },
                    {
                        timestamps: false, //to ignore create_at and update_at column name
                        freezeTableName: true, //to avoid adding tablenames automatically
                        tableName: 'tbl_article' //define table name
                    }
                );
                

}