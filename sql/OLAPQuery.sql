/*** a. Drill down and roll up on Date dimension ***/

/*** On 6 months ***/
USE dataScience;
SELECT distinct L.Country, P.[Product Name] As Product_Name, Avg(F.AvgPrice) As Price
FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D
WHERE L.Location_SK = F.Location_FSK AND P.Product_SK = F.Product_FSK AND L.Country = 'Brazil'  /** We specify the country here**/
GROUP BY GROUPING SETS ((P.[Product Name], L.Country))
ORDER BY L.Country,P.[Product Name];

/*** On a month ***/
SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Month, Avg(F.AvgPrice) As Price
FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D
WHERE  P.Product_SK = F.Product_FSK  AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND D.Month = 'April' AND L.Country = 'Brazil'  /** We specify the country and month here**/
GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Month))
ORDER BY L.Country, D.Month, P.[Product Name];

/*** On a specific Day ***/
SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Date, Avg(F.AvgPrice) As Price
FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D
WHERE P.Product_SK = F.Product_FSK AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND D.Date = '2012-4-11' AND L.Country = 'Bangladesh'  /** We specify the country and date here**/
GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Date))
ORDER BY L.Country, D.Date, P.[Product Name];




/*** b.Price differences of products on more than one country ***/
/*** On 6 months ***/
USE dataScience;
SELECT distinct L.Country, P.[Product Name] As Product_Name, Avg(F.AvgPrice) As Price
FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D
WHERE L.Location_SK = F.Location_FSK AND P.Product_SK = F.Product_FSK AND P.[Product Name] = 'Apple' AND L.Country = 'Bangladesh'   /** We specify the country and product name here**/
GROUP BY GROUPING SETS ((P.[Product Name], L.Country))
ORDER BY L.Country;

/*** On a month ***/
SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Month, Avg(F.AvgPrice) As Price
FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D
WHERE  P.Product_SK = F.Product_FSK  AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND P.[Product Name] = 'Apple' AND L.Country = 'Bangladesh'   /** We specify the country and product name here**/
GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Month))
ORDER BY L.Country, D.Month, P.[Product Name];



/*** On a specific day ***/
SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Date, Avg(F.AvgPrice) As Price
FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D
WHERE P.Product_SK = F.Product_FSK AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND P.[Product Name] = 'Apple' AND L.Country = 'Bangladesh'   /** We specify the country and product name here**/
GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Date))
ORDER BY L.Country, P.[Product Name], D.Date;


/*** c. Prices of categories of products***/

USE dataScience;
SELECT distinct P.Category, P.[Product Name], Avg(F.AvgPrice) As Price
FROM [dbo].[FactTable2] F, [dbo].[ProductDim2] P
WHERE P.Product_SK = F.Product_FSK
GROUP BY ROLLUP(P.Category, P.[Product Name])
ORDER BY P.Category;

/*** d. Comparison on prices of categories of products  ***/

/*** By day od the week ***/
USE dataScience;
SELECT distinct P.Category, Avg(F.AvgPrice) As Price, D.Day_of_Week
FROM [dbo].[FactTable2] F, [dbo].[ProductDim2] P, [dbo].[DateDim] D
WHERE P.Product_SK = F.Product_FSK AND F.Date_FSK = D.Date_SK AND D.Day_of_Week = 'Tuesday'  /** We specify the day of week here**/
GROUP BY P.Category, D.Day_of_Week
ORDER BY P.Category;

/*** By weekend or not ***/
SELECT distinct P.Category, Avg(F.AvgPrice) As Price, D.Weekend
FROM [dbo].[FactTable2] F, [dbo].[ProductDim2] P, [dbo].[DateDim] D
WHERE P.Product_SK = F.Product_FSK AND F.Date_FSK = D.Date_SK AND D.Weekend = 'Yes'  /** We specify whether weekend or not here**/
GROUP BY P.Category, D.Weekend
ORDER BY p.Category;
 


/***  e. Fluctuations in individual product prices ***/
/*** Per country ***/  
SELECT distinct L.Country, P.[Product Name] As Product_Name, D.Date, Avg(F.AvgPrice) As Price
FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D
WHERE P.Product_SK = F.Product_FSK AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND L.Country = 'Brazil'  /** We specify the country here **/
GROUP BY GROUPING SETS ((P.[Product Name],L.Country, D.Date))
ORDER BY L.Country, P.[Product Name], D.Date;

/*** Per City ***/
SELECT distinct L.[Location Name] As City, P.[Product Name] As Product_Name, D.Date, Avg(F.AvgPrice) As Price
FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D
WHERE P.Product_SK = F.Product_FSK AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND L.[Location Name] = 'Aba'   /** We specify the city here **/
GROUP BY GROUPING SETS ((P.[Product Name],L.[Location Name], D.Date))
ORDER BY L.[Location Name], P.[Product Name], D.Date;


/*** f. The prices of a specific product and average income of a country ***/
SELECT distinct L.[Annual average income(USD)] as Average_Income, L.country, Avg(F.AvgPrice) As Price
FROM [dbo].[FactTable2] F
JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK
JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK
WHERE P.[Product Name] = 'Apple'                                   /** We specify the product name here **/
GROUP BY L.Country, L.[Annual average income(USD)];


/*** g. Compare the prices of two complementary products ***/
/*** h. Compare the prices of two complementary products within a specific country ***/
/*** Use one grouping sets ***/
SELECT distinct L.Country, L.[Location Name], D.Month, D.Date, Avg(F.AvgPrice) As Price
From [dbo].[FactTable2] F
JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK
JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK
JOIN [dbo].[DateDim] D ON F.Date_FSK = D.Date_SK
WHERE P.[Product Name] = 'Apple'                               /** We specify the product name here **/
GROUP BY GROUPING SETS (L.Country, (L.Country, D.Month), (L.Country, D.Date), (L.[Location Name]), (L.[Location Name], D.Month), (L.[Location Name], D.Date));

/*** use seperate grouping sets **/
/*** Per country ***/
SELECT distinct L.Country, Avg(F.AvgPrice) As Price
From [dbo].[FactTable2] F
JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK
JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK
WHERE P.[Product Name] = 'Apple'                               /** We specify the product name here **/
GROUP BY L.Country
ORDER BY L.Country;


/*** Per country per month **/
SELECT distinct L.Country, D.Month, Avg(F.AvgPrice) As Price
From [dbo].[FactTable2] F
JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK
JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK
JOIN [dbo].[DateDim] D ON F.Date_FSK = D.Date_SK
WHERE P.[Product Name] = 'Apple'                               /** We specify the product name here **/
GROUP BY L.Country, D.Month
ORDER BY L.Country;

/*** Per country per date ***/
SELECT distinct D.Date, L.Country, Avg(F.AvgPrice) As Price
From [dbo].[FactTable2] F
JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK
JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK
JOIN [dbo].[DateDim] D ON F.Date_FSK = D.Date_SK
WHERE P.[Product Name] = 'Apple'                               /** We specify the product name here **/
GROUP BY L.Country, D.Date
ORDER BY L.Country;

/** Per City **/
SELECT distinct L.[Location Name] As Location_Name, Avg(F.AvgPrice) As Price
From [dbo].[FactTable2] F
JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK
JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK
WHERE P.[Product Name] = 'Apple'                               /** We specify the product name here **/
GROUP BY L.[Location Name];


/** per city per month **/
SELECT distinct D.Month, L.[Location Name], Avg(F.AvgPrice) As Price
From [dbo].[FactTable2] F
JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK
JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK
JOIN [dbo].[DateDim] D ON F.Date_FSK = D.Date_SK
WHERE P.[Product Name] = 'Apple'                               /** We specify the product name here **/
GROUP BY L.[Location Name], D.Month
ORDER BY L.[Location Name];

/** per city per date **/
SELECT distinct L.[Location Name] As Location_Name, D.Date, Avg(F.AvgPrice) As Price
From [dbo].[FactTable2] F
JOIN [dbo].[ProductDim2] P ON P.Product_SK = F.Product_FSK
JOIN [dbo].[LocationDim2] L ON L.Location_SK = F.Location_FSK
JOIN [dbo].[DateDim] D ON F.Date_FSK = D.Date_SK
WHERE P.[Product Name] = 'Apple'                               /** We specify the product name here **/
GROUP BY L.[Location Name], D.Date
ORDER BY L.[Location Name];

