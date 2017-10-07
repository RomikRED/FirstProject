package com.ship.utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.TimeZone;

public class Utils {

	public static String getDateNow() {
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		TimeZone kiev = TimeZone.getTimeZone("Europe/Kiev");
		dateFormat.setTimeZone(kiev);
		java.util.Date date = new java.util.Date();
		long time = 0;
		time = date.getTime();
		return dateFormat.format(time);
	}
	
//	public static String getDate(String date){
//		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		TimeZone kiev = TimeZone.getTimeZone("Europe/Kiev");
//		dateFormat.setTimeZone(kiev);
//		
//		Date parsedDate = null;
//		try {
//			parsedDate = dateFormat.parse(date);
//		} catch (ParseException e) {
//			e.printStackTrace();
//		}
//		return dateFormat.format(parsedDate);
//	}
}
