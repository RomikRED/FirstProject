package com.ship.dao.jdbc.tx;

import java.sql.Connection;
import java.util.concurrent.Callable;

import com.ship.dao.jdbc.JdbcUtils;

public class TxWorker implements TransactionManager {
	private static ThreadLocal<Connection> connectionHolder = new ThreadLocal<Connection>();

	@Override
	public <T> T doInTransaction(Callable<T> unitOfWork) throws Exception {
		Connection connection = JdbcUtils.getConnection();
		connectionHolder.set(connection);
		try {
			T result = unitOfWork.call();
			connection.commit();
			return result;
		} catch (Exception e) {
			JdbcUtils.rollbackQuietly(connection);
			throw e;
		} finally {
			JdbcUtils.closeQuietly(connection);
			connectionHolder.remove();
		}
	}

	public static Connection getConnection() {
		return connectionHolder.get();
	}
}
