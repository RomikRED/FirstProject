select outcomes.result, 
		battles.name,
        ships.name,
        shipcategories.type,
        countries.name as 'Country',
        countries.agressor as 'isAgressor'

	from outcomes join battles
		on outcomes.battleId=battles.id
	join ships
		on ships.id=outcomes.shipId
	join shipcategories
		on shipcategories.id=ships.categoryId
	join countries
		on countries.id=shipcategories.countryId