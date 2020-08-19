#ifndef RESOURCES_H
#define RESOURCES_H

#include<iostream>
#include<vector>
#include<deque>
#include<string>
#include<unordered_map>
#include<unordered_set>
#include<mutex>
#include "FileHandler.h"

using namespace std;

class Resources
{
public:
	static unordered_set<string> namesList1;
	static unordered_set<string> dobsList1;
	static unordered_set<string> locationsList1;
	static unordered_set<string> commonsList1;


	static vector<string> mobilesList;//VECTOR TO STORE ALL MOBILE NUMBER LISTS
	static vector<string> namesList;//VECTOR TO STORE ALL COMMON NAME LISTS
	static vector<string> dobsList;//VECTOR TO STORE ALL DOB COMBINATIONS
	static vector<string> locationsList;//VECTOR TO STORE ALL LOCATIONS LISTS
	static vector<string> commonsList;//VECTOR TO STORE ALL COMMONS LISTS
	static vector<string> rawDataList;//RAW DATA READ FROM INPUT FILES
	static vector<string> results;//VECTOR TO STORE RESULTS ON DIFFERENT LEVEL OF PROGRAM
	static mutex resultsMutex;//MUTEXT TO LOCK THREADS WHILE INSERTING RESULTS
	struct patternStructure {
		//STRUCTURE TO STORE ANALYZED DATA
		string key;
		string value;
		int len = -1;
		int loc = -1;
	};
	struct typesOfPatternsStruct {
		//STRUCTURE TO STORE TYPE OF PATTERN AND ITS DATA
		string address;
		deque<string> data;
		long long int popularity=0;
	};
	static unordered_map<string, typesOfPatternsStruct> typesOfPatternsMap;

	/*
		HERE WE READ ALL RESOURCES FILES WHICH INCLUDES COMMON NAMES, DOB,
		  LOCATION NAMES, COMMON ENGLISH WORDS.
		EVERY LIST IS STORED IN RESPECTIVE VECTOR.
	*/
	static void read_resources();

	/*
		THIS FUNCTION WILL READ SMALL SET OF RAW DATA TO PROCESS IT
	*/
	static void read_raw_data_list(string path);
};

#endif // !RESOURCES_H

