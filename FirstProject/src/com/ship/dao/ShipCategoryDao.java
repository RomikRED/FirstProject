package com.ship.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;
import java.sql.ResultSet;

import java.sql.SQLException;

import com.ship.dao.exceptions.DaoSystemException;
import com.ship.dao.jdbc.JdbcUtils;
import com.ship.entity.ShipCategory;

public class ShipCategoryDao {

	// private final String INSERT_SQL = "INSERT INTO shipsCategories (type,
	// country, numGuns, caliber, tonnage) VALUES (?, ?, ?, ?, ?)";
	private final String SELECT_BY_ID_SQL = "SELECT shipcategories.id, shipcategories.type, shipcategories.numGuns, "
			+ "shipcategories.caliber, shipcategories.tonnage FROM shipcategories WHERE id=";
	private final String SELECT_ALL_SQL = "SELECT shipcategories.id, shipcategories.type, shipcategories.numGuns, "
			+ "shipcategories.caliber, shipcategories.tonnage FROM shipcategories ORDER BY shipcategories.type ";
	private final String UPDATE_CATEGORY_SQL  = "UPDATE ships.shipcategories SET shipcategories.type=?, shipcategories.numGuns=?,"
			+"shipcategories.caliber=?, shipcategories.tonnage=? WHERE shipcategories.id=? ";
	private final String INSERT_CATEGORY_SQL = "INSERT INTO ships.shipcategories (shipcategories.type, shipcategories.numGuns, shipcategories.caliber, shipcategories.tonnage) " 
			+"VALUES (?, ?, ?, ?) ";
	private final String REMOVE_CATEGORY_SQL = "DELETE FROM ships.shipcategories WHERE id=?";
	
	public ShipCategory selectById(int id) throws DaoSystemException {
		Connection conn = JdbcUtils.getConnection();
		Statement stmt = null;
		ResultSet rs = null;
		ShipCategory result = new ShipCategory();

		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(SELECT_BY_ID_SQL + id);
			while (rs.next()) {
				int categoryId = rs.getInt("id");
				String type = rs.getString("type");
				int numGuns = rs.getInt("shipcategories.numGuns");
				int caliber = rs.getInt("shipcategories.caliber");
				int tonnage = rs.getInt("shipcategories.tonnage");
				result = new ShipCategory(categoryId);
				result.setType(type);
				result.setNumGuns(numGuns);
				result.setCaliber(caliber);
				result.setTonnage(tonnage);

			}
			conn.commit();

			return result;

		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute SQL = '" + SELECT_BY_ID_SQL+id + "'", ex);
		} finally {
			JdbcUtils.closeQuietly(stmt);
			JdbcUtils.closeQuietly(rs);
			JdbcUtils.closeQuietly(conn);
		}
	}

	public List<ShipCategory> selectAll() throws DaoSystemException {

		Connection conn = JdbcUtils.getConnection();
		Statement stmt = null;
		ResultSet rs = null;
		List<ShipCategory> categories = new LinkedList<ShipCategory>();

		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(SELECT_ALL_SQL);
			while (rs.next()) {
				int categoryId = rs.getInt("id");
				String type = rs.getString("type");
				int numGuns = rs.getInt("shipcategories.numGuns");
				int caliber = rs.getInt("shipcategories.caliber");
				int tonnage = rs.getInt("shipcategories.tonnage");
				
				ShipCategory category = new ShipCategory(categoryId);
				category.setType(type);
				category.setNumGuns(numGuns);
				category.setCaliber(caliber);
				category.setTonnage(tonnage);
				
				categories.add(category);
			}
			conn.commit();

			return categories;

		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute SELECT_ALL in ShipCategoryDao", ex);
		} finally {
			JdbcUtils.closeQuietly(stmt);
			JdbcUtils.closeQuietly(rs);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
	
	public int[] updateCategories(List<ShipCategory> updatedCategories, List<ShipCategory> insertedCategories, List<ShipCategory> removedCategories) throws DaoSystemException{
		Connection conn = JdbcUtils.getConnection();
		PreparedStatement psUpdate = null;
		PreparedStatement psInsert = null;
		PreparedStatement psRemove = null;

		int[] changed = new int[3];
		
		try {
			if(updatedCategories.size()>0){
				psUpdate = conn.prepareStatement(UPDATE_CATEGORY_SQL);
				for (ShipCategory category : updatedCategories) {
					psUpdate.setString(1, category.getType());
					psUpdate.setInt(2, category.getNumGuns());
					psUpdate.setDouble(3, category.getCaliber());
					psUpdate.setInt(4, category.getTonnage());
					psUpdate.setInt(5, category.getId());
					psUpdate.addBatch();
				}
				changed[0]= psUpdate.executeBatch().length;
			}
			
			if(insertedCategories.size()>0){
				psInsert = conn.prepareStatement(INSERT_CATEGORY_SQL);
				for (ShipCategory category : insertedCategories) {
					psInsert.setString(1, category.getType());
					psInsert.setInt(2, category.getNumGuns());
					psInsert.setDouble(3, category.getCaliber());
					psInsert.setInt(4, category.getTonnage());
					psInsert.addBatch();
				}
				changed[1] = psInsert.executeBatch().length;
			}
			
			if(removedCategories.size()>0){
				psRemove = conn.prepareStatement(REMOVE_CATEGORY_SQL);
				for (ShipCategory category : removedCategories) {
					psRemove.setInt(1, category.getId());
					psRemove.addBatch();
				}
				changed[2] = psRemove.executeBatch().length;
			}
			
			conn.commit();
			return changed;
		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute UPDATE categories in ShipCategoryDao ", ex);
		} finally {
			JdbcUtils.closeQuietly(psRemove);
			JdbcUtils.closeQuietly(psInsert);
			JdbcUtils.closeQuietly(psUpdate);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
	// public void insert(ShipCategory insertedCategory) throws
	// DaoSystemException {
	// Connection conn = JdbcUtils.getConnection();
	// PreparedStatement ps = null;
	// try {
	// ps = conn.prepareStatement(INSERT_SQL);
	// ps.setString (1, insertedCategory.getType());
	// ps.setString (2, insertedCategory.getCountry());
	// ps.setInt (3, insertedCategory.getNumGuns());
	// ps.setDouble (4, insertedCategory.getCaliber());
	// ps.setInt (5, insertedCategory.getTonnage());
	// ps.executeUpdate();
	// conn.commit();
	// } catch (SQLException ex) {
	// JdbcUtils.rollbackQuietly(conn);
	// throw new DaoSystemException("Can't execute SQL = '" + INSERT_SQL + "'",
	// ex);
	// } finally {
	// JdbcUtils.closeQuietly(ps);
	// JdbcUtils.closeQuietly(conn);
	// }
	// }
}
