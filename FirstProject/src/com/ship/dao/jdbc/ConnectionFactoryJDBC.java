package com.ship.dao.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionFactoryJDBC implements ConnectionFactory {
	
	private static final String DB_DRIVER = "com.mysql.jdbc.Driver";
	private static final String JDBC_URL = "jdbc:mysql://127.0.0.1/ships?autoReconnect=true&useSSL=false";
	private static final String LOGIN = "user";
	private static final String PASSWORD = "password";

	static {
        try {
            Class.forName(DB_DRIVER);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
	
	@Override
	public Connection getConnection() throws SQLException {
		return DriverManager.getConnection(JDBC_URL, LOGIN, PASSWORD);
	}

	public void close() throws SQLException {
		//NOP
	}

}
