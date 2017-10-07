package com.ship;

import java.sql.SQLException;

public class Main {

	public static void main(String[] args) {

		try {
//			throw new SQLException("It's SQL");
			throw new Exception("It's EX");
		} catch (SQLException sqlex) {
			System.out.println(sqlex.getMessage());
		} catch (Exception ex) {
			System.out.println(ex.getMessage());
		} finally {
			System.out.println("FINALLY!!");
		}

	}

}
