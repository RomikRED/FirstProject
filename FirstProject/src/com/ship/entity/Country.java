package com.ship.entity;

public class Country {
	private int id;
	private String name;
	private boolean agressor;
	
	public Country() {

	}

	public Country(int id) {
		this.id = id;
	}

	public Country(String name, boolean agressor) {
		this.name = name;
		this.agressor = agressor;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isAgressor() {
		return agressor;
	}

	public void setAgressor(boolean agressor) {
		this.agressor = agressor;
	}

	public int getId() {
		return id;
	}

	@Override
	public String toString() {
		return "Country [id=" + id + ", name=" + name + ", isAgressor=" + agressor + "]";
	}
	
	
	
	
}
