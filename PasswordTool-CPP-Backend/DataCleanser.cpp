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