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
	static void load_stored_patterns(deque<string>& storedPatterns);
	static void write_pattern_statstics_files();
	static string split_filename(const string str);
	static void write_key_patterns();

	//Thread Safe Members
	//vector<Resources::typesOfPatternsStruct> statsResult;
	unordered_map<string, deque<string>> statsResults;
	void patterns_classifier(string filePath);
	void store_classified_patterns();
};

#endif // !STATSGENERATOR_H