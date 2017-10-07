package com.ship.services;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.ship.dao.OutcomesDao;
import com.ship.dao.exceptions.DaoSystemException;
import com.ship.entity.Outcomes;

/**
 * Servlet implementation class ShowOutcomesServlset
 */
@WebServlet("/ShowOutcomesServlet")
public class ShowOutcomesServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ShowOutcomesServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/plain");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write("Your data succesfully received by GET.");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		List<Outcomes> outcomes = null;
		try {
			outcomes = new OutcomesDao().selectWithShipsAndStatus();
		} catch (DaoSystemException e) {
			e.printStackTrace();
		}
		
		String json = new Gson().toJson(outcomes);
		System.out.println(json);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);	
	}

}
