#ifndef DATACLEANSER_H
#define DATACLEANSER_H

#include<iostream>
#include<vector>
#include<algorithm>
#include<chrono>
#include<ctime>

using namespace std;

class DataCleanser
{
public:
	/*
		TAKES 2 PARAMETER 1. VECTOR OF STRINGS, 2. STRING(DELIMITER)
		REMOVE DELIMITER FROM ALL THE STRINGS OF VECTOR
	*/
	static void delimiter_remover(vector<string>& rawVector, string delimiter);

	/*
		TAKES A VECTOR OF STRINGS AND LOWER CASE ALL THE STRINGS PRESENT IN IT.
	*/
	static void lower_case(vector<string>& rawDataVector);

	void all_sub_strings(vector<string>& subStrings, string mainString);

	bool is_digit(char something);

	//STRUCT TO STORE localtime_s VARIBALES >>chrono<<
	static struct tm dateTimeStruct;

	//time_t VARIABPLE TO STORE LOCAL SYSTEM TIME
	static time_t systemTimeContainer;
};

#endif // !DATACLEANSER_H
