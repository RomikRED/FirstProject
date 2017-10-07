package com.ship.entity;

public class ShipCategory {
	private int id;
	private String type;
	private int numGuns;
	private double caliber;
	private int tonnage;
	
	public ShipCategory(){
	}
	
	public ShipCategory(int id) {
		this.id=id;
	}
	
	public ShipCategory(String type, int numGuns, double caliber, int tonnage) {
		this.type = type;
		this.numGuns = numGuns;
		this.caliber = caliber;
		this.tonnage = tonnage;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getNumGuns() {
		return numGuns;
	}

	public void setNumGuns(int numGuns) {
		this.numGuns = numGuns;
	}

	public double getCaliber() {
		return caliber;
	}

	public void setCaliber(double caliber) {
		this.caliber = caliber;
	}

	public int getTonnage() {
		return tonnage;
	}

	public void setTonnage(int tonnage) {
		this.tonnage = tonnage;
	}

	public int getId() {
		return id;
	}
}