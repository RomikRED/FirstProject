package com.ship.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;

import com.ship.dao.exceptions.DaoSystemException;
import com.ship.dao.jdbc.JdbcUtils;
import com.ship.entity.Country;

public class CountryDao {
	private final String SELECT_BY_ID_SQL = "SELECT countries.id, countries.name, countries.agressor "
			+ "FROM countries WHERE countries.id= ";
	private final String SELECT_ALL_SQL = "SELECT countries.id, countries.name, countries.agressor FROM countries ORDER BY countries.name ";
	private final String INSERT_COUNTRY_SQL = "INSERT INTO ships.countries (name, agressor) VALUES (?, ?)";
	private final String UPDATE_COUNTRY_SQL = "UPDATE ships.countries SET countries.name=?, countries.agressor=? WHERE countries.id=?";
	private final String REMOVE_COUNTRY_SQL ="DELETE FROM ships.countries WHERE id=?";
	
	public Country selectById(int id) throws DaoSystemException {
		Connection conn = JdbcUtils.getConnection();
		Statement stmt = null;
		ResultSet rs = null;

		Country country = new Country();

		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(SELECT_BY_ID_SQL+id);
			while (rs.next()) {
				int countryId = rs.getInt("countries.id");
				String name = rs.getString("countries.name");
				boolean isAgressor = rs.getBoolean("countries.agressor");

				country = new Country(countryId);
				country.setName(name);
				country.setAgressor(isAgressor);
			}
			conn.commit();

			return country;

		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute SQL = '" + SELECT_BY_ID_SQL+id + "'", ex);
		} finally {
			JdbcUtils.closeQuietly(stmt);
			JdbcUtils.closeQuietly(rs);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
	public List<Country> selectAll() throws DaoSystemException {
		Connection conn = JdbcUtils.getConnection();
		Statement stmt = null;
		ResultSet rs = null;

		List<Country> countries = new LinkedList<>();

		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(SELECT_ALL_SQL);
			while (rs.next()) {
				int countryId = rs.getInt("countries.id");
				String name = rs.getString("countries.name");
				boolean isAgressor = rs.getBoolean("countries.agressor");
				Country country = new Country(countryId);
				country.setName(name);
				country.setAgressor(isAgressor);
				
				countries.add(country);
			}
			conn.commit();

			return countries;

		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute SELECT_ALL_SQL in CountryDAO ", ex);
		} finally {
			JdbcUtils.closeQuietly(stmt);
			JdbcUtils.closeQuietly(rs);
			JdbcUtils.closeQuietly(conn);
		}
	}
	

	public int[] updateCountries(List<Country> updatedCountries, List<Country> insertedCountries, List<Country> removedCountries) throws DaoSystemException{
		Connection conn = JdbcUtils.getConnection();
		PreparedStatement psUpdate = null;
		PreparedStatement psInsert = null;
		PreparedStatement psRemove = null;

		int[] changed = new int[3];
		
		try {
			if(updatedCountries.size()>0){
				psUpdate = conn.prepareStatement(UPDATE_COUNTRY_SQL);
				for (Country country : updatedCountries) {
					psUpdate.setString(1, country.getName());
					psUpdate.setInt(2, country.isAgressor()?1:0);
					psUpdate.setInt(3, country.getId());
					psUpdate.addBatch();
				}
				changed[0]= psUpdate.executeBatch().length;
			}
			
			if(insertedCountries.size()>0){
				psInsert = conn.prepareStatement(INSERT_COUNTRY_SQL);
				for (Country country : insertedCountries) {
					psInsert.setString(1, country.getName());
					psInsert.setInt(2, country.isAgressor()?1:0);
					psInsert.addBatch();
				}
				changed[1] = psInsert.executeBatch().length;
			}
			
			if(removedCountries.size()>0){
				psRemove = conn.prepareStatement(REMOVE_COUNTRY_SQL);
				for (Country country : removedCountries) {
					psRemove.setInt(1, country.getId());
					psRemove.addBatch();
				}
				changed[2] = psRemove.executeBatch().length;
			}
			
			conn.commit();
			return changed;
		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute UPDATE country in CountryDAO ", ex);
		} finally {
			JdbcUtils.closeQuietly(psRemove);
			JdbcUtils.closeQuietly(psInsert);
			JdbcUtils.closeQuietly(psUpdate);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
}
