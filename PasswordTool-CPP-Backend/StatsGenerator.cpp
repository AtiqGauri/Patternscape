#include "StatsGenerator.h"
#include"Resources.h"
#include"FileHandler.h"

using namespace std;

string StatsGenerator::split_filename(const string str)
{
	size_t found = str.find_last_of("/\\");
	if (found != string::npos) {
		return str.substr(found + 1);
	}
	else {
		return str;
	}
}

void StatsGenerator::load_stored_patterns(deque<string>& storedPatterns) {
	
	//itrate over all the file paths
	deque<string>::iterator it = storedPatterns.begin();

	
	Resources::typesOfPatternsStruct tempStruct;

	//shell deque to initialize map
	deque<string> fileContent;

	size_t foundAddress, foundPopularity;
	while (it != storedPatterns.end()) {

		foundAddress = it->find("<|>");
		if (foundAddress != string::npos) {

			foundPopularity = it->find("<|>", foundAddress + 3);

			tempStruct.address = it->substr(foundAddress +3 , foundPopularity - (foundAddress+3));
			tempStruct.data = fileContent;
			tempStruct.popularity = stoi(it->substr(foundPopularity + 3));
			Resources::typesOfPatternsMap.insert({ it->substr(0, foundAddress), tempStruct  });
		}

		it++;
	}
	//
	//Clear and shrink containers
	storedPatterns.clear(); storedPatterns.shrink_to_fit();
}

void StatsGenerator::patterns_classifier(string filePath) {

	//Deque and iterator for reading and itrating over file data
	deque<string> tempDeque;
	deque<string>::iterator dequeIt;
	
	//Map and iterator for temporary map operation and key search 
	deque<string> mapDeque;
	unordered_map<string, deque<string>>::iterator mapIt;
	
	//Temporary string for data manipulation (Can be rectified)
	string str1,str2;
	
	//Read file data into tempDeque to process
	FileHandler::read_file(tempDeque, filePath);

	dequeIt = tempDeque.begin();
	while (dequeIt != tempDeque.end()) {
		
		str1 = *dequeIt;
		
		//Find first delimiter/divider(<|>) in string which is a pattern for that string data
		size_t foundValue;
		foundValue = str1.find("<|>");
		if (foundValue != std::string::npos) {
			
			str2 = str1.substr(0, foundValue);
			mapIt = statsResults.find(str2);
			if (mapIt != statsResults.end())
			{
				//If pattern exist in current temporary map then we just add another
				//data string to its deque
				mapIt->second.push_back(str1.substr(foundValue + 3));
			}
			else
			{
				//Else we add data string to temporary deque and then, add pattern
				//and that deque as a new element in current temporary map
				mapDeque.push_back(str1.substr(foundValue + 3));
				statsResults.insert({ str2, mapDeque });
				mapDeque.clear();
			}
		}
		dequeIt++;
	}
	//Clear and shrink all the containers 
	tempDeque.clear(); tempDeque.shrink_to_fit();
	mapDeque.shrink_to_fit();

	//Store statsResult(temporary map) to main Resource class map
	store_classified_patterns();
}

void StatsGenerator::store_classified_patterns() {

	//Iterator for statsResult( temporary thread map ) 
	unordered_map<string, deque<string>>::iterator mapIt;
	
	//Iterator for Key search in main Resource class map
	unordered_map<string, Resources::typesOfPatternsStruct>::iterator keyIt;

	Resources::typesOfPatternsStruct tempStruct;

	//Mutex and lock to ensure one thread execution at a time
	mutex m;
	lock_guard<mutex> lockGuard(m);
	
	mapIt = statsResults.begin();
	while (mapIt != statsResults.end()) {

		//Search if this pattern already exist or added by another thread
		keyIt = Resources::typesOfPatternsMap.find(mapIt->first);
		
		if (keyIt != Resources::typesOfPatternsMap.end()) {
			
			//If pattern exists already then we add data deque to main map's struct deque
			keyIt->second.data.insert(keyIt->second.data.end(), mapIt->second.begin(), mapIt->second.end());
		}
		else {
			tempStruct.address = ""; tempStruct.data = mapIt->second; tempStruct.popularity = 0;
			//Else we add pattern and deque as a new element into main map
			Resources::typesOfPatternsMap.insert({ mapIt->first, tempStruct });
		}
		
		mapIt++;
	}
	
	//Clear and shrink all the containers
	for (mapIt = statsResults.begin(); mapIt != statsResults.end(); mapIt++) {
		mapIt->second.clear(); mapIt->second.shrink_to_fit();
	}
	statsResults.clear(); statsResults.rehash(0);
}

bool is_bad_charactor(char c)
{
	switch (c)
	{
	case '/':
	case '_':
		return true;
	default:
		return false;
	}
}

void StatsGenerator::write_pattern_statstics_files() {

	//Iterator for Resource class map
	unordered_map<string, Resources::typesOfPatternsStruct>::iterator mapIt;

	mapIt = Resources::typesOfPatternsMap.begin();
	while (mapIt != Resources::typesOfPatternsMap.end()) {

		//Check if new data is added for respective pattern( deque size > 0 )
		if (mapIt->second.data.size() > 0) {

			if (mapIt->second.address != "") {
				FileHandler::write_and_append_file(mapIt->second.data, mapIt->second.address);
				mapIt->second.popularity += mapIt->second.data.size();
				mapIt->second.data.clear(); mapIt->second.data.shrink_to_fit();
			}
			else
			{

				mapIt->second.address = mapIt->first;
				mapIt->second.address.erase(std::remove_if(mapIt->second.address.begin(), mapIt->second.address.end(), &is_bad_charactor), mapIt->second.address.end());
				mapIt->second.address = "data/Stats/Patterns Data/" + mapIt->second.address + ".txt";
				FileHandler::write_and_append_file(mapIt->second.data, mapIt->second.address);
				mapIt->second.popularity += mapIt->second.data.size();
				mapIt->second.data.clear(); mapIt->second.data.shrink_to_fit();
			}
		}
		mapIt++;
	}

	//Clear and shrink containers
}

void StatsGenerator::write_key_patterns() {
	deque<string> patternAndAddresses;
	unordered_map<string, Resources::typesOfPatternsStruct>::iterator mapIt;

	mapIt = Resources::typesOfPatternsMap.begin();
	while (mapIt != Resources::typesOfPatternsMap.end()) {
		patternAndAddresses.push_back(mapIt->first + "<|>" +  mapIt->second.address + "<|>" + to_string(mapIt->second.popularity));
		mapIt++;
	}
	FileHandler::write_file(patternAndAddresses, "data/Stats/Patterns.txt");
	
	//Clear and shrink containers
	Resources::typesOfPatternsMap.clear(); Resources::typesOfPatternsMap.rehash(0);
	patternAndAddresses.clear(); patternAndAddresses.shrink_to_fit();
}