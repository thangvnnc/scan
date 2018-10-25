const {Builder, By, Key, until} = require('selenium-webdriver');
const readXlsxFile = require('read-excel-file/node');

const fs = require('fs');
const path = "C:\\Users\\thang\\Desktop\\sdt\\hcm.txt";

// File path.
readXlsxFile('C:\\Users\\thang\\Desktop\\sdt\\data.xlsx').then((dataTable) => {
    readInfoHCM(dataTable);
});

// let arrayAccount = [
//     {email: "thangitk22@gmail.com", pass: "thang01652608118"},
//     // {email: "thangitk21@gmail.com", pass: "thang01652608118"},
//     {email: "thangitk18@gmail.com", pass: "thang01652608118"},
//     {email: "thangitk15@gmail.com", pass: "thang01652608118"}
// ];


let idGetData = 0;
async function readInfoHCM(dataTable) {
    let driver = await new Builder().forBrowser('chrome').build();
    try {

        let arraySelected = [];
        // let idAccount = 0;

        for (var col = 1; col < dataTable.length; col++) {
            // let id = Math.floor(col / 50);
            // if(col === 1){
            //     console.log("first run");
            //     idAccount = id;
            //     await driver.get('https://facebook.com');
            //     await driver.findElement(By.id('email')).sendKeys(arrayAccount[idAccount].email);
            //     await driver.findElement(By.id('pass')).sendKeys(arrayAccount[idAccount].pass, Key.RETURN);
            //     wait(1000);
            // }
            // else if (id != idAccount){
            //     if(id === arrayAccount.length){
            //         console.log("het account");
            //         return;
            //     }
            //     driver.quit();
            //     driver = await new Builder().forBrowser('chrome').build();
            //     idAccount = id;
            //     console.log("change account : " + arrayAccount[idAccount].email);
            //
            //     await driver.get('https://facebook.com');
            //     await driver.findElement(By.id('email')).sendKeys(arrayAccount[idAccount].email);
            //     await driver.findElement(By.id('pass')).sendKeys(arrayAccount[idAccount].pass, Key.RETURN);
            //     wait(1000);
            // }
            wait(10000);
            console.log(idGetData++);
            let rows = dataTable[col];

            let link = rows[4];
            await driver.get(link);
            let arrayElement = await driver.findElements(By.className('_50f3'));

            let obj = {};
            obj['name'] = rows[1];
            obj['phone'] = "0" + rows[2];
            obj['link'] = link;
            obj['company'] = "";

            let stringGetValue = "";
            for (let id in arrayElement) {

                let element = arrayElement[id];
                let str = await element.getText();
                if (str.indexOf("Đã làm việc tại") !== -1) {
                    obj['company'] = str;
                }
                stringGetValue += str;
            }
            if (stringGetValue.indexOf("Sống tại Thành phố Hồ Chí Minh") != -1 || stringGetValue.indexOf("Làm việc tại Thành phố Hồ Chí Minh") != -1){
                arraySelected.push(obj);
                writeText(obj.phone + "," + obj.name + "," + obj.company + "," + obj.link);
            }
        }
    } finally {
        driver.quit();
    }
}

function writeText(text) {
    text += "\r\n";
    fs.open(path, 'a', function(err, data) {
        if (err) {
            console.log("ERROR !! " + err);
        } else {
            fs.write(data, text, 0, text.length, null, function(err) {
                if (err)
                    console.log("ERROR !! " + err);
                fs.close(data);
            });
        }
    });
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}