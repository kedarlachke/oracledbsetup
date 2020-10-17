
//const { connect } = require('http2');
const oracledb = require('oracledb');


try {
    oracledb.initOracleClient({libDir: 'C:/oracle/instantclient_19_8'});
  } catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
  }
  const dbConfig =  {
    user          :  "system",
    password      :  "oracle",
    connectString :  "81.4.102.11:1521/EE.oracle.docker",
    externalAuth  :   false
  };


 const getConn=async()=>{
    let connection;
    let result=null
    options = {
        autoCommit: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };
      try {
        connection = await oracledb.getConnection(dbConfig);
        return connection
       
      }catch(e){
        console.log(e)
        throw new Error(e)
      }
 }
 

const execQuery=async(sql,binds)=>{
    let connection;
    let result=null
    options = {
        autoCommit: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };
      try {
        connection = await oracledb.getConnection(dbConfig);
        if(binds){
           result = await connection.execute(sql, binds, options);
        }else{
            result = await connection.execute(sql)
        }
        await connection.commit();
        await connection.close();
        connection=null
      }catch(e){
        console.log(e)
        throw new Error(e)
      }finally{
        if (connection) {
                  try {
                    await connection.close().then(()=>{}).catch(()=>{});
                    console.log("conection closed")
                     } catch (err) {
                        console.error("Error while closing connection");
                        console.error(err);
                   
                    //throw new Error("Error while closing connection")
                  }
                }
              }
             return result    
      }



const getTableData = async (selectQuery, placeHolders) =>
{
    try 
    {
        // if select Query is not available, throw error
        if(typeof selectQuery === 'undefined' || selectQuery.trim().length == 0 ) 
            throw new Error("select query is required and can not be empty.");

        let result;
        // Use query method to get data from mysql table 
        result = await execQuery(selectQuery, placeHolders)
        return JSON.parse(JSON.stringify(result));
        //return result;
    } 
    catch (error)     {
        console.log("Error => ");
        console.log(error);        
        throw error;
    }

}

const createTable = async (tableDDL) => 
{
    try 
    {
        // if table DDL is not available, throw error
        if(typeof tableDDL === 'undefined' || tableDDL.trim().length == 0 ) 
            throw new Error("table DDL is required and can not be empty.");
    
        let result;

        // Use query method to create mysql table 
        //result= await dbConnectionPool.query(`DROP TABLE ${tableDDL}`)
        result = await execQuery(tableDDL);

        console.log("table created..");
        
        return result;
    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;
    }
}

const checkIfTableExist = async (tableName) =>
{
    //const dmlStatement=`SELECT COUNT(*) COUNT FROM information_schema.tables WHERE  table_name = '${tableName}' AND TABLE_SCHEMA='system'`
    const dmlStatement=`SELECT COUNT(*) AS COUNT FROM TABS WHERE UPPER(TABLE_NAME)=UPPER('${tableName}')`
    try 
    {
          let affectedRecords = 0;
            // if DML statment is not available, throw error
            if(typeof dmlStatement === 'undefined' || dmlStatement.trim().length == 0 ) 
                throw new Error("DML Statement is required and can not be empty.");
            // Use query method to execute query         
            result = await execQuery(dmlStatement);            
            affectedRecords = result.rows[0][0]//.rows[0][1]//['COUNT']//JSON.parse(JSON.stringify(result))
            //console.log(affectedRecords)
            return affectedRecords;
    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);

        
        throw error;        
    }
}


// Insert the records in table 


const getInsertStatements = async (tableName, sheetjsonarr) =>
{
    let insertStatements = [] 
    try 
    { 
        for(let i=0;i<sheetjsonarr.length;i++){
        let initdataJSON=sheetjsonarr[i]
        let initStatement = "INSERT INTO " + tableName + "(";

        // Get the data json destructured for column names
        for(let key in initdataJSON) 
        { 
            //condition changed 20181030
            if(initdataJSON[key] && key!='__rowNum__')
            {
                initStatement = initStatement + key + ", ";
            }
            //console.log("Key: " + key + " value: " + initdataJSON[key]);
        }

        // remove the extra ',' from statement
        initStatement = initStatement.substring(0, initStatement.lastIndexOf(","));

        
            let dataJSON=sheetjsonarr[i]
        // if table name is not available, throw error
        if(typeof tableName === 'undefined' || tableName.trim().length == 0 ) 
            throw new Error("table name is required and can not be empty.");


        // if values are not available, throw error
        if(typeof dataJSON === 'undefined' || Object.keys(dataJSON).length == 0 ) 
            throw new Error("data json is required and can not be empty.");


         let insertStatement = initStatement;

        insertStatement = insertStatement + ") VALUES (";
        // Get the data json destructured for coulmn values
        for(let key in dataJSON) 
        { 
            //insertStatement = insertStatement + "'" + dataJSON[key] + "', ";//20181029
            
            if(dataJSON[key] && key!='__rowNum__')
            {
                insertStatement = insertStatement + "'" + (dataJSON[key]+'').replace(/'/g, "''") + "', ";
            }
            //console.log("Key: " + key + " value: " + dataJSON[key]);
        }

        // remove the extra ',' from statement
        insertStatement = insertStatement.substring(0, insertStatement.lastIndexOf(","));
        
        insertStatement = insertStatement + ")";
        insertStatements.push(insertStatement)
        //return await insertStatement;
    }
    //console.log(insertStatements)
   let affectedRecords = await executeDMLTransactions(insertStatements).then((res)=>{return}).catch((error)=>{});
    //eturn insertStatements
    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;        
    }
}

const executeDMLTransactions = async (DMLStatements) =>
{
    let connection
    try 
    {
        DMLStatements = DMLStatements || [];

        let dmlStatement;
        let result;
        let affectedRecords = 0;
        connection= await getConn()  
        // Use database service to execute DML statements
        for(let j = 0; j < DMLStatements.length; j++)
        {
            ///console.log(j)
            dmlStatement = DMLStatements[j];
            //console.log(dmlStatement)
            // if DML statment is not available, throw error
            if(typeof dmlStatement === 'undefined' || dmlStatement.trim().length == 0 ) 
                throw new Error("DML Statement is required and can not be empty.");

            // Use query method to execute query         
            //result = await execQuery(dmlStatement);
            result = await connection.execute(dmlStatement);
            affectedRecords = affectedRecords + result.affectedRows;
        }
        await connection.commit()
        return affectedRecords;

    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;        
    }finally{
        try{
            console.log('trying to close connection in finally')
         connection.close()
        }catch(err){
            console.log(err)
        }
    }
}

const createTableFromKey= async (tableName,keys)=>{
    //console.log('123')
    let column="";
    for(let i=0;i<keys.length;i++){
        if(i==keys.length-1){
            column=column+keys[i].toLocaleUpperCase()+" VARCHAR(100) DEFAULT NULL"
        }else{
        column=column+keys[i].toLocaleUpperCase()+" VARCHAR(100) DEFAULT NULL,"}
    }
    let createtable=`CREATE TABLE ${tableName} (${column})`
    console.log(createtable)
    
const result=await createTable(createtable)
return result
}

const DropTable = async (tableDDL) => 
{
    try 
    {
        // if table DDL is not available, throw error
        if(typeof tableDDL === 'undefined' || tableDDL.trim().length == 0 ) 
            throw new Error("table DDL is required and can not be empty.");
    
        let result;

        // Use query method to create mysql table 
       // result= await dbConnectionPool.query()
        result = await execQuery(tableDDL);

        console.log("table droped..");
        
        return result;
    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;
    }
}

// const runa=async()=>{
// let a= await getTableData("Select count(*) from OHLC",{})
// let a=await createTable("CREATE TABLE no_example (id NUMBER, data VARCHAR2(20))",{})
// let a=await checkIfTableExist("no_example")
// let a=await getInsertStatements()

// console.log(a)
// }
// runa()



const PostJsonDataToTable=async (json)=>{
    const {tablename, transaction,data}=json
   

    const COUNT= await checkIfTableExist(tablename)    
      if(COUNT==1){
        if(transaction=='create'){
            console.log('in create')
          const res= await DropTable(`DROP TABLE ${tablename}`)
          if(res){
              await createTableFromKey(tablename,Object.keys(data[0]))
              await  getInsertStatements(tablename,data)
          }

        }else{
            console.log('in append in db services')
            await getInsertStatements(tablename,data)
        }
    }else{
        console.log('totally new ')
        await createTableFromKey(tablename,Object.keys(data[0]))
        await getInsertStatements(tablename,data)

    }    
}

// const json={
//     tablename:"test",
//     transaction:"create",
//     data:[{
//         col1:"test 1",
//         col2:"test 2",
//         col3:"test 3",
//         col4:"test 4",
//         col5:"test 5"
//     }]
// }
// PostJsonDataToTable(json)


module.exports={
    checkIfTableExist,
    DropTable,
    createTableFromKey,
    getInsertStatements,
    oracledb
}