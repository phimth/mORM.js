export default class Entity {
  constructor(dbInstance) {
    this.dbInstance = dbInstance;
    // this åttribute must be filled by the child class constructpr [ ex: Student ]
    this.tableName = undefined;
  }

  async count(table) {
    return this.dbInstance.count(table);
  }

  async save(table,data) {
    return this.dbInstance.save(table,data);
  }

  async findByPk(pk,table){
      return this.dbInstance.findByPk(pk,table);
  }

  async delete(table){
      return this.dbInstance.delete(table);
  }

  async findAll(table,attributes){
      return this.dbInstance.findAll(table,attributes);
  }

  async findOne(table,column,value,attributes){
        return this.dbInstance.findOne(table,column,value,attributes)
  }

  async update(table,data){
      return this.dbInstance.update(table,data)
  }

  async remove(table,data){
      return this.dbInstance.remove(table,data)
  }

}