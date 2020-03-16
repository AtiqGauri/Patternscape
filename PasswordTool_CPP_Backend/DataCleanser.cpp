#include "DataCleanser.h"

void DataCleanser::delimiter_remover(vector<string>& rawVector, string delimiter) {
	/*
		takes 2 parameter 1. vector of strings, 2. string(delimiter)
		remove delimiter from all the strings of vector
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
		Takes a vector of strings and lower case all the strings present in it.
	*/
	for (auto it = rawDataVector.begin(); it != rawDataVector.end(); it++) {
		transform(it->begin(), it->end(), it->begin(), ::tolower);
	}

}


void DataCleanser::all_sub_strings(vector<string>& subStrings, string mainString) {
	subStrings.clear();
	int len = mainString.length();
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