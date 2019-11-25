#include "Resources.h"


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
	Resources::namesList.reserve(187706);
	FileHandler::read_file(Resources::namesList, "data/datafiles/names.txt");
	//reading possible DOB combinations datalist
	Resources::dobsList.reserve(287281);
	FileHandler::read_file(Resources::dobsList, "data/datafiles/dobs.txt");
	//reading common locations datalist
	Resources::locationsList.reserve(39202);
	FileHandler::read_file(Resources::locationsList, "data/datafiles/locations.txt");
	//reading common words datalist
	Resources::commonsList.reserve(369646);
	FileHandler::read_file(Resources::commonsList, "data/datafiles/Commons.txt");
}

void Resources::read_raw_data_list(string path) {
	/*
		This function will read small set of raw data to process it
	*/
	Resources::rawDataList.reserve(100000);
	FileHandler::read_file(Resources::rawDataList, path);
}