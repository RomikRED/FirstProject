package com.ship.dao.jdbc;

import java.sql.Connection;
import java.sql.SQLException;

public interface ConnectionFactory {

    public Connection getConnection() throws SQLException;

    public void close() throws SQLException;

}
