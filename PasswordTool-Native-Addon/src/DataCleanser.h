#ifndef DATACLEANSER_H
#define DATACLEANSER_H

#include<iostream>
#include<vector>
#include<algorithm>

using namespace std;

class DataCleanser
{
public:
	/*
		takes 2 parameter 1. vector of strings, 2. string(delimiter)
		remove delimiter from all the strings of vector
	*/
	static void delimiter_remover(vector<string>& rawVector, string delimiter);

	/*
		Takes a vector of strings and lower case all the strings present in it.
	*/
	static void lower_case(vector<string>& rawDataVector);

	void all_sub_strings(vector<string>& subStrings, string mainString);

	bool is_digit(char something);
};

#endif // !DATACLEANSER_H
