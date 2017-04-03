var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var sql = require('mssql');

var dbConfig = {
    server: "localhost\\MSSQLSERVER",
    database: "dataScience",
    user: "sa",
    password: "0731",
    port: 1433
};

//weekday range specified
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
//month range specified
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

function getWeekOfYear(d) {

    // Create a copy of this date object
    var target = new Date(d.valueOf());

    // ISO week date weeks start on monday
    // so correct the day number
    var dayNr = (d.getDay() + 6) % 7;

    // Set the target to the thursday of this week so the
    // target date is in the right year
    target.setDate(target.getDate() - dayNr + 3);

    // ISO 8601 states that week 1 is the week
    // with january 4th in it
    var jan4 = new Date(target.getFullYear(), 0, 4);

    // Number of days between target date and january 4th
    var dayDiff = (target - jan4) / 86400000;

    // Calculate week number: Week 1 (january 4th) plus the
    // number of weeks between target date and january 4th
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;

}
//query function

function getEmp() {
    var conn = new sql.Connection(dbConfig);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        else {
            req.query("SELECT * FROM DateDim", function (err, data) {
                if (err) {
                    console.log(err);

                }
                else {
                    console.log("This is before alter table.")
                    if (!(data[0].Week_in_Year)) {
                        req.query("ALTER TABLE DateDim ADD Week_in_Year INT NULL ;", function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                var i = 0;
                                for (; i < data.length; i++) {
                                    var d = new Date(data[i].Date_PK);
                                    //var dayOfMonth =d.getDate()
                                    var n = weekday[d.getDay()];
                                    //console.log(dayOfMonth);
                                    console.log(n);
                                    var weekOfyear = getWeekOfYear(d);
                                    console.log(weekOfyear);
                                    var string1 = "UPDATE DateDim set Week_in_Year='" + weekOfyear + "' Where Date_SK=" + (i + 1);
                                    //console.log(string1);
                                    req.query(string1, function (err) {
                                        if (err) {
                                            console.log(err);
                                            return;
                                        } else {

                                        }
                                    })
                                }

                            }
                        })
                    }
                    console.log(data[0])
                    //var d = new Date(data[0].Date_PK);
                    // var dayOfMonth =d.getDate()
                    //var n = weekday[d.getDay()];
                    //console.log(dayOfMonth);
                    // console.log(n);
                    if (!(data[0].Weekend)) {
                        req.query("ALTER TABLE DateDim ADD Weekend Varchar(20) NULL ;", function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                var i = 0;
                                for (; i < data.length; i++) {
                                    var d = new Date(data[i].Date_PK);
                                    //var dayOfMonth =d.getDate()
                                    var n = weekday[d.getDay()];
                                    //console.log(dayOfMonth);
                                    console.log(n);
                                    var weekOfyear = getWeekOfYear(d);
                                    console.log(weekOfyear);
                                    if (n == "Sunday" || n == "Saturday") {
                                        var string1 = "UPDATE DateDim set Weekend='Yes' Where Date_SK=" + (i + 1);
                                        //console.log(string1);
                                        req.query(string1, function (err) {
                                            if (err) {
                                                console.log(err);
                                                return;
                                            } else {

                                            }
                                        })
                                    }
                                    else{
                                        var string1 = "UPDATE DateDim set Weekend='No' Where Date_SK=" + (i + 1);
                                        //console.log(string1);
                                        req.query(string1, function (err) {
                                            if (err) {
                                                console.log(err);
                                                return;
                                            } else {

                                            }
                                        })
                                    }
                                }

                            }
                        })
                    }
                    if (!(data[0].Month)) {
                        req.query("ALTER TABLE DateDim ADD Month Varchar(20) NULL ;", function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                var i = 0;
                                for (; i < data.length; i++) {
                                    var d = new Date(data[i].Date_PK);
                                    //var dayOfMonth =d.getDate()
                                    console.log(d+"this is d")
                                    var n = month[d.getMonth()];
                                    console.log(d.getMonth()+"this is month")
                                    console.log(d.getYear()+"this is year")
                                    //var n = weekday[d.getDay()];
                                    //console.log(dayOfMonth);
                                    console.log(n);
                                    var weekOfyear = getWeekOfYear(d);
                                    console.log(weekOfyear);

                                        var string1 = "UPDATE DateDim set Month='"+n+"' Where Date_SK=" + (i + 1);
                                        //console.log(string1);
                                        req.query(string1, function (err) {
                                            if (err) {
                                                console.log(err);
                                                return;
                                            } else {

                                            }
                                        })

                                }

                            }
                        })
                    }
                    if (!(data[0].Year)) {
                        req.query("ALTER TABLE DateDim ADD Year INT NULL ;", function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                var i = 0;
                                for (; i < data.length; i++) {
                                    var d = new Date(data[i].Date_PK);
                                    //var dayOfMonth =d.getDate()
                                    //console.log(d+"this is d")
                                    var n = d.getFullYear();
                                   // console.log(d.getMonth()+"this is month")
                                    //console.log(d.getYear()+"this is year")
                                    //var n = weekday[d.getDay()];
                                    //console.log(dayOfMonth);
                                   // console.log(n);
                                 //   var weekOfyear = getWeekOfYear(d);
                                  //  console.log(weekOfyear);

                                    var string1 = "UPDATE DateDim set Year='"+n+"' Where Date_SK=" + (i + 1);
                                    //console.log(string1);
                                    req.query(string1, function (err) {
                                        if (err) {
                                            console.log(err);
                                            return;
                                        } else {

                                        }
                                    })

                                }

                            }
                        })
                    }
                    if (!(data[0].Date)) {
                        req.query("ALTER TABLE DateDim ADD Date Varchar(20) NULL ;", function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                var i = 0;
                                for (; i < data.length; i++) {
                                    var d = new Date(data[i].Date_PK);
                                    //var dayOfMonth =d.getDate()
                                    //console.log(d+"this is d")
                                    var month;
                                    if(d.getMonth()<9) {
                                        month = "0" + (d.getMonth() + 1)
                                        console.log(month+"this is month")
                                    }
                                    else{
                                        month=(d.getMonth()+1)
                                    }
                                    var day;
                                    console.log(d.getDate()+"this is date")
                                    if(d.getDate()<10) {
                                        day = "0" + (d.getDate())
                                        console.log(day+"this is day")
                                    }
                                    else{
                                        day=(d.getDate())
                                    }

                                    var n=d.getFullYear()+"-"+month+"-"+day
                                    console.log(d+"this is d")
                                    console.log(n+"this is n")
                                    // console.log(d.getMonth()+"this is month")
                                    //console.log(d.getYear()+"this is year")
                                    //var n = weekday[d.getDay()];
                                    //console.log(dayOfMonth);
                                    // console.log(n);
                                    //   var weekOfyear = getWeekOfYear(d);
                                    //  console.log(weekOfyear);

                                    var string1 = "UPDATE DateDim set Date='"+n+"' Where Date_SK=" + (i + 1);
                                    //console.log(string1);
                                    req.query(string1, function (err) {
                                        if (err) {
                                            console.log(err);
                                            return;
                                        } else {

                                        }
                                    })

                                }

                            }
                        })
                    }
                    var i = 0;
                    //For automation above need to add attribute below one doesn't
                    //And below is for Day_of_Week
                    for (; i < data.length; i++) {
                        var d = new Date(data[i].Date_PK);
                        var n = weekday[d.getDay()];
                        var string1 = "UPDATE DateDim set Day_of_Week='" + n + "' Where Date_SK=" + (i + 1);
                        // console.log(string1);
                        req.query(string1, function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {

                            }
                        })
                    }
                    var d = new Date(data[6].Date_PK);
                    //var dayOfMonth =d.getDate()
                    var n = weekday[d.getDay()];
                    //console.log(dayOfMonth);
                    console.log(n);
                    var weekOfyear = getWeekOfYear(d);
                    console.log(weekOfyear);
                }

            });

            // conn.close();
        }
    });

}
getEmp();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
