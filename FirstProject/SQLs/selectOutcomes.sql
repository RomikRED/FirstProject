SELECT outcomes.id, outcomes.result, outcomes.shipId, outcomes.battleId, 
	battles.name, battles.date,
    ships.id, ships.name
	FROM ships, 
    outcomes JOIN battles
    ON outcomes.battleId=battles.id
	WHERE outcomes.shipId=ships.id

    
 