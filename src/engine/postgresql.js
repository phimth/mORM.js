import Core from './core';
import { Client } from "pg";
import { isEmpty } from "lodash";

export default class Postgresql extends Core{
    constructor(options){
        super(options);
    }

    async initialize(){
        const { host, port, username, password, database,synchronize,entities} = this;
        
        this.client = new Client({
            user: username,
            host,
            port,
            database,
            password
        });

        try{
            await this.client.connect();
            this.drop("Student");
            let query = `CREATE TABLE IF NOT EXISTS Student(
                id  SERIAL PRIMARY KEY,
                firstname varchar(255) NOT NULL,
                lastname varchar(255) NOT NULL,
                age integer NULL)`

            await this.client.query(query,(err,res)=>{
                if (err) {
                    throw new Error(err.stack);
                  } else {
                    console.log(`Table Student has been created`);
                }
            })

        } catch(e){
            throw new Error(e.message);
        }
    }

    async drop(table){
        try{
            
            let query = `DROP TABLE IF EXISTS ${table}`

            await this.client.query(query,(err,res)=>{
                if (err) {
                    throw new Error(err.stack);
                  } else {
                    console.log(`Table Student has been dropped`);
                }
            })

        } catch(e){
            throw new Error(e.message);
        }
    }

    async count(table){
        try{
            await this.client.query (`SELECT COUNT (*) FROM ${table}`,(err,result) => {
            if (err) {
                throw new Error(err.stack);
            } else {
                let res = result.rows[0].count;
            console.log(`There are ${res} student(s)`);
            }
        });
    }catch(e){
        throw new Error(e.message);
    }
    }

    async save(table,data){
        try{
            let insert = `INSERT INTO ${table} (firstName, lastName, age) VALUES('${data.firstname}', '${data.lastname}', ${data.age})`
            await this.client.query(insert,(err,res)=>{
                if (err) {
                    throw new Error(err.stack);
                  } else {
                    console.log(`${data.firstname} has been inserted`);
                }
            });
    }catch(e){
        throw new Error(e.message);
    }
    }

    async findByPk(pk, table) {
        try {
            this.client.query(`SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type
            FROM   pg_index i
            JOIN   pg_attribute a ON a.attrelid = i.indrelid
                                 AND a.attnum = ANY(i.indkey)
            WHERE  i.indrelid = 'public.${table}'::regclass
            AND    i.indisprimary`, (err, result) => {
              if (err) {
                reject(err);
              } else {
                const pkColumn = result.rows[0].attname;
                try {
                    this.client.query(`SELECT * FROM ${table} WHERE ${pkColumn}=${pk}`, (err, result) => {
                      if (err) {
                        reject(err);
                      } else {
                        console.log(result.rows);
                      }
                    });
                } catch (e) {
                    console.log(e)
                }
              }
            });
        } catch (e) {
            console.log(e)
        }
    }

    async delete(table){
        try{
            this.client.query(`DELETE FROM ${table}`, (err, res) => {
                if (err) {
                  throw new Error(err.stack);
                } else {
                  console.log(`Table Student has been erased`);
                }
              });
        }catch(e){
            throw new Error(e.message);
        }
    }

    async findAll(table,attributes){
        try{
            let columns = attributes.join(', ');
            this.client.query(`SELECT ${columns} FROM ${table}`, (err, res) => {
                if (err) {
                  throw new Error(err.stack);
                } else {
                  console.log(res.rows);
                }
              });
        }catch(e){
            throw new Error(e.message);
        }
    }

    async findOne(table,column,value,attributes){
        try{
            let columns = attributes.join(', ');
            let query = `SELECT ${columns} FROM ${table} WHERE ${column} = '${value}'`;
            this.client.query(query, (err, res) => {
                if (err) {
                  throw new Error(err.stack);
                } else {
                  console.log(res.rows);
                }
              });
            console.log(query);
        }catch(e){
            throw new Error(e.message);
        }
    }

    async update(table,data){
        try{
            let query = `UPDATE ${table} SET firstName = '${data.firstname}', lastName = '${data.lastname}', age = '${data.age}' WHERE firstName = '${data.old_firstname}'`
            await this.client.query(query,(err,res)=>{
                if (err) {
                    throw new Error(err.stack);
                  } else {
                    console.log(`${data.old_firstname} has been modfified`);
                }
            });
        }catch(e){
            throw new Error(e.message);
        }
    }

    async remove(table,data){
        try{
            let query = `DELETE FROM ${table} WHERE firstName = '${data.firstname}'`
            await this.client.query(query,(err,res)=>{
                if (err) {
                    throw new Error(err.stack);
                  } else {
                    console.log(`${data.firstname} has been removed`);
                }
            });
        }catch(e){
            throw new Error(e.message);
        }
    }

}