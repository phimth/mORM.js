import mOrm from './mOrm'
import Student from "./entities/student";

(async () => {
    const orm = new mOrm();

    try{
    await orm.createConnection({
        
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "postgres",
            database: "test",
            synchronize: true
                  
    },
        {
            entities: [Student]
        }
    );
    let dora = {
        firstname: "Dora",
        lastname: "Lexploratrice",
        age: 15
    }

    let babouche = {
        firstname: "Babouche",
        lastname: `Le_singe`,
        age: 13
    }

    let where = {
        firstname: "Babouche"
    }

    let data = {
        old_firstname: "Dora",
        firstname: "Chipper",
        lastname: `Le_renard`,
        age: 13
    }

    let attributes = ['lastName','age'];
    let column = "firstName";
    let value = "Babouche"
    //orm.dbInstance.dump();
    let table = "Student";
    const studentEntity = orm.getEntity(table);

    await studentEntity.delete(table);
    await studentEntity.save(table,dora);
    await studentEntity.save(table,babouche);
    await studentEntity.count(table);
    //await studentEntity.findAll(table,["firstname","age"]);
    await studentEntity.findOne(table,column,value,attributes);
    await studentEntity.update(table,data);
    //await studentEntity.findByPk(1,table);
    await studentEntity.remove(table,babouche);

    } catch(err){
        console.log(err);
        process.exit(-1);
    }
})();
