/*** Association analysis ***/

SELECT distinct L.[Location Name] As City, P.[Product Name] As Product_Name, D.Date, Avg(F.AvgPrice) As Price
INTO KenyaData
FROM [dbo].[FactTable2] F, [dbo].[LocationDim2] L, [dbo].[ProductDim2] P, [dbo].[DateDim] D
WHERE P.Product_SK = F.Product_FSK AND L.Location_SK = F.Location_FSK AND F.Date_FSK = D.Date_SK AND L.Country = 'Kenya'
GROUP BY GROUPING SETS ((P.[Product Name],L.[Location Name], D.Date))
ORDER BY L.[Location Name], P.[Product Name], D.Date;