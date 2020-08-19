#include "Resources.h"
#include "Constants.h"

unordered_set<string> Resources::namesList1;
unordered_set<string> Resources::dobsList1;
unordered_set<string> Resources::locationsList1;
unordered_set<string> Resources::commonsList1;


//STATIC VARIABLE INITIALIZATION
vector<string> Resources::mobilesList;//VECTOR TO STORE ALL MOBILE NUMBER LISTS
vector<string> Resources::namesList;//VECTOR TO STORE ALL COMMON NAME LISTS
vector<string> Resources::dobsList;//VECTOR TO STORE ALL DOB COMBINATIONS
vector<string> Resources::locationsList;//VECTOR TO STORE ALL LOCATIONS LISTS
vector<string> Resources::commonsList;//VECTOR TO STORE ALL COMMONS LISTS
vector<string> Resources::rawDataList;//RAW DATA READ FROM INPUT FILES
vector<string> Resources::results;//VECTOR TO STORE RAW RESULTS OF ANALYSING PROCESS
mutex Resources::resultsMutex;//MUTEXT TO LOCK THREAD WHILE INSERTING RESULTS 
unordered_map<string, Resources::typesOfPatternsStruct> Resources::typesOfPatternsMap;//CONTAINER TO STORE PATTERN, ADDRESS AND DATA DEQUE


void Resources::read_resources() {
	/*
		HERE WE READ ALL RESOURCE FILES WHICH INCLUDES COMMON NAMES, DOB,
		  LOCATION NAMES, COMMON ENGLISH WORDS.
		EVERY LIST IS STORED IN RESPECTIVE VECTOR.
	*/
	//reading common name datalist
	Resources::namesList1.reserve(Constants::nameListFileSize);
	FileHandler::read_file(Resources::namesList1, Constants::nameListFileAddress);
	//reading possible DOB combinations datalist
	Resources::dobsList1.reserve(Constants::dobListFileSize);
	FileHandler::read_file(Resources::dobsList1, Constants::dobListFileAddress);
	//reading common locations datalist
	Resources::locationsList1.reserve(Constants::locationListFileSize);
	FileHandler::read_file(Resources::locationsList1, Constants::locationListFileAddress);
	//reading common words datalist
	Resources::commonsList1.reserve(Constants::commonListFileSize);
	FileHandler::read_file(Resources::commonsList1, Constants::commonListFileAddress);


	//reading common name datalist
	Resources::namesList.reserve(Constants::nameListFileSize);
	FileHandler::read_file(Resources::namesList, Constants::nameListFileAddress);
	//reading possible DOB combinations datalist
	Resources::dobsList.reserve(Constants::dobListFileSize);
	FileHandler::read_file(Resources::dobsList, Constants::dobListFileAddress);
	//reading common locations datalist
	Resources::locationsList.reserve(Constants::locationListFileSize);
	FileHandler::read_file(Resources::locationsList, Constants::locationListFileAddress);
	//reading common words datalist
	Resources::commonsList.reserve(Constants::commonListFileSize);
	FileHandler::read_file(Resources::commonsList, Constants::commonListFileAddress);
}

void Resources::read_raw_data_list(string path) {
	/*
		THIS FUNCTION WILL READ SMALL SET OF RAW DATA TO PROCESS IT
	*/
	Resources::rawDataList.reserve(Constants::resizedFileSize);
	FileHandler::read_file(Resources::rawDataList, path);
}