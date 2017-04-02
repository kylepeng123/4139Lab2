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

/*** Take the average of prices ***/
ALTER TABLE [dbo].[DistincrData] ADD (SELECT AVG(convert(decimal(12,9),[dbo].[DistinctData].[Obs Price])) AS Price From [dbo].[DistinctData] group by [Location Code],[Obs Date (yyyy-MM-dd)],[Product Code]) AS Price

/*** Preload fact table ***/

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


/*** Calculate the average ***/
SELECT P.Date_FSK as Date_FSK, 
P.Location_FSK as Location_FSK,
P.Product_FSK as Product_FSK,
P.Price as Price,
AVG(P.Price) as AvgPrice OVER (Partition by P.Date_FSK,Location_FSK,Product_FSK)
INTO FactTable
FROM [dbo].[PreFact] P;





SELECT * FROM [dbo].[PreFact];













select distinct [Location Code] from [dataScience].[dbo].[DistinctData];
select distinct [Location Name] from [dataScience].[dbo].[DistinctData];
select distinct [Pref# Qty] from [dataScience].[dbo].[DistinctData];
select distinct [Outlet Code] from [dataScience].[dbo].[DistinctData];
select distinct [Currency] from [dataScience].[dbo].[DistinctData];
select distinct [Obs Date (yyyy-MM-dd)] from [dataScience].[dbo].[DistinctData];
select distinct [Product Code] from [dataScience].[dbo].[DistinctData];
select distinct [Product Name] from [dataScience].[dbo].[DistinctData];
select distinct [Outlet Type] from [dataScience].[dbo].[DistinctData];
select distinct [Obs# UoM Code] from [dataScience].[dbo].[DistinctData];
select distinct [Quantity] from [dataScience].[dbo].[DistinctData];
select distinct [Product Name],[Quantity] from [dataScience].[dbo].[DistinctData];
select distinct [Price Type Name] from [dataScience].[dbo].[DistinctData]; /** Regular price **/






select distinct * into DistinctTestData
  FROM [dataScience].[dbo].[NCDB_1999_to_2014]

select top 10000 * into DinstinctDataSampled From DistinctTestData
/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP 1000 *
  FROM [dataScience].[dbo].[DinstinctDataSampled]
alter table [dataScience].[dbo].DistinctDataSampled add Date_FK varchar(50) null go
alter table DistinctDataSampled add Time_FK varchar(50) null
alter table DistinctDataSampled add Collision_FK varchar(50) null
alter table DistinctDataSampled add Vehicle_FK varchar(50) null
alter table DistinctDataSampled add Passenger_FK varchar(50) null

use dataScience;
 go
alter table [dataScience].[dbo].[DinstinctDataSampled] add Date_FK varchar(50) null
alter table [dataScience].[dbo].[DinstinctDataSampled] add Time_FK varchar(50) null
alter table [dataScience].[dbo].[DinstinctDataSampled] add Collision_FK varchar(50) null
alter table [dataScience].[dbo].[DinstinctDataSampled] add Vehicle_FK varchar(50) null
alter table [dataScience].[dbo].[DinstinctDataSampled] add Passenger_FK varchar(50) null

update [dataScience].[dbo].[DinstinctDataSampled] set Date_FK = 'D' + C_YEAR + C_MNTH + C_WDAY
update [dataScience].[dbo].[DinstinctDataSampled] set Vehicle_FK = 'V' + V_ID + V_TYPE + V_YEAR
update [dataScience].[dbo].[DinstinctDataSampled] set Passenger_FK = 'P' + P_ID + P_SEX + P_AGE +
P_PSN + P_USER
update [dataScience].[dbo].[DinstinctDataSampled] set Time_FK = 'T' + C_HOUR
update [dataScience].[dbo].[DinstinctDataSampled] set Collision_FK = 'C' + C_CONF + C_RCFG + C_WTHR +
C_RSUR + C_RALN + C_TRAF

select distinct Date_FK as Date_PK, C_YEAR, C_MNTH, C_WDAY into PrimeDimDate
from  [dataScience].[dbo].[DinstinctDataSampled] 
select distinct Vehicle_FK as Vehicle_PK, V_ID, V_TYPE, V_YEAR into
PrimeDimVehicle from  [dataScience].[dbo].[DinstinctDataSampled] 
select distinct Passenger_FK as Passenger_PK, P_ID, P_SEX, P_AGE, P_PSN,
P_USER into PrimeDimPassenger from  [dataScience].[dbo].[DinstinctDataSampled] 
select distinct Time_FK as Time_PK, C_HOUR into PrimeDimTime from
 [dataScience].[dbo].[DinstinctDataSampled] 
select distinct Collision_FK as Collision_PK, C_CONF, C_RCFG, C_WTHR, C_RSUR,
C_RALN, C_TRAF into PrimeDimCollision from  [dataScience].[dbo].[DinstinctDataSampled] 

ALTER TABLE PrimeDimDate ADD Date_SK int IDENTITY(1,1) PRIMARY KEY NOT NULL
ALTER TABLE PrimeDimVehicle ADD Vehicle_SK int IDENTITY(1,1) PRIMARY KEY NOT
NULL
ALTER TABLE PrimeDimPassenger ADD Passenger_SK int IDENTITY(1,1) PRIMARY KEY
NOT NULL
ALTER TABLE PrimeDimTime ADD Time_SK int IDENTITY(1,1) PRIMARY KEY NOT NULL
ALTER TABLE PrimeDimCollision ADD Collision_SK int IDENTITY(1,1) PRIMARY KEY
NOT NULL

SELECT PrimeDimDate.Date_SK as Date_FSK, PrimeDimDate.Date_PK as Date_FPK,
DinstinctDataSampled.Vehicle_FK as Vehicle_FK,
DinstinctDataSampled.Passenger_FK as Passenger_FK,
DinstinctDataSampled.Time_FK as Time_FK,
DinstinctDataSampled.Collision_FK as Collision_FK,
DinstinctDataSampled.C_SEV, DinstinctDataSampled.C_VEHS,
DinstinctDataSampled.P_ISEV, DinstinctDataSampled.P_SAFE
INTO PreFact1Date
FROM PrimeDimDate JOIN DinstinctDataSampled ON PrimeDimDate.Date_PK =
DinstinctDataSampled.Date_FK