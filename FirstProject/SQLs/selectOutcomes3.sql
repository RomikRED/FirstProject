 SELECT outcomes.id, outcomes.result, outcomes.shipId, outcomes.battleId, 
					battles.name, 
				    ships.name, ships.launched, 
                    shipcategories.type,
				    countries.name, countries.agressor
	FROM outcomes 
    JOIN battles 
		ON battles.id=outcomes.battleId
	JOIN ships
		ON ships.id=outcomes.shipId
	JOIN shipcategories
		ON shipcategories.id=ships.categoryId
	JOIN countries
		ON countries.id=ships.countryId