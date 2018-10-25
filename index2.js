const {Builder, By, Key, until} = require('selenium-webdriver');
const readXlsxFile = require('read-excel-file/node');

const fs = require('fs');
const path = "C:\\Users\\thang\\Desktop\\sdt\\hcm.txt";

// File path.
readXlsxFile('C:\\Users\\thang\\Desktop\\sdt\\data.xlsx').then((dataTable) => {
    readInfoHCM(dataTable);
});

let numberGet = 0;
var timeCurrents = [];
let timeDown = 500;
function checkFacebookSpam(time) {
    timeCurrents.push(time);
    var countTime = 0;
    if (timeCurrents.length > 8) {
        timeCurrents.splice(0, 1);
        for(let idx = 0; idx < timeCurrents.length - 1; idx++) {
            if (timeCurrents[idx + 1] - timeCurrents[idx] < timeDown) {
                countTime ++;
            }
        }
        if (countTime > 5) {
            return true;
        }
    }
    return false;
}

async function readInfoHCM(dataTable) {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        let arraySelected = [];

        for (var col = 1; col < dataTable.length; col++) {
            var d = new Date();
            var n = d.getTime();
            console.log(col + " --- " + numberGet + "---" + n);
            // wait(30000);
            if (checkFacebookSpam(n) === true) {
                console.log("Stop by spam: ");
                console.log(timeCurrents);
                return;
            }

            try {
                let rows = dataTable[col];

                let link = rows[4];
                await driver.get(link);

                let obj = {};
                obj['name'] = rows[1];
                obj['phone'] = "0" + rows[2];
                obj['link'] = link;
                obj['company'] = "";

                try {
                    await driver.findElement(By.id('captcha'));
                    console.log("Stop in idx : " + col);
                    return;
                }
                catch (e) {
                }

                let element = await driver.findElement(By.id('pagelet_hometown'));
                try {
                    let elementWorking = await driver.findElement(By.id('pagelet_eduwork'));
                    let strWorking = await elementWorking.getText();
                    obj['company'] = strWorking.replace("\n", ":");
                }
                catch (e) {
                }

                let str = await element.getText();
                if (str.indexOf("Thành phố Hồ Chí Minh") != -1 || str.indexOf("Ho Chi Minh") != -1) {
                    numberGet++;
                    arraySelected.push(obj);
                    await writeText(obj.phone + "," + obj.name + "," + obj.company + "," + obj.link + "," + numberGet);
                }
            }
            catch (e) {

            }
        }
    } finally {
        driver.quit();
    }
}

function writeText(text) {
    text += "\r\n";
    fs.open(path, 'a', function (err, data) {
        if (err) {
            console.log("ERROR !! " + err);
        } else {
            fs.write(data, text, 0, text.length, null, function (err) {
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