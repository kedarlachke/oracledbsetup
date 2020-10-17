const dbServices=require('./db/OrclDBServices')
const fs = require('fs')
const  XLSX = require('xlsx');
const PostJsonDataToTable=async (json)=>{
    const {tablename, transaction,data}=json
   

    const COUNT= await dbServices.checkIfTableExist(tablename)    
      if(COUNT==1){
        if(transaction=='create'){
            console.log('in create')
          const res= await dbServices.DropTable(`DROP TABLE ${tablename}`)
          if(res){
              await dbServices.createTableFromKey(tablename,Object.keys(data[0]))
              await  dbServices.getInsertStatements(tablename,data)
          }

        }else{
            console.log('in append')
            await dbServices.getInsertStatements(tablename,data)
        }
    }else{
        console.log('totally new ')
        await dbServices.createTableFromKey(tablename,Object.keys(data[0]))
        await dbServices.getInsertStatements(tablename,data)

    }    
}


const PostExcelData=()=>{
     var workbook = XLSX.readFile('./Book1.xlsx'); 
    for(let i=0;i<workbook.SheetNames.length;i++){
        console.log("-------------->" + workbook.SheetNames[i])
        let sheetjsonarr=XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]])        
        for(var k=0;k<sheetjsonarr.length;k++){
            var keys=Object.keys(sheetjsonarr[k])
            for(var j=0;j< keys.length;j++){
                // if(keys[j].includes(' ')){                   
                    var newkey=keys[j].replace(/\s/g,"")
                    // if(newkey.length>27){
                    //     newkey = newkey.substring(1, 27);                        
                    // }
                    // newkey+="_"+j;
                    sheetjsonarr[k][newkey] = sheetjsonarr[k][keys[j]]==undefined || sheetjsonarr[k][keys[j]]===0? '0' : sheetjsonarr[k][keys[j]]
                    delete sheetjsonarr[k][keys[j]]
                // }
            }
        }
        const json={
            tablename:"test1",
            transaction:"append",
            data:sheetjsonarr
        }   
        PostJsonDataToTable(json)
    }
    
    
}
PostExcelData()
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