  UPDATE DateDim set Day_of_Week='Monday' Where Date_SK=218

  alter table DateDim drop column Week_in_Year;

ALTER TABLE DateDim ADD Day_of_Week VARCHAR(20) NULL ;