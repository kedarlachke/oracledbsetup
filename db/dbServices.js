/**
 * @author 
 */

// Import the connection pool
//import dbConnectionPool from './dbConnect';
//import util from 'util';
//const dbConnectionPool=require('./dbConnect')
const orcl=require('./oracletest')


const test=async()=>{
    let connection;
    try{
        connection= await orcl.getConnection()
       if(connection){
       console.log("connection done")}
    }catch(e){
        console.log(e)
    }finally {
              if (connection) {
                try {
                  await connection.close();
                  console.log("connection closed")
                } catch (err) {
                  console.error(err);
                }
              }
            }
}
test()
// Get the table data based on the select query and placeholders
const getTableData = async (selectQuery, placeHolders) =>
{
    try 
    {
        // if select Query is not available, throw error
        if(typeof selectQuery === 'undefined' || selectQuery.trim().length == 0 ) 
            throw new Error("select query is required and can not be empty.");

        let result;

        // Use query method to get data from mysql table 
        result = await dbConnectionPool.query(selectQuery, placeHolders)

        return JSON.parse(JSON.stringify(result));
        //return result;
    } 
    catch (error) 
    {
        console.log("Error => ");
        console.log(error);
        
        throw error;
    }

}


// Create database table
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
        result = await dbConnectionPool.query(tableDDL);

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
        result = await dbConnectionPool.query(tableDDL);

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

// Insert the records in table 
const insertTableRecords = async (insertDML, valuesArray) =>
{

    try 
    {
        // if insert DML is not available, throw error
        if(typeof insertDML === 'undefined' || insertDML.trim().length == 0 ) 
            throw new Error("insert DML is required and can not be empty.");

        // if values Array is not available, throw error
        if(typeof valuesArray === 'undefined' || valuesArray.length == 0 ) 
            throw new Error("values are required and can not be empty.");

        let result;
        let recordsInserted = 0;
        
        // Use query method to insert records in mysql table            
        try 
        {
            for(let i=0; i<valuesArray.length; i++)
            {
                result = await dbConnectionPool.query(insertDML, valuesArray[i]);
                recordsInserted = recordsInserted + result.affectedRows;   
            }

        } catch (error) 
        {
            throw error;
        }

        //console.log("No of records inserted : ");       
        //console.log(recordsInserted);

        return recordsInserted;
    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;
        
    }
}

// const checkIfTableExist=async(tableName)=>{
//     const query=`SELECT COUNT(*) COUNT FROM information_schema.tables WHERE  table_name = '${tableName}';`
//     //result = await dbConnectionPool.query(query).then((res)=>{console.log(JSON.parse(JSON.stringify(res)));return res}).catch((err)=>{console.log(err)})
//     return executeDMLTransactions([query])
    
//     //console.log(JSON.parse(JSON.stringify(result)))
//     //return JSON.parse(JSON.stringify(result))
    
// }


const checkIfTableExist = async (tableName) =>
{
    const query=`SELECT COUNT(*) COUNT FROM information_schema.tables WHERE  table_name = '${tableName}' AND TABLE_SCHEMA='devindices';`
    try 
    {
        let DMLStatements =  [query];

        let dmlStatement;
        let result;
        let affectedRecords = 0;

        // Use database service to execute DML statements
        for(let j = 0; j < DMLStatements.length; j++)
        {
            dmlStatement = DMLStatements[j];

            // if DML statment is not available, throw error
            if(typeof dmlStatement === 'undefined' || dmlStatement.trim().length == 0 ) 
                throw new Error("DML Statement is required and can not be empty.");

            // Use query method to execute query         
            result = await dbConnectionPool.query(dmlStatement);
            
            affectedRecords = JSON.parse(JSON.stringify(result))
        }

        return affectedRecords;

    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;        
    }
}




// UPDATE the records in table 
const updateTableRecords = async (updateDML, valuesArray) =>
{

    try 
    {
        // if update DML is not available, throw error
        if(typeof updateDML === 'undefined' || updateDML.trim().length == 0 ) 
            throw new Error("update DML is required and can not be empty.");

        // if values Array is not available, throw error
        if(typeof valuesArray === 'undefined' || valuesArray.length == 0 ) 
            throw new Error("values are required and can not be empty.");

        let result;
        let recordsUpdated = 0;
        
        // Use query method to update records in mysql table            
        try 
        {
            for(let i=0; i<valuesArray.length; i++)
            {
                result = await dbConnectionPool.query(updateDML, valuesArray[i]);
                recordsUpdated = recordsUpdated + result.affectedRows;   
            }

        } catch (error) 
        {
            throw error;
        }

        //console.log("No of records updated : ");       
        //console.log(recordsUpdated);

        return recordsUpdated;
    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;
        
    }
}


// Execute DML Transactions
const executeDMLTransactions = async (DMLStatements) =>
{
    try 
    {
        DMLStatements = DMLStatements || [];

        let dmlStatement;
        let result;
        let affectedRecords = 0;

        // Use database service to execute DML statements
        for(let j = 0; j < DMLStatements.length; j++)
        {
            dmlStatement = DMLStatements[j];

            // if DML statment is not available, throw error
            if(typeof dmlStatement === 'undefined' || dmlStatement.trim().length == 0 ) 
                throw new Error("DML Statement is required and can not be empty.");

            // Use query method to execute query         
            result = await dbConnectionPool.query(dmlStatement);
            
            affectedRecords = affectedRecords + result.affectedRows;
        }

        return affectedRecords;

    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;        
    }
}

/**
 *  Execute DML Transactions
 *  @param DMLStatements : Array of DML Statements
 *  Supports the atomicity of transactions  
 *  
const executeDMLTransactions = async (DMLStatements) =>
{
    DMLStatements = DMLStatements || [];
    let totalStatements = DMLStatements.length;
    let itr = 0;
    let dmlStatement;

    if(totalStatements == 0)
        return 0;

    // Get the connection from connection pool
    await dbConnectionPool.getConnection( async (err, connection)  =>
    {
        // if error occurs
        if(err)     throw err;
        
        // Begin the transaction, equivalent to MySQL START TRANSACTION
        await connection.beginTransaction( async (err) => 
        {
            // if error occurs
            if (err)    throw err; 

            // Recursive function to execute all the DML statements from array
            const executeTransaction = async (err) =>
            {
                // if error occurs
                if(err) throw err;

                // If all statements are executed
                if (itr == totalStatements) {
                    // Done, now commit
                    return noMoreStatements();
                }

                // Get the DML statement from array
                dmlStatement = DMLStatements[itr];
                //console.log("dmlStatement => " + dmlStatement);
                
                itr = itr + 1;

                // Execute the DML statement
                await connection.query(dmlStatement, async (err, result) => 
                {
                    // if error occurs
                    if (err) 
                    { 
                        // Rollback the transaction, equivalent to MySQL ROLLBACK
                        connection.rollback( () => 
                        {
                            throw err;
                        });
                    }  
        
                    // Recursive call
                    await executeTransaction();

                });
            };
        
            // All statements are executed
            const noMoreStatements = async () =>
            {
                // Commit the transaction, equivalent to MySQL COMMIT
                await connection.commit( async (err) => 
                {
                    //console.log('Committing operation...');

                    // if error occurs
                    if (err) 
                    { 
                        //console.log('Rolling back operation...');
                        // Rollback the transaction, equivalent to MySQL ROLLBACK
                        await connection.rollback( () =>
                        {
                            throw err;
                        });
                    }

                    //console.log('success!');

                });
            };
        
           // Invoke recursive function
           await executeTransaction();

        });

    });

    // if no errors occurred    
    return totalStatements;

}*/ 


// Form the Insert statement 
const getInsertStatement = async (tableName, dataJSON) =>
{
    try 
    {
        // if table name is not available, throw error
        if(typeof tableName === 'undefined' || tableName.trim().length == 0 ) 
            throw new Error("table name is required and can not be empty.");


        // if values are not available, throw error
        if(typeof dataJSON === 'undefined' || Object.keys(dataJSON).length == 0 ) 
            throw new Error("data json is required and can not be empty.");


        let insertStatement = "INSERT INTO " + tableName + "(";

        // Get the data json destructured for column names
        for(let key in dataJSON) 
        { 
            //condition changed 20181030
            if(dataJSON[key])
            {
            insertStatement = insertStatement + key + ", ";
            }
            //console.log("Key: " + key + " value: " + dataJSON[key]);
        }

        // remove the extra ',' from statement
        insertStatement = insertStatement.substring(0, insertStatement.lastIndexOf(","));

        insertStatement = insertStatement + ") VALUES (";

        // Get the data json destructured for coulmn values
        for(let key in dataJSON) 
        { 
            //insertStatement = insertStatement + "'" + dataJSON[key] + "', ";//20181029

            if(dataJSON[key])
            {
                insertStatement = insertStatement + "'" + (dataJSON[key]+'').replace(/'/g, "''") + "', ";
            }
            //console.log("Key: " + key + " value: " + dataJSON[key]);
        }

        // remove the extra ',' from statement
        insertStatement = insertStatement.substring(0, insertStatement.lastIndexOf(","));
        
        insertStatement = insertStatement + ")";

        return await insertStatement;

    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;        
    }
}


// Form the multiple Insert statement 
const getInsertStatements = async (tableName, sheetjsonarr) =>
{
    let insertStatements = [] 
    try 
    { let initdataJSON=sheetjsonarr[0]
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

        for(let i=0;i<sheetjsonarr.length;i++){
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


// Form the Update statement 
const getUpdateStatement = async (tableName, dataJSON, caluseJSON) =>
{
    try 
    {
        // if table name is not available, throw error
        if(typeof tableName === 'undefined' || tableName.trim().length == 0 ) 
            throw new Error("table name is required and can not be empty.");


        // if values are not available, throw error
        if(typeof dataJSON === 'undefined' || Object.keys(dataJSON).length == 0 ) 
            throw new Error("data json is required and can not be empty.");


        let updateStatement = "UPDATE " + tableName;
        updateStatement = updateStatement + " SET ";

        // Get the data json destructured
        for(let key in dataJSON) 
        { 
            //updateStatement = updateStatement + " " + key + " = '" + dataJSON[key] + "', "; //20181029
            if(dataJSON[key])
            {
                updateStatement = updateStatement + " " + key + " = '" + (dataJSON[key]+'').replace(/'/g, "''") + "', ";
            }
            //console.log("Key: " + key + " value: " + dataJSON[key]);
        }

        // remove the extra ',' from statement
        updateStatement = updateStatement.substring(0, updateStatement.lastIndexOf(","));

        // if clauses are available
        if(typeof caluseJSON !== 'undefined' && Object.keys(caluseJSON).length != 0 ) 
        {
            updateStatement = updateStatement + " WHERE ";
            
            // Get the clause json destructured
            for(let key in caluseJSON) 
            { 
                //updateStatement = updateStatement + " " + key + " = '" + caluseJSON[key] + "' AND "; //20181029
                if(caluseJSON[key])
                {
                    updateStatement = updateStatement + " " + key + " = '" + (caluseJSON[key]+'').replace(/'/g, "''") + "' AND ";
                }
                //console.log("Key: " + key + " value: " + caluseJSON[key]);
            }
            
            // remove the extra 'AND' from statement
            updateStatement = updateStatement.substring(0, updateStatement.lastIndexOf("AND"));

        }        

        return await updateStatement;

    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;        
    }
}



// Form the delete statement for PHYSICAL delete 
const getDeleteStatement = async (tableName, caluseJSON) =>
{
    try 
    {
        // if table name is not available, throw error
        if(typeof tableName === 'undefined' || tableName.trim().length == 0 ) 
            throw new Error("table name is required and can not be empty.");

        let deleteStatement = "DELETE FROM " + tableName;

        // if clauses are available
        if(typeof caluseJSON !== 'undefined' && Object.keys(caluseJSON).length != 0 ) 
        {
            deleteStatement = deleteStatement + " WHERE ";
            
            // Get the clause json destructured
            for(let key in caluseJSON) 
            { 
                deleteStatement = deleteStatement + " " + key + " = '" + caluseJSON[key] + "' AND ";
                //console.log("Key: " + key + " value: " + caluseJSON[key]);
            }
            
            // remove the extra 'AND' from statement
            deleteStatement = deleteStatement.substring(0, deleteStatement.lastIndexOf("AND"));

        }        

        return await deleteStatement;

    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;        
    }
}


// Execute Stored Procedure / Function
const executeStoredProcedure = async (procedureCall, valuesArray) =>
{

    try 
    {
        // if procedure name is not available, throw error
        if(typeof procedureCall === 'undefined' || procedureCall.trim().length == 0 ) 
            throw new Error("procedure call is required and can not be empty.");

        // if values Array is not available, throw error
        if(typeof valuesArray === 'undefined' || valuesArray.length == 0 ) 
            throw new Error("values are required and can not be empty.");

        let result;
        let recordsInserted = 0;
        
        // Use query method to execute procedure/function in mysql            
        try 
        {
            result = await dbConnectionPool.query(procedureCall, valuesArray);

        } catch (error) 
        {
            throw error;
        }

        //console.log("Result : ");       
        //console.log(result);

        return result;
    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;
        
    }
}



// Export functions
module.exports = {
    getTableData, 
    createTable,
    insertTableRecords,
    updateTableRecords,
    executeDMLTransactions,
    getInsertStatement,
    getUpdateStatement,
    getDeleteStatement,
    executeStoredProcedure,
    createTableFromKey,
    getInsertStatements,
    DropTable,
    checkIfTableExist
};