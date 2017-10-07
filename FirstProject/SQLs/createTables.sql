 CREATE TABLE ships(
   id INT NOT NULL auto_increment,
   name VARCHAR (50) NOT NULL,
   category INT NOT NULL,
   launched smallint, 
   PRIMARY KEY (id)
);

 CREATE TABLE shipCategories(
	id INT NOT NULL auto_increment,
	type VARCHAR (2) NOT NULL,
	country VARCHAR(20) NOT NULL,  
    numGuns TINYINT,
    caliber real,
    tonnage INT,
	PRIMARY KEY (id)
);

CREATE TABLE battles(
	id INT NOT NULL auto_increment,
    name VARCHAR(20) NOT NULL,
    date  DATETIME NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE outcomes(
	id INT NOT NULL auto_increment,
    result VARCHAR(10) NOT NULL,
    ship INT NOT NULL,
    battle INT NOT NULL,
    PRIMARY KEY (id)
);
