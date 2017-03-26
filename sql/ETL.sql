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