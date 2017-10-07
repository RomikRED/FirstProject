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
import com.ship.entity.Battle;

public class BattleDao {

	private final String INSERT_BATTLE_SQL = "INSERT INTO ships.battles (name, date) VALUES (?, ?)";
	private final String SELECT_BY_ID_SQL = "SELECT id, name, date FROM battles WHERE id=";
	private final String SELECT_ALL_SQL = "SELECT id, name, date FROM battles";
	private final String UPDATE_BATTLE_SQL = "UPDATE ships.battles SET battles.name=?, battles.date=? WHERE battles.id=?";
	private final String REMOVE_BATTLE_SQL ="DELETE FROM ships.battles WHERE id=?";

	public Battle selectById(int id) throws DaoSystemException {

		Connection conn = JdbcUtils.getConnection();
		Statement stmt = null;
		ResultSet rs = null;

		Battle result = new Battle();

		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(SELECT_BY_ID_SQL + id);
			while (rs.next()) {
				int battleId = rs.getInt("id");
				String name = rs.getString("name");
				String date = rs.getString("date");
				result = new Battle(battleId);
				result.setName(name);
				result.setDate(date);
			}
			conn.commit();

			return result;

		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute SQL = '" + SELECT_BY_ID_SQL + "'", ex);
		} finally {
			JdbcUtils.closeQuietly(stmt);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
	public List<Battle> selectAll() throws DaoSystemException {

		Connection conn = JdbcUtils.getConnection();
		PreparedStatement ps = null;
		ResultSet rs = null;

		List<Battle> list = new LinkedList<Battle>();

		try {
			ps = conn.prepareStatement(SELECT_ALL_SQL);
			rs = ps.executeQuery();
			while (rs.next()) {
				int battleId = rs.getInt("battles.id");
				String name = rs.getString("battles.name");
				String date = rs.getString("battles.date");
				
				Battle currentBattle = new Battle(battleId);
				currentBattle.setName(name);
				currentBattle.setDate(date);
				list.add(currentBattle);
			}
			conn.commit();

			return list;

		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute SQL = '" + SELECT_ALL_SQL + "'", ex);
		} finally {
			JdbcUtils.closeQuietly(ps);
			JdbcUtils.closeQuietly(rs);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
	public int[] updateBattles(List<Battle> updatedBattles, List<Battle> insertedBattles, List<Battle> removedBattles) throws DaoSystemException{
		Connection conn = JdbcUtils.getConnection();
		PreparedStatement psUpdate = null;
		PreparedStatement psInsert = null;
		PreparedStatement psRemove = null;

		int[] changed = new int[3];
		
		try {
			if(updatedBattles.size()>0){
				psUpdate = conn.prepareStatement(UPDATE_BATTLE_SQL);
				for (Battle battle : updatedBattles) {
					psUpdate.setString(1, battle.getName());
					psUpdate.setString(2, battle.getDate());
					psUpdate.setInt(3, battle.getId());
					psUpdate.addBatch();
				}
				changed[0]= psUpdate.executeBatch().length;
			}
			
			if(insertedBattles.size()>0){
				psInsert = conn.prepareStatement(INSERT_BATTLE_SQL);
				for (Battle battle : insertedBattles) {
					psInsert.setString(1, battle.getName());
					psInsert.setString(2, battle.getDate());
					psInsert.addBatch();
				}
				changed[1] = psInsert.executeBatch().length;
			}
			
			if(removedBattles.size()>0){
				psRemove = conn.prepareStatement(REMOVE_BATTLE_SQL);
				for (Battle battle : removedBattles) {
					psRemove.setInt(1, battle.getId());
					psRemove.addBatch();
				}
				changed[2] = psRemove.executeBatch().length;
			}
			
			conn.commit();
			return changed;
		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute UPDATE battles in BattleDAO ", ex);
		} finally {
			JdbcUtils.closeQuietly(psRemove);
			JdbcUtils.closeQuietly(psInsert);
			JdbcUtils.closeQuietly(psUpdate);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
	
}
