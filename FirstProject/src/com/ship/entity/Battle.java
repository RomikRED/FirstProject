package com.ship.entity;

//import com.ship.utils.Utils;

public class Battle {

	private int id;
	private String name;
	private String date; 
	

	public Battle(){
		
	}
	
	public Battle(int id) {
		this.id=id;
	}
	
	public Battle(String name) {
		this.name = name;
//		this.date = Utils.getDateNow();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public int getId() {
		return id;
	}
	
}
