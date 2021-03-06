/***First drop the unused columes ***/
ALTER TABLE [dataScience].[dbo].[Observations$] DROP COLUMN F19,F20,F21,F22,F23,F24,F25,F26,F27,F28,F29,F30,F31,F32,F33,F34,F35,F36,F37,F38,F39,F40,F41,F42,F43,F44,F45,F46,F47,F48,F49,F50,F51,F52,F53,F54,F55,F56,F57,F58,F59,F60,F61,F62,F63,F64,F65,F66,F67,F68,F69,F70,F71,F72,F73,F74,F75,F76,F77,F78,F79,F80,F81,F82,F83,F84,F85,F86,F87,F88,F89,F90,F91,F92,F93,F94,F95,F96,F97,F98,F99,F100,F101,F102,F103,F104,F105,F106,F107,F108,F109,F110,F111,F112,F113,F114,F115,F116,F117,F118,F119,F120,F121,F122,F123,F124,F125,F126,F127,F128,F129,F130,F131,F132,F133,F134,F135,F136,F137,F138,F139,F140,F141,F142,F143,F144,F145,F146,F147,F148,F149,F150,F151,F152,F153,F154,F155,F156,F157,F158,F159,F160,F161,F162,F163,F164,F165,F166,F167,F168,F169,F170,F171,F172,F173,F174,F175,F176,F177,F178,F179,F180,F181,F182,F183,F184,F185,F186,F187,F188,F189,F190,F191,F192,F193,F194,F195,F196,F197,F198,F199,F200,F201,F202,F203,F204,F205,F206,F207,F208,F209,F210,F211,F212,F213,F214,F215,F216,F217,F218,F219,F220,F221,F222,F223,F224,F225,F226,F227,F228,F229,F230,F231,F232,F233,F234,F235;
ALTER TABLE [dataScience].[dbo].[Observations$] DROP COLUMN Line;

/***Remove the redundancies ***/
select distinct * into [dataScience].[dbo].[DistinctData] from [dataScience].[dbo].[Observations$];

/*** Create Product Dimension ***/
use [dataScience];
SELECT distinct [Product Code] as Product_PK, [Product Name] into ProductDim from [dbo].[DistinctData];

/*** Create Location Dimension ***/
SELECT distinct [Location Code] as Location_PK, [Location Name], [Country]  into LocationDim from [dbo].[DistinctData];

/*** Create Date Dimension ***/
SELECT distinct [Obs Date (yyyy-MM-dd)] as Date_PK into DateDim from [dbo].[DistinctData];

/*** Add surrogate keys ***/
ALTER TABLE ProductDim ADD Product_SK int IDENTITY(1,1) PRIMARY KEY NOT NULL
ALTER TABLE LocationDim ADD Location_SK int IDENTITY(1,1) PRIMARY KEY NOT
NULL
ALTER TABLE DateDim ADD Date_SK int IDENTITY(1,1) PRIMARY KEY
NOT NULL


/*** Preload fact table ***/
/***
SELECT [dbo].[DateDim].Date_SK as Date_FSK, 
[dbo].[DateDim].Date_PK as Date_FPK,
[dbo].[DistinctData].[Product Code] as Product_FK,
[dbo].[DistinctData].[Location Code] as Location_FK,
[dbo].[DistinctData].[Obs Price]
into PreFact1Date
from [dbo].DateDim JOIN [dbo].[DistinctData] on [dbo].DateDim.Date_PK =
[dbo].[DistinctData].[Obs Date (yyyy-MM-dd)];


SELECT [dbo].[LocationDim].Location_SK as Location_FSK, 
[dbo].[LocationDim].Location_PK as Location_FPK,
[dbo].[DistinctData].[Product Code] as Product_FK,
[dbo].[DistinctData].[Obs Date (yyyy-MM-dd)] as Date_FK,
[dbo].[DistinctData].[Obs Price]
into PreFact2Location
from [dbo].[LocationDim] JOIN [dbo].[DistinctData] on [dbo].[LocationDim].Location_PK =
[dbo].[DistinctData].[Location Code];

SELECT [dbo].[ProductDim].Product_SK as Product_FSK, 
[dbo].[ProductDim].Product_PK as Product_FPK,
[dbo].[DistinctData].[Location Code] as Location_FK,
[dbo].[DistinctData].[Obs Date (yyyy-MM-dd)] as Date_FK,
[dbo].[DistinctData].[Obs Price]
into PreFact3Product
from [dbo].[ProductDim] JOIN [dbo].[DistinctData] on [dbo].[ProductDim].Product_PK =
[dbo].[DistinctData].[Product Code];
***/


/*** Create Fact table ***/ 
SELECT [dbo].[DateDim].Date_SK as Date_FSK, 
[dbo].[LocationDim].Location_SK as Location_FSK,
[dbo].[ProductDim].Product_SK as Product_FSK, 
[dbo].[DistinctData].[Obs Price] as  Price
into PreFact
from [dbo].[DistinctData]
JOIN [dbo].DateDim on [dbo].DateDim.Date_PK = [dbo].[DistinctData].[Obs Date (yyyy-MM-dd)]
JOIN [dbo].LocationDim on [dbo].[LocationDim].Location_PK = [dbo].[DistinctData].[Location Code]
JOIN [dbo].ProductDim on [dbo].[ProductDim].Product_PK = [dbo].[DistinctData].[Product Code];


/*** Convert and take the average of prices with same Date_FSK, Location_FSK, Product_FSK ***/
/*** Create the fact table ***/
SELECT P.Date_FSK as Date_FSK, 
P.Location_FSK as Location_FSK,
P.Product_FSK as Product_FSK,
P.Price as Price,
AVG(convert(decimal(12,9),P.Price)) OVER (Partition by P.Date_FSK,Location_FSK,Product_FSK) as AvgPrice
INTO FactTable1
FROM [dbo].[PreFact] P; 

/*** Drop the original Price column and keep the average price ***/
ALTER TABLE [dbo].[FactTable1] DROP Column Price;
SELECT distinct * INTO FactTable2 FROM FactTable1;
 

/*** Add new attributes to Location Dimension ***/
SELECT L.Location_SK, L.Location_PK, L.[Location Name], L.Country, C.[GDP(billion)], C.[Population],C.[Life-expectancy(years)], C.[Annual average income(USD)]  
INTO LocationDim2 FROM [dbo].[LocationDim] L
JOIN [dbo].[CountryData] C ON L.Country = C.Country;

/*** Add new attributes to Product Dimension ***/
SELECT P.Product_SK, P.Product_PK, P.[Product Name], D.Category, D.[Energy(100g)], D.[Carbohydrates(g)], D.[Fat(g)], D.[Protein(g)]
INTO ProductDim2 FROM [dbo].[ProductDim] P
JOIN [dbo].[ProductData] D ON P.[Product Name] = D.[Product Name];
