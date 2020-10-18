const dbServices=require('./db/OrclDBServices')
const fs = require('fs')
const  XLSX = require('xlsx');

var format = /[^a-zA-Z0-9 ]+/g;
const PostJsonDataToTable=async (json)=>{
    const {tablename, transaction,data}=json
   

    const COUNT= await dbServices.checkIfTableExist(tablename)    
      if(COUNT==1){
        if(transaction=='create'){
            console.log('in create')
          const res= await dbServices.DropTable(`DROP TABLE ${tablename}`)
          if(res){
              await dbServices.createTableFromKey(tablename,Object.keys(data[0]))
              //await  dbServices.getInsertStatements(tablename,data)
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

String.prototype.cleanup = function() {
    return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
 }
 
function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 
const PostExcelData=()=>{
     var workbook = XLSX.readFile('./alldata_10_18_2020.csv'); 
    for(let i=0;i<workbook.SheetNames.length;i++){
        console.log("-------------->" + workbook.SheetNames[i])
        let sheetjsonarr=XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]])        
        for(var k=0;k<sheetjsonarr.length;k++){
            //console.log(sheetjsonarr[0])
            var keys=Object.keys(sheetjsonarr[k])
            console.log(keys.length)
            for(var j=0;j< keys.length;j++){
                
                    var newkey1=keys[j].replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g,'')
                    var newkey=isNumber(newkey1.substring(0, 1))?'c'+newkey1:newkey1;

                    if(newkey.length>30){
                        newkey = newkey.substring(1, 30);                        
                    }
                    
                    if(newkey!=keys[j]){
                    sheetjsonarr[k][newkey] = sheetjsonarr[k][keys[j]]==undefined || sheetjsonarr[k][keys[j]]===0? '0' : sheetjsonarr[k][keys[j]]
                    delete sheetjsonarr[k][keys[j]]
               
                    }
            }
            
        }
        console.log(sheetjsonarr[0])
        const json={
            tablename:"tt1",
            transaction:"create",
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