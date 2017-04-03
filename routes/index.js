var express = require('express');
var router = express.Router();
var sql = require('mssql');

var dbConfig = {
  server: "localhost\\MSSQLSERVER",
  database: "dataScience",
  user: "sa",
  password: "0731",
  port: 1433
};
var colors=["#67809F","#4B77BE", "#FF0F00","#FF6600","#FF9E01","#FCD202","#F8FF01","#B0DE09","#04D215","#0D8ECF",
  "#0D52D1", "#2A0CD0","#8A0CCF","#CD0D74","#26C281","#E7505A","#C8D046","#BF55EC","#F2784B","#E1E5EC",
  "#3598DC","#94A0B2","#EF4836","#D91E18","#F2784B","#8E44AD","#C5BF66","#22313F","#44B6AE","#5C9BD1"]
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.get('/locationChart', function(req, res, next) {
  res.render('locationCharts', { title: 'Express' });
});
router.get('/dateChart', function(req, res, next) {
  res.render('dateCharts', { title: 'Express' });
});
router.get('/productChart', function(req, res, next) {
  res.render('productCharts', { title: 'Express' });
});
router.post('/dashboard', function(req, res, next) {
  res.render('indexv2', { title: 'Express' });
});
router.post('/createQuery1', function(req, res, next) {
  console.log(req.body.countryQ1)
  var countryQ1=req.body.countryQ1
  console.log(req.body.dateMonth)
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
  var dateMonth = req.body.dateMonth.split("-");
  var dateofMonth=dateMonth[2]+"-"+dateMonth[1]+"-"+dateMonth[0];
  console.log(dateofMonth)
  var res1=dateMonth[1].replace("0","");
  var res2=parseInt(res1)-1;
  console.log(res1+"this is res1")
  console.log(res2+"this is res2")
  var m=month[res2];
  console.log(m)
  var conn = new sql.Connection(dbConfig);
  var req = new sql.Request(conn);
  var result;
  conn.connect(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    else {
      req.query("SELECT distinct L.Country, P.[Product Name] as Product_Name, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE L.Location_SK = F.Location_FSK AND P.Product_SK = F.Product_FSK AND L.Country = '"+countryQ1+"' GROUP BY GROUPING SETS ((P.[Product Name], L.Country)) ORDER BY L.Country, P.[Product Name];", function (err, data) {
        if (err) {
          console.log(err);

        }
        else {

          console.log("I am in data")
          var i=0;
          var productName=[];
          var country=[];
          var price=[];
          console.log(data[0].Country);
          for(;i<data.length;i++)
          {
            productName[i]=data[i].Product_Name;
            country[i]=data[i].Country;
            price[i]=data[i].Price;
          }
          console.log(price[10]);
          req.query("SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Month, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE  P.Product_SK = F.Product_FSK  AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND D.Month = '"+m+"' AND L.Country = '"+countryQ1+"' GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Month)) ORDER BY L.Country, D.Month, P.[Product Name];", function (err, chart2Data) {
            if (err) {
              console.log(err);

            } else {
              console.log(chart2Data[0])
              var i=0;
              // var productName=[];
              //var country=[];
              var chart2Price=[];
              console.log(chart2Data[0].Product_Name);
              for(;i<chart2Data.length;i++)
              {
                //productName[i]=chart2Data[i].Product_Name;
                //country[i]=data[i].Country;
                chart2Price[i]=chart2Data[i].Price;
              }
             // console.log(chart2Price)
              //console.log(productName)
              console.log(dateofMonth)
              req.query("SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Date, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE P.Product_SK = F.Product_FSK AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND D.Date = '"+dateofMonth+"' AND L.Country = '"+countryQ1+"' GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Date)) ORDER BY L.Country, P.[Product Name], D.Date;", function (err, chart3Data) {
                if (err) {
                  console.log(err);

                } else {
                  console.log(chart3Data[0])
                  var i=0;
                  // var productName=[];
                  //var country=[];
                  var chart3Price=[];
                 // console.log(chart3Data[0].Product_Name);
                  for(;i<chart3Data.length;i++)
                  {
                    //productName[i]=chart2Data[i].Product_Name;
                    //country[i]=data[i].Country;
                    chart3Price[i]=chart3Data[i].Price;
                  }
                  //console.log(chart3Price)
                 // console.log(productName)
                  res.render('testChartInScript', {
                    productName: productName,
                    country: country,
                    price: price,
                    chart3Price:chart3Price,
                    chart2Price: chart2Price,
                    colors: colors
                  });
                }
              })
            }
          })

        }
      })
    }
  })
  //res.render('indexv2', { title: 'Express' });
});
router.get('/dashboard', function(req, res, next) {
  res.render('testChart', { title: 'Express' });
});
router.get('/test', function(req, res, next) {
  var conn = new sql.Connection(dbConfig);
  var req = new sql.Request(conn);
  var result;
  conn.connect(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    else {
      req.query("select distinct [Product Name] as Product_Name from [dataScience].[dbo].[ProductDim2] order by [Product Name]", function (err, data) {
        if (err) {
          console.log(err);

        }
        else {
          var i=0;
          var productName=[];
          console.log(data[0].Country);
          for(;i<data.length;i++)
          {
            productName[i]=data[i].Product_Name;
          }
          req.query("select distinct [Day_of_Week] from [dataScience].[dbo].[DateDim] order by [Day_of_Week]", function (err, Day_of_Week) {
            if (err) {
              console.log(err);

            }
            else {
              var i=0;
              var day_of_week=[];
             // console.log(data[0].Country);
              for(;i<Day_of_Week.length;i++)
              {
                day_of_week[i]=Day_of_Week[i].Day_of_Week;
              }
              req.query("select distinct [Location Name] as Location_Name from [dataScience].[dbo].[LocationDim2] order by [Location Name]", function (err, City) {
                if (err) {
                  console.log(err);

                }
                else {
                  var i = 0;
                  var city = [];
                  // console.log(data[0].Country);
                  for (; i < City.length; i++) {
                    city[i] = City[i].Location_Name;
                  }
                  res.render('indexv3', {
                    productName: productName,
                    day_of_week: day_of_week,
                    city:city
                  });
                }
              })
            }
          })

        }
      })
    }
  })

  // conn.connect(function (err) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   else {
  //     req.query("SELECT distinct L.Country, P.[Product Name] as Product_Name, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE L.Location_SK = F.Location_FSK AND P.Product_SK = F.Product_FSK AND L.Country = 'Brazil' GROUP BY GROUPING SETS ((P.[Product Name], L.Country)) ORDER BY L.Country, P.[Product Name];", function (err, data) {
  //       if (err) {
  //         console.log(err);
  //
  //       }
  //       else {
  //
  //         console.log("I am in data")
  //         var i=0;
  //         var productName=[];
  //         var country=[];
  //         var price=[];
  //         console.log(data[0].Product_Name);
  //         for(;i<data.length;i++)
  //         {
  //           productName[i]=data[i].Product_Name;
  //           country[i]=data[i].Country;
  //           price[i]=data[i].Price;
  //         }
  //         console.log(price[10]);
  //         req.query("SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Month, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE  P.Product_SK = F.Product_FSK  AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND D.Month = 'April' AND L.Country = 'Brazil' GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Month)) ORDER BY L.Country, D.Month, P.[Product Name];", function (err, chart2Data) {
  //           if (err) {
  //             console.log(err);
  //
  //           } else {
  //             console.log(chart2Data[0])
  //             var i=0;
  //            // var productName=[];
  //             //var country=[];
  //             var chart2Price=[];
  //             console.log(chart2Data[0].Product_Name);
  //             for(;i<chart2Data.length;i++)
  //             {
  //               //productName[i]=chart2Data[i].Product_Name;
  //               //country[i]=data[i].Country;
  //               chart2Price[i]=chart2Data[i].Price;
  //             }
  //             console.log(chart2Price)
  //             console.log(productName)
  //             req.query("SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Date, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE P.Product_SK = F.Product_FSK AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND D.Date = '2012-04-11' AND L.Country = 'Bangladesh' GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Date)) ORDER BY L.Country, P.[Product Name], D.Date;", function (err, chart3Data) {
  //               if (err) {
  //                 console.log(err);
  //
  //               } else {
  //                 console.log(chart3Data[0])
  //                 var i=0;
  //                 // var productName=[];
  //                 //var country=[];
  //                 var chart3Price=[];
  //                 console.log(chart3Data[0].Product_Name);
  //                 for(;i<chart3Data.length;i++)
  //                 {
  //                   //productName[i]=chart2Data[i].Product_Name;
  //                   //country[i]=data[i].Country;
  //                   chart3Price[i]=chart3Data[i].Price;
  //                 }
  //                 console.log(chart3Price)
  //                 console.log(productName)
  //                 res.render('testChartInScript', {
  //                   productName: productName,
  //                   country: country,
  //                   price: price,
  //                   chart3Price:chart3Price,
  //                   chart2Price: chart2Price,
  //                   colors: colors
  //                 });
  //               }
  //             })
  //           }
  //         })
  //
  //       }
  //     })
  //   }
  // })
  // console.log("I am out data")

});

router.post('/createQuery2', function(req, res, next) {

  var countryQ1=req.body.countryQ1
  console.log(countryQ1)
  var productQ1=req.body.productNameQ1
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
  var dateMonth = req.body.dateMonth.split("-");
  var dateofMonth=dateMonth[2]+"-"+dateMonth[1]+"-"+dateMonth[0];

  var res1=dateMonth[1].replace("0","");
  var res2=parseInt(res1)-1;


  var m=month[res2];

  var conn = new sql.Connection(dbConfig);
  var req = new sql.Request(conn);
  var result;
  //dateofMonth is the Date can be matched in database m is the month  countryq1 is the country
  conn.connect(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    else {
      req.query("SELECT distinct L.Country, P.[Product Name] As Product_Name, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE L.Location_SK = F.Location_FSK AND P.Product_SK = F.Product_FSK AND P.[Product Name] = '"+productQ1+"' AND L.Country = '"+countryQ1[0]+"' GROUP BY GROUPING SETS ((P.[Product Name], L.Country)) ORDER BY L.Country;", function (err, data) {
        if (err) {
          console.log(err);

        }
        else {

          console.log("I am in data")
          var i=0;
          var productName=[];
          var country0=[];
          var price0=[];
          console.log(data[0].Country);
          for(;i<data.length;i++)
          {
            productName[i]=data[i].Product_Name;
            country0[i]=data[i].Country;
            price0[i]=data[i].Price;
          }
          //console.log(price[10]);
          req.query("SELECT distinct L.Country, P.[Product Name] As Product_Name, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE L.Location_SK = F.Location_FSK AND P.Product_SK = F.Product_FSK AND P.[Product Name] = '"+productQ1+"' AND L.Country = '"+countryQ1[1]+"' GROUP BY GROUPING SETS ((P.[Product Name], L.Country)) ORDER BY L.Country;", function (err, c1Data) {
            if (err) {
              console.log(err);

            }
            else {

              console.log("I am in data")
              var i=0;
              var productName=[];
              var country1=[];
              var price1=[];
              console.log(c1Data[0].Country);
              for(;i<data.length;i++)
              {
                productName[i]=c1Data[i].Product_Name;
                country1[i]=c1Data[i].Country;
                price1[i]=c1Data[i].Price;
              }
              req.query("SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Month, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE  P.Product_SK = F.Product_FSK  AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND P.[Product Name] = '"+productQ1+"' AND L.Country = '"+countryQ1[0]+"' GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Month)) ORDER BY D.Month, P.[Product Name];", function (err, chart2C0Data) {
                if (err) {
                  console.log(err);

                } else {
                  //console.log(chart3Data[0])
                  var i=0;
                  // var productName=[];
                  var c0Month=[];
                  var c0Price=[];
                  // console.log(chart3Data[0].Product_Name);
                  for(;i<chart2C0Data.length;i++)
                  {
                    //productName[i]=chart2Data[i].Product_Name;
                    c0Month[i]=chart2C0Data[i].Month;
                    c0Price[i]=chart2C0Data[i].Price;
                  }
                  req.query("SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Month, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE  P.Product_SK = F.Product_FSK  AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND P.[Product Name] = '"+productQ1+"' AND L.Country = '"+countryQ1[1]+"' GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Month)) ORDER BY D.Month, P.[Product Name];", function (err, chart2C1Data) {
                    if (err) {
                      console.log(err);

                    } else {
                      //console.log(chart3Data[0])
                      var i = 0;
                      // var productName=[];
                      var c1Month = [];
                      var c1Price = [];
                      // console.log(chart3Data[0].Product_Name);
                      for (; i < chart2C1Data.length; i++) {
                        //productName[i]=chart2Data[i].Product_Name;
                        c1Month[i] = chart2C1Data[i].Month;
                        c1Price[i] = chart2C1Data[i].Price;
                      }
                      //console.log(chart3Price)
                      // console.log(productName)
                      req.query("SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Date, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE P.Product_SK = F.Product_FSK AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND P.[Product Name] = '"+productQ1+"' AND L.Country = '"+countryQ1[0]+"' GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Date)) ORDER BY D.Date;", function (err, chart3C0Data) {
                        if (err) {
                          console.log(err);

                        } else {
                          //console.log(chart3Data[0])
                          var i = 0;
                          // var productName=[];
                          var c30Date = [];
                          var c30Price = [];
                          // console.log(chart3Data[0].Product_Name);
                          for (; i < chart3C0Data.length; i++) {
                            //productName[i]=chart2Data[i].Product_Name;
                            c30Date[i] = chart3C0Data[i].Date;
                            c30Price[i] = chart3C0Data[i].Price;
                          }
                          req.query("SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Date, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE P.Product_SK = F.Product_FSK AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND P.[Product Name] = '"+productQ1+"' AND L.Country = '"+countryQ1[1]+"' GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Date)) ORDER BY D.Date;", function (err, chart3C0Data) {
                            if (err) {
                              console.log(err);

                            } else {
                              //console.log(chart3Data[0])
                              var i = 0;
                              // var productName=[];
                              var c31Date = [];
                              var c31Price = [];
                              // console.log(chart3Data[0].Product_Name);
                              for (; i < chart3C0Data.length; i++) {
                                //productName[i]=chart2Data[i].Product_Name;
                                c31Date[i] = chart3C0Data[i].Date;
                                c31Price[i] = chart3C0Data[i].Price;
                              }
                              res.render('query2Chart', {
                                productName: productName,
                                country0: country0,
                                country1: country1,
                                price0: price0,
                                price1: price1,
                                c1Month: c1Month,
                                c31Date:c31Date,
                                c31Price:c31Price,
                                c30Date:c30Date,
                                c30Price:c30Price,
                                c0Month: c0Month,
                                c0Price: c0Price,
                                c1Price: c1Price,

                                colors: colors
                              });
                            }
                          });
                        }
                      })
                    }
                  })
                }
              })
            }
          })

        }
      })
    }
  })
  //res.render('indexv2', { title: 'Express' });
});

router.post('/createQuery4', function(req, res, next) {

  var day_of_week=req.body.day_of_week
  //console.log(countryQ1)
 // var productQ1=req.body.productNameQ1
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
  // var dateMonth = req.body.dateMonth.split("-");
  // var dateofMonth=dateMonth[2]+"-"+dateMonth[1]+"-"+dateMonth[0];
  //
  // var res1=dateMonth[1].replace("0","");
  // var res2=parseInt(res1)-1;
  //
  //
  // var m=month[res2];

  var conn = new sql.Connection(dbConfig);
  var req = new sql.Request(conn);
  var result;
  //dateofMonth is the Date can be matched in database m is the month  countryq1 is the country
  conn.connect(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    else {
      req.query("SELECT distinct P.Category, Avg(F.AvgPrice) As Price, D.Day_of_Week FROM [dbo].[FactTable2] F, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE P.Product_SK = F.Product_FSK AND F.Date_FSK = D.Date_SK AND D.Day_of_Week = '"+day_of_week[0]+"' GROUP BY P.Category, D.Day_of_Week ORDER BY P.Category;", function (err, data) {
        if (err) {
          console.log(err);

        }
        else {

          console.log("I am in data")
          var i=0;
          var category0=[];

          var price0=[];
          for(;i<data.length;i++)
          {
            category0[i]=data[i].Category;
            price0[i]=data[i].Price;
          }
          //console.log(price[10]);
          req.query("SELECT distinct P.Category, Avg(F.AvgPrice) As Price, D.Day_of_Week FROM [dbo].[FactTable2] F, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE P.Product_SK = F.Product_FSK AND F.Date_FSK = D.Date_SK AND D.Day_of_Week = '"+day_of_week[1]+"' GROUP BY P.Category, D.Day_of_Week ORDER BY P.Category;", function (err, c1Data) {
            if (err) {
              console.log(err);

            }
            else {

              var i=0;
              var category1=[];

              var price1=[];
              for(;i<c1Data.length;i++)
              {
                category1[i]=c1Data[i].Category;
                price1[i]=c1Data[i].Price;
              }
              req.query("SELECT distinct P.Category, Avg(F.AvgPrice) As Price, D.Weekend FROM [dbo].[FactTable2] F, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE P.Product_SK = F.Product_FSK AND F.Date_FSK = D.Date_SK AND D.Weekend = 'Yes' GROUP BY P.Category, D.Weekend ORDER BY p.Category;", function (err, c2YData) {
                if (err) {
                  console.log(err);

                }
                else {

                  var i = 0;
                  var categoryc21 = [];

                  var pricec21 = [];
                  for (; i < c2YData.length; i++) {
                    categoryc21[i] = c2YData[i].Category;
                    pricec21[i] = c2YData[i].Price;
                  }
                  req.query("SELECT distinct P.Category, Avg(F.AvgPrice) As Price, D.Weekend FROM [dbo].[FactTable2] F, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE P.Product_SK = F.Product_FSK AND F.Date_FSK = D.Date_SK AND D.Weekend = 'No' GROUP BY P.Category, D.Weekend ORDER BY p.Category;", function (err, c2NData) {
                    if (err) {
                      console.log(err);

                    }
                    else {

                      var i = 0;
                      var categoryc22 = [];

                      var pricec22 = [];
                      for (; i < c2NData.length; i++) {
                        categoryc22[i] = c2NData[i].Category;
                        pricec22[i] = c2NData[i].Price;
                      }
                      res.render('query4Chart', {

                        price0: price0,
                        price1: price1,
                        category1: category1,
                        category0: category0,
                        categoryc22:categoryc22,
                        categoryc21:categoryc21,
                        pricec22:pricec22,
                        pricec21:pricec21,
                      day_of_week: day_of_week,

                        colors: colors
                      });
                    }
                  })
                }
              })

            }
          })
        }
      })
    }
  })
  //res.render('indexv2', { title: 'Express' });
});

router.post('/createQuery5', function(req, res, next) {

  var countryQ1=req.body.countryQ1
  var city=req.body.city
  //console.log(countryQ1)
  var productQ1=req.body.productNameQ1
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
  // var dateMonth = req.body.dateMonth.split("-");
  // var dateofMonth=dateMonth[2]+"-"+dateMonth[1]+"-"+dateMonth[0];
  //
  // var res1=dateMonth[1].replace("0","");
  // var res2=parseInt(res1)-1;
  //
  //
  // var m=month[res2];

  var conn = new sql.Connection(dbConfig);
  var req = new sql.Request(conn);
  var result;
  //dateofMonth is the Date can be matched in database m is the month  countryq1 is the country
  conn.connect(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    else {
      req.query("SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Date, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE P.Product_SK = F.Product_FSK AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND L.Country = '"+countryQ1+"' AND P.[Product Name] = '"+productQ1+"' GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Date)) ORDER BY D.Date;", function (err, data) {
        if (err) {
          console.log(err);

        }
        else {

          console.log("I am in data")
          var i=0;
          var date0=[];

          var price0=[];
          for(;i<data.length;i++)
          {
            date0[i]=data[i].Date;
            price0[i]=data[i].Price;
          }
          //console.log(price[10]);
          req.query("SELECT distinct L.[Location Name] As City, P.[Product Name] As Product_Name, D.Date, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D WHERE P.Product_SK = F.Product_FSK AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND L.[Location Name] = '"+city+"' AND P.[Product Name] = '"+productQ1+"' GROUP BY GROUPING SETS ((P.[Product Name],L.[Location Name], D.Date)) ORDER BY D.Date;", function (err, c1Data) {
            if (err) {
              console.log(err);

            }
            else {

              var i=0;
              var date1=[];

              var price1=[];
              for(;i<c1Data.length;i++)
              {
                date1[i]=c1Data[i].Date;
                price1[i]=c1Data[i].Price;
              }

                      res.render('query5Chart', {

                        price0: price0,
                        price1: price1,
                        date0: date0,
                        date1: date1,
                        city:city,
                        product:productQ1,
                        country:countryQ1,


                        colors: colors
                      });




            }
          })
        }
      })
    }
  })
  //res.render('indexv2', { title: 'Express' });
});

router.post('/createQuery6', function(req, res, next) {


  var productQ1=req.body.productNameQ1
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
  // var dateMonth = req.body.dateMonth.split("-");
  // var dateofMonth=dateMonth[2]+"-"+dateMonth[1]+"-"+dateMonth[0];
  //
  // var res1=dateMonth[1].replace("0","");
  // var res2=parseInt(res1)-1;
  //
  //
  // var m=month[res2];

  var conn = new sql.Connection(dbConfig);
  var req = new sql.Request(conn);
  var result;
  //dateofMonth is the Date can be matched in database m is the month  countryq1 is the country
  conn.connect(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    else {
      req.query("SELECT distinct L.[Annual average income(USD)] as Average_Income, L.country, Avg(F.AvgPrice) As Price FROM [dbo].[FactTable2] F JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK WHERE P.[Product Name] = '"+productQ1+"' GROUP BY L.Country, L.[Annual average income(USD)];", function (err, data) {
        if (err) {
          console.log(err);

        }
        else {

          console.log("I am in data")
          var i=0;
          var income=[];
      var country=[];
          var price0=[];
          for(;i<data.length;i++)
          {
            income[i]=data[i].Average_Income;
            country[i]=data[i].Country;
            price0[i]=data[i].Price;
          }
          //console.log(price[10]);


              res.render('query6Chart', {

                price0: price0,
                income: income,
                country:country,
                product:productQ1,



                colors: colors
              });





        }
      })
    }
  })
  //res.render('indexv2', { title: 'Express' });
});

router.post('/createQuery7', function(req, res, next) {


  var productQ1=req.body.productNameQ1
  var product1=productQ1[0]
  var product2=productQ1[1]
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
  // var dateMonth = req.body.dateMonth.split("-");
  // var dateofMonth=dateMonth[2]+"-"+dateMonth[1]+"-"+dateMonth[0];
  //
  // var res1=dateMonth[1].replace("0","");
  // var res2=parseInt(res1)-1;
  //
  //
  // var m=month[res2];

  var conn = new sql.Connection(dbConfig);
  var req = new sql.Request(conn);
  var result;
  //dateofMonth is the Date can be matched in database m is the month  countryq1 is the country
  conn.connect(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    else { req.query("SELECT distinct L.Country, Avg(F.AvgPrice) As Price From [dbo].[FactTable2] F JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK WHERE P.[Product Name] = '"+productQ1[0]+"' GROUP BY L.Country ORDER BY L.Country;", function (err, data) {
      if (err) {
        console.log(err);

      }
      else {

        console.log("I am in data")
        var i=0;
       // var city=[];
        var country=[];
        var price0=[];
        for(;i<data.length;i++)
        {
          price0[i]=data[i].Price;
          country[i]=data[i].Country;
         
        }
        //console.log(price[10]);
        req.query("SELECT distinct L.Country, Avg(F.AvgPrice) As Price From [dbo].[FactTable2] F JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK WHERE P.[Product Name] = '"+productQ1[1]+"' GROUP BY L.Country ORDER BY L.Country;", function (err, data1) {
          if (err) {
            console.log(err);

          }
          else {

            console.log("I am in data")
            var i = 0;
            // var city=[];
            var countryP2 = [];
            var priceP2 = [];
            for (; i < data1.length; i++) {
              priceP2[i] = data1[i].Price;
              countryP2[i] = data1[i].Country;

            }
            //console.log(price[10]);
            req.query("SELECT distinct L.[Location Name] As Location_Name,L.Country, Avg(F.AvgPrice) As Price From [dbo].[FactTable2] F JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK WHERE P.[Product Name] = '" + productQ1[0] + "' GROUP BY L.[Location Name],L.Country;", function (err, allData) {
              if (err) {
                console.log(err);

              }
              else {

                console.log("I am in data")
                var i = 0;
                var city = [];
                var country1 = [];
                var price1 = [];
                for (; i < allData.length; i++) {
                  city[i] = allData[i].Location_Name;
                  country1[i] = allData[i].Country;
                  price1[i] = allData[i].Price;
                }
                //console.log(price[10]);


                res.render('query7Chart', {
                  countryP2:countryP2,
                  price0: price0,
                  price1: price1,
                  city: city,
                  country: country,
                  product: productQ1,
                  country1: country1,
                  priceP2:priceP2,
                  colors: colors
                });

              }
            })

          }
        })

        }
      })
    }
  })
  //res.render('indexv2', { title: 'Express' });
});

router.post('/check', function(req, result, next) {
  var email = req.body.email;

  result.send('OK');

  console.log(email);
});
var ChartsAmcharts = function() {

  var initChartSample1 = function() {
    var chart = AmCharts.makeChart("chart_1", {
      "type": "serial",
      "theme": "light",
      "pathToImages": App.getGlobalPluginsPath() + "amcharts/amcharts/images/",
      "autoMargins": false,
      "marginLeft": 30,
      "marginRight": 8,
      "marginTop": 10,
      "marginBottom": 26,

      "fontFamily": 'Open Sans',
      "color":    '#888',

      "dataProvider": [{
        "year": 2009,
        "income": 23.5,
        "expenses": 18.1
      }, {
        "year": 2010,
        "income": 26.2,
        "expenses": 22.8
      }, {
        "year": 2011,
        "income": 30.1,
        "expenses": 23.9
      }, {
        "year": 2012,
        "income": 29.5,
        "expenses": 25.1
      }, {
        "year": 2013,
        "income": 30.6,
        "expenses": 27.2,
        "dashLengthLine": 5
      }, {
        "year": 2014,
        "income": 34.1,
        "expenses": 29.9,
        "dashLengthColumn": 5,
        "alpha": 0.2,
        "additional": "(projection)"
      }],
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "startDuration": 1,
      "graphs": [{
        "alphaField": "alpha",
        "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
        "dashLengthField": "dashLengthColumn",
        "fillAlphas": 1,
        "title": "Income",
        "type": "column",
        "valueField": "income"
      }, {
        "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
        "bullet": "round",
        "dashLengthField": "dashLengthLine",
        "lineThickness": 3,
        "bulletSize": 7,
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "useLineColorForBulletBorder": true,
        "bulletBorderThickness": 3,
        "fillAlphas": 0,
        "lineAlpha": 1,
        "title": "Expenses",
        "valueField": "expenses"
      }],
      "categoryField": "year",
      "categoryAxis": {
        "gridPosition": "start",
        "axisAlpha": 0,
        "tickLength": 0
      }
    });

    $('#chart_1').closest('.portlet').find('.fullscreen').click(function() {
      chart.invalidateSize();
    });
  }


  return {
    //main function to initiate the module

    init: function() {

      initChartSample1();

    }

  };

}();
router.post('/get_Date', function(req, res, next) {
  console.log("This is in get Date")
  ChartsAmcharts.init();
  console.log("This is in get Date")
});
module.exports = router;
