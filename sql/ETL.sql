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
