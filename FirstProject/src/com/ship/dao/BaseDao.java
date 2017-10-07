package com.ship.dao;

//import java.util.List;

import com.ship.dao.exceptions.DaoException;

public interface BaseDao {
	
	public <T> T selectById(int id) throws DaoException;
	//public <T> List<T> selectAll() throws DaoException;
	//public <T> T selectByName(String name) throws DaoException; 
	
	public <T> void insert(T newEntity) throws DaoException;
	//public <T> boolean update(T currentEntity) throws DaoException;
	
	//public <T> T deleteById(int id)throws DaoException;
	
}
