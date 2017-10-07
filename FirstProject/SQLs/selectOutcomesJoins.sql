SELECT ships.id as'ShipID', ships.name as 'Name Ship', ships.launched, 
	shipcategories.type, shipcategories.country, shipcategories.caliber,
    outcomes.result
    from ships 
		join shipcategories
			on shipcategories.id = ships.categoryId
		join outcomes
			on outcomes.shipId = ships.id

    