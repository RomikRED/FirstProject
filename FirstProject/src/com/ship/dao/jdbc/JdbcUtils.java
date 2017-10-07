package com.ship.dao.jdbc;


import java.sql.*;
import com.ship.dao.exceptions.DaoSystemException;

public final class JdbcUtils {
	private final static ConnectionFactory factory = new ConnectionFactoryJDBC();
    
	private JdbcUtils() {
    }

    public static Connection getConnection() throws DaoSystemException {
		try {
			Connection result = factory.getConnection();
			result.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
			result.setAutoCommit(false);
			return result;
		} catch (SQLException e) {
			throw new DaoSystemException("Exception during 'factory.getConnection()', factory = " + factory, e);
		}

	}
    
//    public static void closeQuietly(ResultSet rs) {
//        if (rs != null) {
//            try {
//                rs.close();
//            } catch (SQLException e) {
//                // NOP
//            }
//        }
//    }
//
//    public static void closeQuietly(PreparedStatement ps) {
//        if (ps != null) {
//            try {
//                ps.close();
//            } catch (SQLException e) {
//                // NOP
//            }
//        }
//    }
//    
//    public static void closeQuietly(Statement stmt) {
//        if (stmt != null) {
//            try {
//                stmt.close();
//            } catch (SQLException e) {
//                // NOP
//            }
//        }
//    }
//
//    public static void closeQuietly(Connection conn) {
//        if (conn != null) {
//            try {
//                conn.close();
//            } catch (SQLException e) {
//                // NOP
//            }
//        }
//    }
    
    public static void closeQuietly(AutoCloseable autoclosable){
    	if (autoclosable!=null) {
    		 try {autoclosable.close();} 
    		 catch (Exception e) {/*NOP*/}
		}
    }

    public static void rollbackQuietly(Connection conn) {
        if (conn != null) {
            try {
                conn.rollback();
            } catch (SQLException e) {
                // NOP
            }
        }
    }
    
    
}

