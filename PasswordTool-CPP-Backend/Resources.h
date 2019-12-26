#ifndef RESOURCES_H
#define RESOURCES_H

#include<iostream>
#include<vector>
#include<deque>
#include<string>
#include<unordered_map>
#include<unordered_set>
#include "FileHandler.h"

using namespace std;

class Resources
{
public:
	static unordered_set<string> namesList1;
	static unordered_set<string> dobsList1;
	static unordered_set<string> locationsList1;
	static unordered_set<string> commonsList1;


	static vector<string> mobilesList;//vector to store all mobile number lists
	static vector<string> namesList;//vecor to store all common name lists
	static vector<string> dobsList;//vector to store all DOB combinations
	static vector<string> locationsList;//vector to store all locations lists
	static vector<string> commonsList;//vector to store all commons lists
	static vector<string> rawDataList;//raw data readed from Input files
	static vector<string> results;//vector to store results on different level of program
	struct patternStructure {
		//structure to store analyzed data
		string key;
		string value;
		int len = -1;
		int loc = -1;
	};
	struct typesOfPatternsStruct {
		//structure to store type of pattern and its data
		string address;
		deque<string> data;
		long long int popularity;
	};
	static unordered_map<string, typesOfPatternsStruct> typesOfPatternsMap;

	/*
		Here we read all resouces files which includes common names, DOB,
		  location names, common english words.
		Every list is stored in respective vector.
	*/
	static void read_resources();

	/*
		This function will read small set of raw data to process it
	*/
	static void read_raw_data_list(string path);
};

#endif // !RESOURCES_H

