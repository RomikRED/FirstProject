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
import com.ship.entity.Country;
import com.ship.entity.Ship;
import com.ship.entity.ShipCategory;

public class ShipDao {

	private final String INSERT_SHIP_SQL = " INSERT INTO ships.ships (ships.name, ships.categoryId, ships.launched, ships.countryId) VALUES (?, ?, ?, ?) ";
	private final String SELECT_ALL_SQL = " SELECT DISTINCT ships.id, ships.name, ships.categoryId, shipcategories.type, ships.launched, ships.countryId "+ 
			" FROM ships JOIN shipcategories  ON shipcategories.id=ships.categoryId ";
	private final String SELECT_BY_ID_SQL = " WHERE ships.id= ";
	private final String SELECT_BY_LAUNCHED_SQL = " WHERE ships.launched >= ? AND ships.launched <= ? ";
	private final String UPDATE_SHIP_SQL = "UPDATE ships.ships SET ships.name=?, ships.categoryId=?, ships.launched=?, ships.countryId=? "+
			" WHERE ships.id=? "; 
	private final String REMOVE_SHIP_SQL ="DELETE FROM ships.ships WHERE id=?";

	
	public Ship selectById(int id) throws DaoSystemException {
		Connection conn = JdbcUtils.getConnection();
		Statement stmt = null;
		ResultSet rs = null;

		Ship ship = new Ship();

		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(SELECT_ALL_SQL+SELECT_BY_ID_SQL+id);
			while (rs.next()) {
				ship = getShipFromResSet(rs);
			}
			conn.commit();

			return ship;

		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute SQL = '" + SELECT_BY_ID_SQL+id + "'", ex);
		} finally {
			JdbcUtils.closeQuietly(stmt);
			JdbcUtils.closeQuietly(rs);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
	public List<Ship> selectByLaunched(int yearFrom, int yearTo) throws DaoSystemException {
		Connection conn = JdbcUtils.getConnection();
		PreparedStatement ps = null;
		ResultSet rs = null;

		List<Ship> list = new LinkedList<Ship>();

		try {
			ps = conn.prepareStatement(SELECT_ALL_SQL+SELECT_BY_LAUNCHED_SQL);
			ps.setInt(1, yearFrom);
			ps.setInt(2, yearTo);
			rs = ps.executeQuery();
			while (rs.next()) {
				list.add(getShipFromResSet(rs));
			}
			conn.commit();

			return list;

		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute SQL = '" + SELECT_ALL_SQL+SELECT_BY_LAUNCHED_SQL + "'", ex);
		} finally {
			JdbcUtils.closeQuietly(ps);
			JdbcUtils.closeQuietly(rs);
			JdbcUtils.closeQuietly(conn);
		}
	}

	private Ship getShipFromResSet(ResultSet rs) throws SQLException, DaoSystemException{
		int shipId = rs.getInt("ships.id");
		int launched = rs.getInt("ships.launched");
		int countryId = rs.getInt("ships.countryId");
		int categoryId = rs.getInt("ships.categoryId");
		String name = rs.getString("ships.name");

		ShipCategory category = new ShipCategoryDao().selectById(categoryId);
		Country country = new CountryDao().selectById(countryId);
		
		Ship ship = new Ship(shipId);
		
		ship.setName(name);
		ship.setLaunched(launched);
		ship.setCategoryId(categoryId);
		ship.setCategory(category);
		ship.setCountryId(countryId);
		ship.setCountry(country);
		
		return ship;
	}
	
	public int[] updateShips(List<Ship> updatedShips, List<Ship> insertedShips, List<Ship> removedShips) throws DaoSystemException{
		Connection conn = JdbcUtils.getConnection();
		PreparedStatement psUpdate = null;
		PreparedStatement psInsert = null;
		PreparedStatement psRemove = null;

		int[] changed = new int[3];
		
		try {
			if(updatedShips.size()>0){
				psUpdate = conn.prepareStatement(UPDATE_SHIP_SQL);
				for (Ship ship : updatedShips) {
					psUpdate.setString(1, ship.getName());
					psUpdate.setInt(2, ship.getCategoryId());
					psUpdate.setInt(3, ship.getLaunched());
					psUpdate.setInt(4, ship.getCountryId());
					psUpdate.setInt(5, ship.getId());
					psUpdate.addBatch();
				}
				changed[0]= psUpdate.executeBatch().length;
			}
			
			if(insertedShips.size()>0){
				psInsert = conn.prepareStatement(INSERT_SHIP_SQL);
				for (Ship ship : insertedShips) {
					psInsert.setString(1, ship.getName());
					psInsert.setInt(2, ship.getCategoryId());
					psInsert.setInt(3, ship.getLaunched());
					psInsert.setInt(4, ship.getCountryId());
					psInsert.addBatch();
				}
				changed[1] = psInsert.executeBatch().length;
			}
			
			if(removedShips.size()>0){
				psRemove = conn.prepareStatement(REMOVE_SHIP_SQL);
				for (Ship ship : removedShips) {
					psRemove.setInt(1, ship.getId());
					psRemove.addBatch();
				}
				changed[2] = psRemove.executeBatch().length;
			}
			
			conn.commit();
			return changed;
		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute UPDATE ships in ShipDAO ", ex);
		} finally {
			JdbcUtils.closeQuietly(psRemove);
			JdbcUtils.closeQuietly(psInsert);
			JdbcUtils.closeQuietly(psUpdate);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
	public int removeShips(List<Ship> removedShips) throws DaoSystemException{
	Connection conn = JdbcUtils.getConnection();
	PreparedStatement psRemove = null;
	int changed=0;
	
	try {
		if(removedShips.size()>0){
			psRemove = conn.prepareStatement(REMOVE_SHIP_SQL);
			for (Ship ship : removedShips) {
				psRemove.setInt(1, ship.getId());
				psRemove.addBatch();
			}
			changed = psRemove.executeBatch().length;
		}
		conn.commit();
		return changed;
	} catch (SQLException ex) {
		JdbcUtils.rollbackQuietly(conn);
		throw new DaoSystemException("Can't execute REMOVE_SHIP_SQL from ShipDAO ", ex);
	} finally {
		JdbcUtils.closeQuietly(psRemove);
		JdbcUtils.closeQuietly(conn);
	}
}
	
	public int updateListShips(List<Ship> updatedShips) throws DaoSystemException{
		Connection conn = JdbcUtils.getConnection();
		PreparedStatement psUpdate = null;
		int changed=0;
		
		try {
			if(updatedShips.size()>0){
				psUpdate = conn.prepareStatement(UPDATE_SHIP_SQL);
				for (Ship ship : updatedShips) {
					psUpdate.setString(1, ship.getName());
					psUpdate.setInt(2, ship.getCategoryId());
					psUpdate.setInt(3, ship.getLaunched());
					psUpdate.setInt(4, ship.getCountryId());
					psUpdate.setInt(5, ship.getId());
					psUpdate.addBatch();
				}
				changed += psUpdate.executeBatch().length;
			}
			conn.commit();
			return changed;
		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute SQL UPDATE_SHIP_SQL or INSERT_SHIP_SQL from ShipDAO ", ex);
		} finally {
			JdbcUtils.closeQuietly(psUpdate);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
	public int insertShips(List<Ship> insertedShips) throws DaoSystemException{
		Connection conn = JdbcUtils.getConnection();
		PreparedStatement psInsert = null;
		int changed=0;
		
		try {
			if(insertedShips.size()>0){
				psInsert = conn.prepareStatement(INSERT_SHIP_SQL);
				for (Ship ship : insertedShips) {
					psInsert.setString(1, ship.getName());
					psInsert.setInt(2, ship.getCategoryId());
					psInsert.setInt(3, ship.getLaunched());
					psInsert.setInt(4, ship.getCountryId());
					psInsert.addBatch();
				}
				changed = psInsert.executeBatch().length;
			}
			conn.commit();
			return changed;
		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute SQL UPDATE_SHIP_SQL or INSERT_SHIP_SQL from ShipDAO ", ex);
		} finally {
			JdbcUtils.closeQuietly(psInsert);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
}
