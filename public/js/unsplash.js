const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const unsplash = require("unsplash");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

if (config.use_env_variable) {
    const Sequelize = Sequelize(process.env[config.use_env_variable]);
} else {
    const Sequelize = Sequelize(config.database, config.username, config.password, config);
}

fs
.readdirSync(__dirname)
.filter(function(file) {
    return (file.indexOf(".") !==0) && (file !==basename) && (file.slice(-3) === ".js");
})   
.forEach(function(file) {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.sequelize = Sequelize;

module.exports = db;
