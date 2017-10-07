package com.ship.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

import com.ship.dao.exceptions.DaoSystemException;
import com.ship.dao.jdbc.JdbcUtils;
import com.ship.entity.Battle;
import com.ship.entity.Outcomes;
import com.ship.entity.Ship;

public class OutcomesDao {
	
	private final String SELECT_OUTCOMES_WITH_SHIPS_TYPES_COUNTRIES_SIDES_SQL = 
			" SELECT outcomes.id, "+
					"	outcomes.result, "+
					"	outcomes.shipId, "+
					"	outcomes.battleId, "+
					"	battles.name, "+
				    "   ships.name, "+
				    "   ships.launched, "+
				    "   shipcategories.type, "+
				    "   countries.name, "+
				    "   countries.agressor "+
					" FROM outcomes join battles "+
					"	ON outcomes.battleId=battles.id "+
					" JOIN ships "+
					"	ON ships.id=outcomes.shipId "+
					" JOIN shipcategories "+
					"	ON shipcategories.id=ships.categoryId "+
					" JOIN countries "+
					"	ON countries.id=ships.countryId ";		
	private final String UPDATE_OUTCOME_SQL = "UPDATE ships.outcomes SET outcomes.shipId=?, outcomes.battleId=?, outcomes.result=? "+
			" WHERE outcomes.id=? "; 
	private final String REMOVE_OUTCOME_SQL ="DELETE FROM ships.outcomes WHERE id=?";
	private final String INSERT_OUTCOME_SQL = " INSERT INTO ships.outcomes (outcomes.shipId, outcomes.battleId, outcomes.result) VALUES (?, ?, ?) ";
	
	public List<Outcomes> selectWithShipsAndStatus() throws DaoSystemException {

		Connection conn = JdbcUtils.getConnection();
		PreparedStatement ps = null;
		ResultSet rs = null;

		List<Outcomes> list = new LinkedList<Outcomes>();

		try {
			ps = conn.prepareStatement(SELECT_OUTCOMES_WITH_SHIPS_TYPES_COUNTRIES_SIDES_SQL);
			rs = ps.executeQuery();
			while (rs.next()) {
				int id = rs.getInt("outcomes.id");
				String result = rs.getString("outcomes.result");
				Battle battle = new BattleDao().selectById(rs.getInt("outcomes.battleId"));
				Ship ship = new ShipDao().selectById(rs.getInt("outcomes.shipId"));

				Outcomes outcomes = new Outcomes(id);
				outcomes.setResult(result);
				outcomes.setBattle(battle);
				outcomes.setShip(ship);
				list.add(outcomes);
				System.out.println(outcomes);
			}
			conn.commit();

			return list;

		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute SQL = '" + SELECT_OUTCOMES_WITH_SHIPS_TYPES_COUNTRIES_SIDES_SQL + "'", ex);
		} finally {
			JdbcUtils.closeQuietly(ps);
			JdbcUtils.closeQuietly(rs);
			JdbcUtils.closeQuietly(conn);
		}
	}
	
	public int[] updateOutcomes(List<Outcomes> updatedOutcomes, List<Outcomes> insertedOutcomes, List<Outcomes> removedOutcomes) throws DaoSystemException{
		Connection conn = JdbcUtils.getConnection();
		PreparedStatement psUpdate = null;
		PreparedStatement psInsert = null;
		PreparedStatement psRemove = null;

		int[] changed = new int[3];
		
		try {
			if(updatedOutcomes.size()>0){
				psUpdate = conn.prepareStatement(UPDATE_OUTCOME_SQL);
				for (Outcomes outcome : updatedOutcomes) {
					psUpdate.setInt(1, outcome.getShipId());
					psUpdate.setInt(2, outcome.getBattleId());
					psUpdate.setString(3, outcome.getResult());
					psUpdate.setInt(4, outcome.getId());
					psUpdate.addBatch();
				}
				changed[0]= psUpdate.executeBatch().length;
			}
			
			if(insertedOutcomes.size()>0){
				psInsert = conn.prepareStatement(INSERT_OUTCOME_SQL);
				for (Outcomes outcome : insertedOutcomes) {
					psInsert.setInt(1, outcome.getShipId());
					psInsert.setInt(2, outcome.getBattleId());
					psInsert.setString(3, outcome.getResult());
					psInsert.addBatch();
				}
				changed[1] = psInsert.executeBatch().length;
			}
			
			if(removedOutcomes.size()>0){
				psRemove = conn.prepareStatement(REMOVE_OUTCOME_SQL);
				for (Outcomes outcome : removedOutcomes) {
					psRemove.setInt(1, outcome.getId());
					psRemove.addBatch();
				}
				changed[2] = psRemove.executeBatch().length;
			}
			
			conn.commit();
			return changed;
		} catch (SQLException ex) {
			JdbcUtils.rollbackQuietly(conn);
			throw new DaoSystemException("Can't execute UPDATE outcomes in OutcomesDAO ", ex);
		} finally {
			JdbcUtils.closeQuietly(psRemove);
			JdbcUtils.closeQuietly(psInsert);
			JdbcUtils.closeQuietly(psUpdate);
			JdbcUtils.closeQuietly(conn);
		}
	}

}
