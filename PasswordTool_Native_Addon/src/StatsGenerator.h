#ifndef STATSGENERATOR_H
#define STATSGENERATOR_H

#include<iostream>
#include<fstream>
#include<thread>
#include<vector>
#include<deque>
#include<string>
#include<algorithm>
#include<mutex>
#include<unordered_map>

using namespace std;

class StatsGenerator
{
public:
	/*
		Function to load processed files.
		Step 1. make a iterator for map, temp object of pattern structure and temp deque to intialize map
		Step 2. a while to iterate over stored patterns
		Step 3. if there is a dilimiter/divider then store pattern string, popularity and a 
				empty deque for pattern data.
		Step 4. clear and shrink stored pattern map
	*/
	static void load_stored_patterns(deque<string>& storedPatterns);

	/*
		Step 1. declare a iterator for main map and a while loop to iterate
		Step 2. check if new data is added into main map for respective pattern( deque size > 0 )
		Step 3. if so then check if that category has a address for data file
		Step 4. if so then append data file with new data else create a new file with new data.
	*/
	static void write_pattern_statstics_files();

	/*
		This function extracts file name by removing extension of files
	*/
	static string split_filename(const string str);

	/*
		Function to write categorised pattens into a single file with addresses of their respective data files.
		Step 1. declare deque for pattern and address and a iterator for main map
		Step 2. while loop to itrate over map
		Step 3. add pattern, address and popularity to deque and finally after loop write that in a file.
		Step 4. clear and shrink variables.
	*/
	static void write_key_patterns();

	//Thread Safe Members
	//Unordered map to store patterns and their data temporarily
	unordered_map<string, deque<string>> statsResults;
	
	/*
		Function to classify patterns, so that same pattern have a single file for its data.
		Step 1. declare variables- temp deque and a map with iterators 
		Step 2. read file content into temp deque and iterate over tempDeque with while loop
		Step 3. find first delimiter/divide in string which will denote pattern string
		Step 4. check if it already exist in temp map of patterns categories
		Step 5. if so, then add pattern data to found category else create a new one.
		Step 6. clear and shrink all variables. 
	*/
	void patterns_classifier(string filePath);

	/*
		Function to store temp map categories into final main map categories
		Step 1. declare iterator for temp map and main map
		Step 2. Start and mutex and lock guard for thread safe execution
		Step 3. while loop to iterate over temp map
		Step 4. check if temp map pattern category exist in main map
		Step 5. if so then add temp map category data to main map category data 
		Step 6. else create a new category in main map
		Step 7. clear and shrink variables 
	*/
	void store_classified_patterns();
};

#endif // !STATSGENERATOR_H