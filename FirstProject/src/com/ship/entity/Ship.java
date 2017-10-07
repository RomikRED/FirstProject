package com.ship.entity;

public class Ship {
	private int id;
	private String name;
	private int categoryId;
	private ShipCategory category;
	private int countryId;
	private Country country;
	private int  launched;
	
	public Ship(){
	}
	
	public Ship(int id) {
		this.id = id;
	}
		
	public Ship(String name, ShipCategory category, int launched) {
		this.name = name;
		this.category = category;
		this.launched = launched;
	}
//	public Ship(String name, int launched) {
//		this.name = name;
//		this.category = null;
//		this.launched = launched;
//	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ShipCategory getCategory() {
		return category;
	}

	public void setCategory(ShipCategory category) {
		this.category = category;
	}
	
	public int getLaunched() {
		return launched;
	}

	public void setLaunched(int launched) {
		this.launched = launched;
	}

	public int getId() {
		return id;
	}

	public int getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}

	public Country getCountry() {
		return country;
	}

	public void setCountry(Country country) {
		this.country = country;
	}

	public int getCountryId() {
		return countryId;
	}

	public void setCountryId(int countryId) {
		this.countryId = countryId;
	}
	
	@Override
	public String toString() {
//		return "Ship [ id= " + id + ", name= " + name + ", category= " + category.getType() + ", launched= " + launched + " ]";
		return "Ship id=" + id + ", name= " + name + ", launched= " + launched + ", category= " + categoryId + ", country= " + countryId;
	}
}
