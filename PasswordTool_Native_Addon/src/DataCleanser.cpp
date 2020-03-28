#include "DataCleanser.h"

/******************************************/
//			STATIC VARIBALES
/******************************************/
//STRUCT TO STORE localtime_s VARIBALES >>chrono<<
struct tm DataCleanser::dateTimeStruct;
//time_t VARIABPLE TO STORE LOCAL SYSTEM TIME
time_t DataCleanser::systemTimeContainer;



void DataCleanser::delimiter_remover(vector<string>& rawVector, string delimiter) {
	/*
		TAKES 2 PARAMETER 1. VECTOR OF STRINGS, 2. STRING(DELIMITER)
		REMOVE DELIMITER FROM ALL THE STRINGS OF VECTOR
	*/
	string rawString;
	size_t found;
	for (auto it = rawVector.begin(); it != rawVector.end(); it++) {
	again:
		found = it->find(delimiter);
		if (found != string::npos) {
			it->erase(found, 1);
			found = string::npos;
			goto again;
		}
	}
}

void DataCleanser::lower_case(vector<string>& rawDataVector) {
	/*
		TAKES A VECTOR OF STRINGS AND LOWER CASE ALL THE STRINGS PRESENT IN IT.
	*/
	for (auto it = rawDataVector.begin(); it != rawDataVector.end(); it++) {
		transform(it->begin(), it->end(), it->begin(), ::tolower);
	}

}

void DataCleanser::all_sub_strings(vector<string>& subStrings, string mainString) {
	subStrings.clear();
	size_t len = mainString.length();
	if (len < 3) {
		cout << mainString << " string length should not be smaller than 3" << endl;
		return;
	}
	else {
		for (int i = 0; i < len; i++) {
			for (int j = 3; j <= len - i; j++) {
				subStrings.push_back(mainString.substr(i, j));
			}
		}
	}
}

bool DataCleanser::is_digit(char something) {
	if (int(something) > 47 && int(something) < 58) {
		return true;
	}
	return false;
}