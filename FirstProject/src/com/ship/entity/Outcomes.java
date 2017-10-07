package com.ship.entity;

public class Outcomes {

	private int id;
	
	private int shipId;
	private Ship ship;
	
	private int battleId;
	private Battle battle;
	
	private String result;

	public Outcomes(int id) {
		this.id = id;
	}

	public Outcomes(Ship ship, Battle battle) {
		this.ship = ship;
		this.battle = battle;
	}

	public int getId() {
		return id;
	}

	public Ship getShip() {
		return ship;
	}

	public void setShip(Ship ship) {
		this.ship = ship;
	}

	public Battle getBattle() {
		return battle;
	}

	public void setBattle(Battle battle) {
		this.battle = battle;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public int getShipId() {
		return shipId;
	}

	public void setShipId(int shipId) {
		this.shipId = shipId;
	}

	public int getBattleId() {
		return battleId;
	}

	public void setBattleId(int battleId) {
		this.battleId = battleId;
	}

	@Override
	public String toString() {
		return "Outcomes [ Outcome id= " + id + ", shipId" + shipId+ ", battleId" +battleId+ ", result "+ result+ " ]";
	}
}
