const  XLSX = require('xlsx');
const fs = require('fs')
test=()=>{
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
    var workbook = XLSX.readFile('./alldata_10_18_2020.csv'); 

        
        let sheetjsonarr=XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])        
        
            var keys=Object.keys(sheetjsonarr[0])
            //console.log(keys.length)
            for(var j=0;j<keys.length;j++){
                
                var newkey1= keys[j].replace(format, "").replace(/\s/g ,"")
                var newkey=isNumber(newkey1.substring(1, 30))?'c'+newkey1:newkey1;

             //.log(newkey)   
            }
     
    
    

}
function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 
console.log(isNumber('c'))
//test()