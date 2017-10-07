package com.ship.dao.jdbc.tx;

import java.util.concurrent.Callable;

public interface TransactionManager {
    
    public <T> T doInTransaction(Callable<T> unitOfWork) 
            throws Exception;
}