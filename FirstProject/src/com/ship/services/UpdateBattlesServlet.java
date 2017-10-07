package com.ship.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ship.dao.BattleDao;
import com.ship.dao.exceptions.DaoSystemException;
import com.ship.entity.Battle;

/**
 * Servlet implementation class UpdateBattlesServlet
 */
@WebServlet("/UpdateBattlesServlet")
public class UpdateBattlesServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UpdateBattlesServlet() {
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
		
		System.out.println("parameter listUpdate: "+ request.getParameter("listUpdate"));
		System.out.println("parameter listInsert: "+ request.getParameter("listInsert"));
		System.out.println("parameter listRemove: "+ request.getParameter("listRemove"));
		
		List<Battle> listUpdate = new Gson().fromJson(request.getParameter("listUpdate"), new TypeToken<ArrayList<Battle>>(){}.getType());
		System.out.println("listUpdate.size() "+listUpdate.size());
		
		List<Battle> listInsert = new Gson().fromJson(request.getParameter("listInsert"), new TypeToken<ArrayList<Battle>>(){}.getType());
		System.out.println("listInsert.size() "+listInsert.size());
		
		List<Battle> listRemove = new Gson().fromJson(request.getParameter("listRemove"), new TypeToken<ArrayList<Battle>>(){}.getType());
		System.out.println("listRemove.size() "+listRemove.size());
		
		String txtUpdate="";
		response.setContentType("text/plain");
		response.setCharacterEncoding("UTF-8");
		try { 
			int[] changed = new BattleDao().updateBattles(listUpdate, listInsert, listRemove);
			
			if(changed[0] > 0){
				txtUpdate = " <"+changed[0]+"> records has UPDated.";
			}
			if(changed[1] > 0){
				txtUpdate +=" <"+ changed[1] + "> records has INSerted!";
			}
			if(changed[2] > 0){
				txtUpdate +=" <"+ changed[2] + "> records has REMoved!";
			}
		} catch (DaoSystemException e) {
			String causeTxt=e.getCause().getMessage();
			txtUpdate = e.getMessage()+"<br>"+causeTxt;
			e.printStackTrace();
		}finally{
			response.getWriter().write(txtUpdate);
		}
	}

}
