package com.ship.dao.exceptions;

@SuppressWarnings("serial")
public class DaoException extends Exception {
	public DaoException(String message) {
		super(message);
	}

	public DaoException(String message, Throwable cause) {
		super(message, cause);
	}
}
