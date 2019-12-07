#ifndef APILAYER_H
#define APILAYER_H

#include<iostream>
#include<string>
#include<vector>
#include<deque>
#include<fstream>
#include<algorithm>
#include<chrono>
#include<thread>
//Custom Headers
#include"FileHandler.h"
#include"Resources.h"
#include"Comparison.h"
#include"Patterns.h"
#include"DataCleanser.h"
#include"StatsGenerator.h"

using namespace std;

namespace APILayer {
	/*
			returns a timestamp of current time
	*/
	auto time_stamp() {
		return std::chrono::high_resolution_clock::now();
	}

	/*
			Takes two timestamps and print amount of time spend
	*/
	void time_elasped(chrono::high_resolution_clock::time_point start, chrono::high_resolution_clock::time_point stop) {
		std::chrono::duration<double> elasped = stop - start;
		cout << elasped.count() << " Seconds\n";
	}

	/*
			Here files present in Input folder will be resized
	*/
	void standardize_files(string directoryPath) {
		FileHandler::resize_all_files(directoryPath);
	}



	/*
			Here Every thread will process data and send output to Resources::results
			Step 1. data will be lower cased
			Step 2. email front part, website and password will be extracted from raw data
			Step 3. While loop will iterate over every password one by one
			Step 4. name, email, website, location, dob, mobile and common words lists will be tested
					against password
			Step 5. pattern will be generated from processed data
			Step 6. all memory will be released by this thread
	*/
	void thread_process(Comparison& compareThreadObj, Patterns& patternThreadObj) {
		vector<string>::iterator rawIt;
		compareThreadObj.lower_case_raw_data();
		compareThreadObj.extract_email_and_password(":");
		compareThreadObj.extract_email_names_and_websites();
		rawIt = compareThreadObj.passwordsList.begin();
		while (rawIt != compareThreadObj.passwordsList.end())
		{
			compareThreadObj.name_list_comparison(*rawIt);
			compareThreadObj.email_name_list_comparison(*rawIt, rawIt);
			compareThreadObj.website_list_comparison(*rawIt, rawIt);
			compareThreadObj.dob_list_comparison(*rawIt);
			compareThreadObj.location_list_comparison(*rawIt);
			compareThreadObj.mobile_number_comparison(*rawIt);
			compareThreadObj.common_word_list_comparison(*rawIt);
			patternThreadObj.rawResults = compareThreadObj.results;
			compareThreadObj.results.clear(); compareThreadObj.results.shrink_to_fit();
			patternThreadObj.pattern(*rawIt);
			rawIt++;
		}
		patternThreadObj.insert_output();
		compareThreadObj.clear_and_shrink();
		patternThreadObj.clear_and_shrink();
	}
	
	/*
			Here Everything will be executed. It starts from importing input then process and lastly output
			Step 1. first threads will be declared according to numberOFThreads value (default: 4)
			Step 2. Input and Ouput folder can be specified (optional) 
			Step 3. files will be read and resized which are located in Input folder
			Step 4. resources will be read to respective vectors in Resources.h
			Step 5. while loop will iterate over all the files available in Input folder
			Step 6. every file will be read and gets distributed equally in number of threads
			Step 7. all thread(thread_process()) will run concurrently and sends ouput to Resources::results vector
			Step 8. memory gets released for next file
	*/
	void main_program(int numberOfThreads=4, string inputFolderPath= "data/Input/", string outputFolderPath="data/Output/") {
		//threads and objects declaration
		static const unsigned int totalThreads = numberOfThreads;
		//Creating objects for thread safe executing data processing
		vector<Comparison> compareThreadObj(totalThreads); vector<Patterns> patternThreadObj(totalThreads);
		vector<thread> threads; threads.reserve(totalThreads);
		size_t begint = 0, endt = 0;

		//Resizing all the files in Input folder to size(100,000 lines per file)
		FileHandler::resize_all_files("data/Input/");
		auto start = time_stamp();

		//Reading all resource files
		deque<string> filePaths;
		FileHandler::get_files_recursive(filePaths, inputFolderPath);
		deque<string>::iterator file = filePaths.begin();
		Resources::read_resources();
		//Resource collected
		auto stop = time_stamp();
		cout << "Read Resources and files name in:  "; time_elasped(start, stop);
		

		//process files
		auto start2 = time_stamp();
		int fileCounter = 0;
		while (file != filePaths.end()) {
			start = time_stamp();
			cout << "\n" << "File: " << *file << " \n";

			//process Data
			//read file data (*file is file address)
			Resources::read_raw_data_list(*file);
			
			//if file has no data then move to next
			if (Resources::rawDataList.size() == 0) {
				file++;
				continue;
			}

			//divide file content into equal parts(threadNumber) to parocess
			//them in multiple threads
			for (unsigned int i = 0; i < totalThreads; i++) {
				begint = (i * Resources::rawDataList.size()) / totalThreads;
				endt = (i + (size_t)1) * Resources::rawDataList.size() / totalThreads;
				compareThreadObj[i].rawData.reserve(Resources::rawDataList.size() / totalThreads);
				compareThreadObj[i].rawData.insert(compareThreadObj[i].rawData.begin(), Resources::rawDataList.begin() + begint, Resources::rawDataList.begin() + endt);
				
				//process data chunks in multiple threads
				threads.push_back(thread(&APILayer::thread_process, ref(compareThreadObj[i]), ref(patternThreadObj[i])));
			}

			//join threads to main thread
			for (unsigned int j = 0; j < totalThreads; j++) {
				threads[j].join();
			}

			//clear thread vector for next iteration
			threads.clear();
			
			//write output in a file 
			FileHandler::write_file(Resources::results, outputFolderPath + to_string(fileCounter) + "output.txt");
			
			//clear and shrink memory 
			Resources::rawDataList.clear(); Resources::rawDataList.shrink_to_fit();
			Resources::results.clear(); Resources::results.shrink_to_fit();
			//Processed

			//increase file name counter and file address iterator
			fileCounter++;
			file++;
		}
		auto stop2 = time_stamp();
		filePaths.clear(); filePaths.shrink_to_fit();
		cout << "\nFiles Loop:  "; time_elasped(start2, stop2);
		//Processed
	}

	void stats_thread(StatsGenerator& obj, string str) {
		obj.patterns_classifier(str);
	}

	void pattern_stats(int numberOfThreads = 2) {
		//Get the PATHS of all the files which are going to processed
		deque<string> filePaths;
		FileHandler::get_files_recursive(filePaths, "data/Output/");
		deque<string>::iterator file;

		//Load PATHS of previously generated files(stats or types of pattern)
		deque<string> listOfPatterns;
		FileHandler::read_file(listOfPatterns, "data/Stats/Patterns.txt");
		if (listOfPatterns.size() > 0) {
			StatsGenerator::load_stored_patterns(listOfPatterns);
		}
		
		if (filePaths.size() >= numberOfThreads) {
			
			//Declare threads to process data faster
			vector<thread> threads; threads.reserve(numberOfThreads);

			//Declare objects to pass in threads for thread safe execution
			vector<StatsGenerator> statsObj(numberOfThreads);
			
			//Counter for calculating running threads and joining threads to main process
			int runningThreads, threadIt;

			file = filePaths.begin();
			while (file != filePaths.end()) {
				
				runningThreads = 0;
				while (runningThreads != numberOfThreads && file != filePaths.end()) {
					
					//threads.push_back(thread(&APILayer::thread_process, ref(compareThreadObj[i]), ref(patternThreadObj[i])));
					threads.push_back(thread(&APILayer::stats_thread, ref(statsObj[runningThreads]), *file));
					runningThreads++; file++;
				}
				
				//Join all the threads to main thread
				threadIt = 0;
				while (threadIt != runningThreads) {
					
					threads[threadIt].join();
					threadIt++;
				}
				threads.clear();

				//Write Types of patterns to files
				StatsGenerator::write_pattern_statstics_files();
			}
			
			StatsGenerator::write_key_patterns();

			//Clear and Shrink all the containers 
			threads.shrink_to_fit();
		}   
		else {

			//Thread objects
			vector<StatsGenerator> statsObj(filePaths.size());

			//Declare threads to process data faster
			vector<thread> threads; threads.reserve(filePaths.size());

			//objects Counter
			int objC = 0;

			file = filePaths.begin();
			while (file != filePaths.end()) {

				threads.push_back(thread(&APILayer::stats_thread, ref(statsObj[objC]), *file));
				file++; objC++;
			}
			
			//Joint all the threads
			vector<thread>::iterator joinIt = threads.begin();
			while (joinIt != threads.end()) {

				joinIt->join();
				joinIt++;
			}
			threads.clear();

			//Write Types of patterns to files
			StatsGenerator::write_pattern_statstics_files();

			StatsGenerator::write_key_patterns();

			//Clear and Shrink all the containers 
			threads.shrink_to_fit();
		}
	}

	/*
		Function to detect pattern in a single record of password and email(optional)

	*/
	string process_target(string targetPassword, string targetEmail = "") {		
		if (targetEmail == "") {
			targetEmail = "*****@*****.com";
		}
		vector<string> tempVector;
		tempVector.push_back(targetEmail + ":" + targetPassword);
		FileHandler::write_file(tempVector, "data/Temp/singlePassword.txt");
		APILayer::main_program(1, "data/Temp/", "data/Temp/");
		tempVector.clear();
		string filePath = "data/Temp/0output.txt", resultString = "";
		FileHandler::read_file(tempVector, filePath);
		if (remove(filePath.c_str()) != 0) {
			cout << "Error deleting file" + filePath + "\n";
		}
		filePath = "data/Temp/singlePassword.txt";
		if (remove(filePath.c_str()) != 0) {
			cout << "Error deleting file" + filePath + "\n";
		}
		for (int i = 0; i < tempVector.size(); i++) {
			resultString += tempVector[i];
		}
		return resultString;
	}

}
#endif // !APILAYER_H