#include "StatsGenerator.h"
#include"Resources.h"
#include"FileHandler.h"
#include "Constants.h"

using namespace std;

string StatsGenerator::split_filename(const string str)
{
	/*
		THIS FUNCTION EXTRACTS FILE NAME BY REMOVING EXTENSION OF FILES
	*/
	size_t found = str.find_last_of("/\\");
	if (found != string::npos) {
		return str.substr(found + 1);
	}
	else {
		return str;
	}
}

void StatsGenerator::load_stored_patterns(deque<string>& storedPatterns) {
	/*
		FUNCTION TO LOAD PROCESSED FILES.
		STEP 1. MAKE A ITERATOR FOR MAP, TEMP OBJECT OF PATTERN STRUCTURE AND TEMP DEQUE TO INITIALIZE MAP
		STEP 2. A WHILE TO ITERATE OVER STORED PATTERNS
		STEP 3. IF THERE IS A DELIMITER/DIVIDER THEN STORE PATTERN STRING, POPULARITY AND A
				EMPTY DEQUE FOR PATTERN DATA.
		STEP 4. CLEAR AND SHRINK STORED PATTERN MAP
	*/

	//iterate over all the file paths
	deque<string>::iterator it = storedPatterns.begin();


	Resources::typesOfPatternsStruct tempStruct;

	//shell deque to initialize map
	deque<string> fileContent;

	size_t foundAddress, foundPopularity;
	while (it != storedPatterns.end()) {

		foundAddress = it->find(Constants::outputDelimiter);
		if (foundAddress != string::npos) {

			foundPopularity = it->find(Constants::outputDelimiter, foundAddress + 3);

			tempStruct.address = it->substr(foundAddress + 3, foundPopularity - (foundAddress + 3));
			tempStruct.data = fileContent;
			tempStruct.popularity = stoi(it->substr(foundPopularity + 3));
			Resources::typesOfPatternsMap.insert({ it->substr(0, foundAddress), tempStruct });
		}
		it++;
	}
	//Clear and shrink containers
	storedPatterns.clear(); storedPatterns.shrink_to_fit();
}

void StatsGenerator::patterns_classifier(string filePath) {
	/*
		FUNCTION TO CLASSIFY PATTERNS, SO THAT A PARTICULAR PATTERN HAVE A SINGLE FILE FOR ITS DATA.
		STEP 1. DECLARE VARIABLES- TEMP DEQUE AND A MAP WITH ITERATORS 
		STEP 2. READ FILE CONTENT INTO TEMP DEQUE AND ITERATE OVER TEMPDEQUE WITH WHILE LOOP
		STEP 3. FIND FIRST DELIMITER/DIVIDE IN STRING WHICH WILL DENOTE PATTERN STRING
		STEP 4. CHECK IF IT ALREADY EXIST IN TEMP MAP OF PATTERNS CATEGORIES
		STEP 5. IF SO, THEN ADD PATTERN DATA TO FOUND CATEGORY ELSE CREATE A NEW ONE.
		STEP 6. CLEAR AND SHRINK ALL VARIABLES. 
	*/

	//Deque and iterator for reading and iterating over file data
	deque<string> tempDeque;
	deque<string>::iterator dequeIt;
	
	//Map and iterator for temporary map operation and key search 
	set<string> mapDeque;
	unordered_map<string, set<string>>::iterator mapIt;
	
	//Temporary string for data manipulation (Can be rectified)
	string str1,str2;
	
	//Read file data into tempDeque to process
	FileHandler::read_file(tempDeque, filePath);

	dequeIt = tempDeque.begin();
	while (dequeIt != tempDeque.end()) {
		
		str1 = *dequeIt;
		
		//Find first delimiter/divider(<|>) in string which is a pattern for that string data
		size_t foundValue;
		foundValue = str1.find(Constants::outputDelimiter);
		if (foundValue != std::string::npos) {
			
			str2 = str1.substr(0, foundValue);
			mapIt = statsResults.find(str2);
			if (mapIt != statsResults.end())
			{
				//If pattern exist in current temporary map then we just add another
				//data string to its temp std::set
				mapIt->second.insert(str1.substr(foundValue + 3));
			}
			else
			{
				//Else we add data string to temporary deque and then, add pattern
				//and that std::set as a new element in current temporary map
				mapDeque.insert(str1.substr(foundValue + 3));
				statsResults.insert({ str2, mapDeque });
				mapDeque.clear();
			}
		}
		dequeIt++;
	}
	//Clear and shrink all the containers 
	tempDeque.clear(); tempDeque.shrink_to_fit();

	//Store statsResult(temporary map) to main Resource class map
	store_classified_patterns();
}

void StatsGenerator::store_classified_patterns() {
	/*
		FUNCTION TO STORE TEMP MAP CATEGORIES INTO FINAL MAIN MAP CATEGORIES
		STEP 1. DECLARE ITERATOR FOR TEMP MAP AND MAIN MAP
		STEP 2. START AND MUTEX AND LOCK GUARD FOR THREAD SAFE EXECUTION
		STEP 3. WHILE LOOP TO ITERATE OVER TEMP MAP
		STEP 4. CHECK IF TEMP MAP PATTERN CATEGORY EXIST IN MAIN MAP
		STEP 5. IF SO THEN ADD TEMP MAP CATEGORY DATA TO MAIN MAP CATEGORY DATA 
		STEP 6. ELSE CREATE A NEW CATEGORY IN MAIN MAP
		STEP 7. CLEAR AND SHRINK VARIABLES 
	*/

	//Iterator for statsResult( temporary thread map ) 
	unordered_map<string, set<string>>::iterator mapIt;
	
	//Iterator for Key search in main Resource class map
	unordered_map<string, Resources::typesOfPatternsStruct>::iterator keyIt;

	Resources::typesOfPatternsStruct tempStruct;

	//Lock guard with shared mutex to ensure one thread execution at a time
	lock_guard<mutex> lockGuard(Resources::resultsMutex);
	
	mapIt = statsResults.begin();
	while (mapIt != statsResults.end()) {

		//Search if this pattern already exist or added by another thread
		keyIt = Resources::typesOfPatternsMap.find(mapIt->first);
		
		if (keyIt != Resources::typesOfPatternsMap.end()) {
			//If pattern exists already then we add data deque to main map's struct deque
			keyIt->second.data.insert(keyIt->second.data.end(), mapIt->second.begin(), mapIt->second.end());
		}
		else {
			tempStruct.address = ""; tempStruct.data.assign(mapIt->second.begin(), mapIt->second.end()); tempStruct.popularity = 0;
			//Else we add pattern and deque as a new element into main map
			Resources::typesOfPatternsMap.insert({ mapIt->first, tempStruct });
			tempStruct.data.clear();
		}
		mapIt++;
	}
	tempStruct.data.shrink_to_fit();
}

void StatsGenerator::clear_and_shrink() {
	/*
		FUNCTION TO CLEAR AND SHRINK CONTAINERS BELONG TO STATS GENERATOR CALSS
	*/
	for (auto mapIt = statsResults.begin(); mapIt != statsResults.end(); mapIt++) {
		mapIt->second.clear();
	}
	statsResults.clear(); statsResults.rehash(0);
}

bool is_bad_charactor(char c)
{
	/*
		HELPER FUNCTION TO CHECK CHARACTORS IS PRESENT OR NOT
	*/
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
	/*
		STEP 1. DECLARE A ITERATOR FOR MAIN MAP AND A WHILE LOOP TO ITERATE
		STEP 2. CHECK IF NEW DATA IS ADDED INTO MAIN MAP FOR RESPECTIVE PATTERN( DEQUE SIZE > 0 )
		STEP 3. IF SO THEN CHECK IF THAT CATEGORY HAS A ADDRESS FOR DATA FILE
		STEP 4. IF SO THEN APPEND DATA FILE WITH NEW DATA ELSE CREATE A NEW FILE WITH NEW DATA.
	*/

	//Iterator for Resource class map
	unordered_map<string, Resources::typesOfPatternsStruct>::iterator mapIt;

	mapIt = Resources::typesOfPatternsMap.begin();
	while (mapIt != Resources::typesOfPatternsMap.end()) {

		//Check if new data is added into main map for respective pattern( deque size > 0 )
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
				mapIt->second.address = Constants::patternDataFolderAddress + mapIt->second.address + Constants::txtExtension;
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
	/*
		FUNCTION TO WRITE CATEGORIZED PATTENS INTO A SINGLE FILE WITH ADDRESSES OF THEIR RESPECTIVE DATA FILES.
		STEP 1. DECLARE DEQUE FOR PATTERN AND ADDRESS AND A ITERATOR FOR MAIN MAP
		STEP 2. WHILE LOOP TO ITERATE OVER MAP
		STEP 3. ADD PATTERN, ADDRESS AND POPULARITY TO DEQUE AND FINALLY AFTER LOOP WRITE THAT IN A FILE.
		STEP 4. CLEAR AND SHRINK VARIABLES.
	*/
	deque<string> patternAndAddresses;
	unordered_map<string, Resources::typesOfPatternsStruct>::iterator mapIt;

	mapIt = Resources::typesOfPatternsMap.begin();
	while (mapIt != Resources::typesOfPatternsMap.end()) {
		patternAndAddresses.push_back(mapIt->first + Constants::outputDelimiter +  mapIt->second.address + Constants::outputDelimiter + to_string(mapIt->second.popularity));
		mapIt++;
	}
	FileHandler::write_file(patternAndAddresses, Constants::patternCategoriesFileAddress);
	
	//Clear and shrink containers
	Resources::typesOfPatternsMap.clear(); Resources::typesOfPatternsMap.rehash(0);
	patternAndAddresses.clear(); patternAndAddresses.shrink_to_fit();
}

void StatsGenerator::remove_redundant_pattern_data(int numberOfThreads = 2) {
	/*
		FUNCTION TO REMOVE COMMON REDUNDANT PATTERN DATA FROM STORED
		STEP 1. CHECK IF TOTAL UNIQUE PATTERN DATA FILES ARE SMALLER OR BIGGER THEN
				SPECIFIED NUMBER OF THREADS
		STEP 2. IF BIGGER THEN DIVIDE FILES ADDRESS EQUALLY TO THREADS AND REMAINDER
				SHOULD GO WITH ANOTHER LAST THREAD
		STEP 3. CALL HELPER FUNCTION ON EACH THREAD TO PERFORM OPERATION
		STEP 4. CLEAR CONTAINERS
	*/
	//Declare threads to process data faster
	vector<thread> threads; threads.reserve(numberOfThreads);

	//Iterator for Resource class map
	unordered_map<string, Resources::typesOfPatternsStruct>::iterator mapIt;

	//Declare objects to pass in threads for thread safe execution
	vector<StatsGenerator> patternFileObj(numberOfThreads);
	//Declare special object to pass in thread for thread safe execution
	StatsGenerator patternFileSpecialObj;

	//Resources::typesOfPatternsMap have pattern object every pattern represent unique data file
	//So, if number of files are greater than numberOfThread specified 
	if (Resources::typesOfPatternsMap.size() > numberOfThreads) {
		//set iterator to main stats pattern map
		mapIt = Resources::typesOfPatternsMap.begin();

		//loop till specified number of threads
		int i = 0, j = 0;
		while (i < numberOfThreads)
		{
			//loop till quotient of total number of files by number of specified threads
			j = 0;
			while (j < (Resources::typesOfPatternsMap.size()/numberOfThreads))
			{
				//get pattern in a temp object vector
				patternFileObj[i].uniquePatternFiles.push_back(mapIt->first);
				j++; mapIt++;
			}
			//execute thread with updated object
			threads.push_back(thread(&StatsGenerator::helper_to_remove_redundant_data, ref(patternFileObj.at(i))));
			i++;
		}
		//if above is not a perfect divide then consider remainder here
		if ((Resources::typesOfPatternsMap.size() % numberOfThreads) != 0) {
			//loop till end of pattern map
			while (mapIt != Resources::typesOfPatternsMap.end())
			{
				//get pattern in a temp object vector
				patternFileSpecialObj.uniquePatternFiles.push_back(mapIt->first);
				mapIt++;
			}
			//execute thread with updated object
			threads.push_back(thread(&StatsGenerator::helper_to_remove_redundant_data, ref(patternFileSpecialObj)));
		}
	}
	else
	{
		//insert all pattern in an object
		mapIt = Resources::typesOfPatternsMap.begin();
		while (mapIt != Resources::typesOfPatternsMap.end())
		{
			//get pattern in a temp object vector
			patternFileSpecialObj.uniquePatternFiles.push_back(mapIt->first);
			mapIt++;
		}
		//execute thread with updated object
		threads.push_back(thread(&StatsGenerator::helper_to_remove_redundant_data, ref(patternFileSpecialObj)));
	}
	//join threads
	for (int j = 0; j < threads.size(); j++) {
		threads[j].join();
	}
	threads.clear(); threads.shrink_to_fit();
}


void StatsGenerator::helper_to_remove_redundant_data(StatsGenerator& threadObj) {
	/*
		HELPER FUNCTION TO REMOVE REDUNDANT DATA (THREAD SAFE FUNCTION)
		STEP 1.	LOOP ON EACH FILE ADDRESS
		STEP 2. FIND FILE NAME(PATTERN) IN MAIN PATTERN STATS MAP
		STEP 3. READ UNIQUE PATTERN FILE DATA IN A std::set THIS WILL ONLY READ UNIQUE RECORDS
		STEP 5. UPDATE PATTERN POPULARITY IN MAIN PATTERN STATS MAP
		STEP 6. WRITE UNIQUE PATTERN FILE DATA
		STEP 7. CLEAR ADN SHRINK CONTAINERS
	*/
	//Iterator for Resource class map
	unordered_map<string, Resources::typesOfPatternsStruct>::iterator mapIt;
	//temp vector to read, write and remove data
	set<string> patternDataFile;
	//iterate over all files address
	for (int i = 0; i < threadObj.uniquePatternFiles.size(); i++) {
		//find unique file name in main pattern stats map
		//string tempStr =  filesystem::path(threadObj.uniquePatternFilesAddress[i]).stem().string();
		mapIt = Resources::typesOfPatternsMap.find(threadObj.uniquePatternFiles[i]);
		if (mapIt != Resources::typesOfPatternsMap.end()) {
			//read pattern data file
			FileHandler::read_file(patternDataFile, mapIt->second.address);

			//write updated pattern data file
			FileHandler::write_file(patternDataFile, mapIt->second.address);

			//set lock_gaurd if required
			//update popularity of pattern in main pattern stats map
			mapIt->second.popularity = patternDataFile.size();
			//clear temp vector
			patternDataFile.clear();
		}
	}
	//clear and shrink containers
	threadObj.uniquePatternFiles.clear(); threadObj.uniquePatternFiles.shrink_to_fit();
}