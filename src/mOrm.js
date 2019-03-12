import { isEmpty } from "lodash";
import { existsSync } from "fs";
import path from 'path';
import Postgresql from "./engine/postgresql";

export default class mOrm {
    configPathName = "./mrom.config.json";
  
    async createConnection(dbConfig = {}, extras = { entities: [] }) {

        if(isEmpty(dbConfig)){
            if(!existsSync(path.join(this.configPathName))){
                throw new Error("Configuration file morm.config.js required");
            }

            this.config = require(this.configPathName);
        } else if (dbConfig.uri){
                const regExp = /^(.*):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/gm;

                const [, type, username, password, host, port, database] = 
                regExp.exec(dbConfig.uri);
                
                let newConfig = {
                    type,
                    username,
                    password,
                    host,
                    port,
                    database
                };
                
                this.config = newConfig;
            }else{
                this.config = dbConfig;
            }
            
        this.config.synchronize =
        dbConfig.synchronize !== undefined ? dbConfig.synchronize : false;
      
          // building entities dependencies
          this.entities = {};
          for (const entities of extras.entities) {
            this.entities[entities.prototype.constructor.name] = entities;
          }
        //Instanciate databse engine

        switch(this.config.type){
            case 'postgres':
                this.dbInstance = new Postgresql(this.config);
                break;
            case 'mysql':
                //this.dbInstance = new MYSQL(this.config)
            default: 
                throw new Error(`Engine ${this.config.type} not supported`);
            }

        await this.dbInstance.initialize();
        console.log(`Connected to ${this.config.database}`);
    }
    getEntity(name) {
        return new this.entities[name](this.dbInstance);
    }
}