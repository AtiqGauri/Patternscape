#include "Resources.h"
#include "Constants.h"

unordered_set<string> Resources::namesList1;
unordered_set<string> Resources::dobsList1;
unordered_set<string> Resources::locationsList1;
unordered_set<string> Resources::commonsList1;


//Static Variable Initialization
vector<string> Resources::mobilesList;//vector to store all mobile number lists
vector<string> Resources::namesList;//vecor to store all common name lists
vector<string> Resources::dobsList;//vector to store all DOB combinations
vector<string> Resources::locationsList;//vector to store all locations lists
vector<string> Resources::commonsList;//vector to store all commons lists
vector<string> Resources::rawDataList;//raw data readed from Input files
vector<string> Resources::results;//vector to store raw results of analysing process
unordered_map<string, Resources::typesOfPatternsStruct> Resources::typesOfPatternsMap;//Container to store pattern, address and data deque


void Resources::read_resources() {
	/*
		Here we read all resource files which includes common names, DOB,
		  location names, common english words.
		Every list is stored in respective vector.
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
		This function will read small set of raw data to process it
	*/
	Resources::rawDataList.reserve(Constants::resizedFileSize);
	FileHandler::read_file(Resources::rawDataList, path);
}