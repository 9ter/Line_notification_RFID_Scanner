const express = require('express'); //;

const app = express(); //;
var bodyParser = require('body-parser'); //;
var cors = require('cors'); //;
const LineAPI = require('line-api');
var mysql = require('mysql');
var date = require('date-utils');
const delay = require('delay');


/*const say = require('say')
const prompt = require('prompt')

prompt.start()
prompt.get(['message'],(error,result)->{
 say.speak(result,message)
})*/
const notify = new LineAPI.Notify({
    token: "****************"
})

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: ""
});
var name = "";
var list = "";
var user_kak = "";
var Time_list = "";
app.post('/User_Time_Stamp', function(req, res) {

    var Data = req.query.Data.split(',')

    strID = Data[0]
    var name_lastname = ""
    console.log('RFID_CARD : Key = ' + strID)

    user_kak = strID;

    var datetime = require('node-datetime');
    var dt = datetime.create();
    var Time_Stamp = dt.format('m/d/y H:M');
    var Time_H = dt.format('H');
    var Time_M = dt.format('M');





    var text_status = "";
    if (Number(Time_H) >= 6 && (Number(Time_H) < 8)) {
        text_status = "เข้าเช้า ไม่สาย";

    } else if ((Number(Time_H) >= 8 && Number(Time_M) > 0) && Number(Time_H) < 12) {
        var cal = (Number(Time_H) - 8) * 2
        var na_t = ((Number(Time_M)) * 2)
        text_status = "เข้าเช้า สาย ทดเวลา " + cal + "ชม." + na_t + "นาที";
    } else if ((Number(Time_H) >= 17 && Number(Time_M) >= 0) && (Number(Time_H)) <= 24) {
        var cal = (Number(Time_H) && Number(Time_M))
        text_status = "ออก ";
    } else if (Number(Time_H) >= 12 && (Number(Time_H) < 13)) {
        text_status = "พักเที่ยง";

    } else if (Number(Time_H) >= 13 && (Number(Time_H) < 15)) {
        text_status = "เข้าบ่าย ไม่สาย";

    } else if ((Number(Time_H) >= 15 && Number(Time_M) >= 23)) {
        var cal = (Number(Time_H) - 15) * 2
        var na_t = ((Number(Time_M)) * 2)
        text_status = "เข้าบ่าย สาย ทดเวลา " + cal + " ชม." + na_t + "นาที";
    } else if ((Number(Time_H) >= 1 && Number(Time_M) >= 0) && (Number(Time_H)) < 5) {
        var cal = (Number(Time_H) && Number(Time_M))
        text_status = "ออก ";
    }





    con.query("SELECT * FROM testtabel where ip = '" + strID + "'", function(err, result, fields) {
        if (err) throw err;
        console.log("SELECT * FROM testtabel where ip = '" + strID + "'");
        console.log(result);
        name_lastname = result[0].firstname + ' ' + result[0].lastname;

        notify.send({
            message: '' + name_lastname + ' สแกนแล้ว ' + Time_Stamp + "\n" + text_status
                //sticker: 'smile' // shorthan
                // sticker : { packageId: 1, id: 2 } // exact ids
                //image: 'test.jpg' // local file
                // image: { fullsize: 'http://example.com/1024x1024.jpg', thumbnail: 'http://example.com/240x240.jpg' } // remote url
        }).then(console.log)
        con.query("INSERT INTO checklogin(user) values ('" + name_lastname + "')", function(err, result, fields) {
            if (err) throw err;
        });
    });



    /*
        notify.send({
            message: 'นาย ' + strID + ' เข้างาน',
            sticker: 'smile' // shorthand
            // sticker : { packageId: 1, id: 2 } // exact ids
            //image: 'test.jpg' // local file
            // image: { fullsize: 'http://example.com/1024x1024.jpg', thumbnail: 'http://example.com/240x240.jpg' } // remote url
        }).then(console.log)
    */

    var query = "SELECT * FROM testtabel WHERE 'ip' = `'%" + strID + "%'";


    res.send('success : ' + req.query.temp)
})



function myFunc(arg) {
    var date1 = list;
    var datetime = require('node-datetime');
    var dt = datetime.create();
    var Time_Stamp = dt.format('m/d/y ');
    var Time_H = dt.format('H');
    var Time_M = dt.format('M');
    var Time_S = dt.format('S');
    console.log(Time_Stamp + " * " + Time_H + " * " + Time_M + " * " + Time_S);
    if (Number(Time_H) == 16 && Number(Time_M) == 41 && Time_S == 0) {
        notify.send({
            message: '' + list,
            // sticker: 'smile' // shorthand
            // sticker : { packageId: 1, id: 2 } // exact ids
            //image: 'test.jpg' // local file
            // image: { fullsize: 'http://example.com/1024x1024.jpg', thumbnail: 'http://example.com/240x240.jpg' } // remote url
        }).then(console.log)
    }
}
setInterval(myFunc, 1000);


app.listen(3000, () => {
    console.log('Start server at port 3000.')

})