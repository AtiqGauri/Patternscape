#ifndef APILAYER_H
#define APILAYER_H
#pragma warning(disable : 4996) //_CRT_SECURE_NO_WARNINGS

#include<iostream>
#include<string>
#include<vector>
#include<deque>
#include<fstream>
#include<algorithm>
#include<thread>
//Custom Headers
#include"FileHandler.h"
#include"Resources.h"
#include"Comparison.h"
#include"Patterns.h"
#include"DataCleanser.h"
#include"StatsGenerator.h"
#include "Constants.h"

using namespace std;

namespace APILayer {
	/*
			RETURNS A TIMESTAMP OF CURRENT TIME
	*/
	auto time_stamp() {
		return std::chrono::high_resolution_clock::now();
	}

	/*
			TAKES TWO TIMESTAMPS AND PRINT AMOUNT OF TIME SPEND
	*/
	void time_elapsed(chrono::high_resolution_clock::time_point start, chrono::high_resolution_clock::time_point stop) {
		std::chrono::duration<double> elapsed = stop - start;
		cout << elapsed.count() << " Seconds\n";
	}

	/*
			HERE FILES PRESENT IN INPUT FOLDER WILL BE RESIZED
	*/
	void standardize_files(string directoryPath) {
		FileHandler::resize_all_files(directoryPath);
	}



	/*
			HERE EVERY THREAD WILL PROCESS DATA AND SEND OUTPUT TO RESOURCES::RESULTS
			STEP 1. DATA WILL BE LOWER CASED
			STEP 2. EMAIL FRONT PART, WEBSITE AND PASSWORD WILL BE EXTRACTED FROM RAW DATA
			STEP 3. WHILE LOOP WILL ITERATE OVER EVERY PASSWORD ONE BY ONE
			STEP 4. NAME, EMAIL, WEBSITE, LOCATION, DOB, MOBILE AND COMMON WORDS LISTS WILL BE TESTED
					AGAINST PASSWORD
			STEP 5. PATTERN WILL BE GENERATED FROM PROCESSED DATA
			STEP 6. ALL MEMORY WILL BE RELEASED BY THIS THREAD
	*/
	void thread_process(Comparison& compareThreadObj, Patterns& patternThreadObj) {
		vector<string>::iterator rawIt;
		compareThreadObj.lower_case_raw_data();
		compareThreadObj.extract_email_and_password(Constants::inputDelimiter);
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
			HERE EVERYTHING WILL BE EXECUTED. IT STARTS FROM IMPORTING INPUT THEN PROCESS AND LASTLY OUTPUT
			STEP 1. FIRST THREADS WILL BE DECLARED ACCORDING TO numberOfThreads VALUE (DEFAULT: 4)
			STEP 2. INPUT AND OUPUT FOLDER CAN BE SPECIFIED (OPTIONAL) 
			STEP 3. FILES WILL BE READ AND RESIZED WHICH ARE LOCATED IN INPUT FOLDER
			STEP 4. RESOURCES WILL BE READ TO RESPECTIVE VECTORS IN RESOURCES.H
			STEP 5. WHILE LOOP WILL ITERATE OVER ALL THE FILES AVAILABLE IN INPUT FOLDER
			STEP 6. EVERY FILE WILL BE READ AND GETS DISTRIBUTED EQUALLY IN NUMBER OF THREADS
			STEP 7. ALL THREAD(THREAD_PROCESS()) WILL RUN CONCURRENTLY AND SENDS OUPUT TO RESOURCES::RESULTS VECTOR
			STEP 8. MEMORY GETS RELEASED FOR NEXT FILE
	*/
	void main_program(int numberOfThreads=2, string inputFolderPath= Constants::inputFolderAddress, string outputFolderPath=Constants::outputFolderAddress) {
		//threads and objects declaration
		static const unsigned int totalThreads = numberOfThreads;
		//Creating objects for thread safe executing data processing
		vector<Comparison> compareThreadObj(totalThreads); vector<Patterns> patternThreadObj(totalThreads);
		vector<thread> threads; threads.reserve(totalThreads);
		size_t begint = 0, endt = 0;
		//Variable to store time and string to make time date string
		string currentDateTimeString;

		//Resizing all the files in Input folder to size(100,000 lines per file)
		FileHandler::resize_all_files(Constants::inputFolderAddress);
		auto start = time_stamp();

		//Reading all resource files
		deque<string> filePaths;
		FileHandler::get_files_recursive(filePaths, inputFolderPath);
		deque<string>::iterator file = filePaths.begin();
		Resources::read_resources();
		//Resource collected
		auto stop = time_stamp();
		cout << "Read Resources and files name in:  "; time_elapsed(start, stop);
		

		//process files
		auto start2 = time_stamp();
		long long int fileCounter = 0;
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
			if (Resources::rawDataList.size()<20000) {
				Comparison compareObj; Patterns patternObj;
				compareObj.rawData.reserve(compareObj.rawData.size());
				compareObj.rawData.insert(compareObj.rawData.begin(), Resources::rawDataList.begin(), Resources::rawDataList.end());
				thread_process(compareObj, patternObj);
			}
			else
			{
				//divide file content into equal parts(threadNumber) to process
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
			}

			//get time from system clock
			DataCleanser::systemTimeContainer = chrono::system_clock::to_time_t(chrono::system_clock::now());
			//fill date time struct then create a data time string => date_time
			//WARNING LOCALTIME IS NOT THREAD SAFE 
			DataCleanser::dateTimeStruct = localtime(&DataCleanser::systemTimeContainer);

			currentDateTimeString = to_string(DataCleanser::dateTimeStruct->tm_mday) + to_string(1 + DataCleanser::dateTimeStruct->tm_mon)
				+ to_string(1900 + DataCleanser::dateTimeStruct->tm_year)
				+ "_"
				+ to_string((chrono::high_resolution_clock::now()).time_since_epoch().count());
			cout << currentDateTimeString << "\n";

			//write output in a file =>  fileCounter_time_date.extension
			FileHandler::write_file(Resources::results, outputFolderPath + to_string(fileCounter) + "_" +
				currentDateTimeString + "_" + Constants::outputFileName);
			
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
		cout << "\nFiles Loop:  "; time_elapsed(start2, stop2);
		//Processed
	}

	/*
		STATS GENERATOR HELPER FUNCTION ASSIGN TASKS TO THREADS
	*/
	void stats_thread(StatsGenerator& obj, string str) {
		obj.patterns_classifier(str);
		obj.clear_and_shrink();
	}

	void pattern_stats(int numberOfThreads = 2) {
		//Get the PATHS of all the files which are going to processed
		deque<string> filePaths;
		FileHandler::get_files_recursive(filePaths, Constants::outputFolderAddress);
		deque<string>::iterator file;

		//Load PATHS of previously generated files(stats or types of pattern)
		deque<string> listOfPatterns;
		FileHandler::read_file(listOfPatterns, Constants::patternCategoriesFileAddress);
		if (listOfPatterns.size() > 0) {
			StatsGenerator::load_stored_patterns(listOfPatterns);
		}
		
		if (filePaths.size() >= numberOfThreads) {
			//Declare threads to process data faster
			vector<thread> threads;

			//reserve thread vector size 
			threads.reserve(numberOfThreads);

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

			//Clear and Shrink all the containers 
			threads.shrink_to_fit();
		}   
		else {
			//Declare threads to process data faster
			vector<thread> threads;

			//Thread objects
			vector<StatsGenerator> statsObj(filePaths.size());

			//reserve threads vector
			threads.reserve(filePaths.size());

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

			//Clear and Shrink all the containers 
			threads.shrink_to_fit();
		}

		//Remove redundant/duplicate pattern data records and update their popularity accordingly
		StatsGenerator::remove_redundant_pattern_data(2);

		//write main pattern stats map to a special file
		//this file represent pattern categories (PATTERN:ADDRESS:POPULARITY) 
		StatsGenerator::write_key_patterns();

		//delete files as we have generated stats out of them
		/*
		for (int i = 0; i < filePaths.size(); i++) {
			if (remove(filePaths[i].c_str()) != 0) {
				cout << "ERROR: while deleting file: " + filePaths[i] << endl;
			}
		}
		*/
	}

	/*
		FUNCTION TO DETECT PATTERN IN A SINGLE RECORD OF PASSWORD AND EMAIL(OPTIONAL)
		ARGUMENTS:
			TARGETPASSWORD- PATTERNS GONNA BE DETECTED IN THIS PASSWORD
			TARGETEMAIL- EMAIL ATTACHED TO THAT PASSWORD(OPTIONAL)(DEFAULT=*****@*****.COM)
		STEP 1. FIRST CHECK IF EMAIL HAS A VALUE IF NOT THEN USE DEFAULT VALUE
		STEP 2. CREATE A TEMPORARY VECTOR TO STORE EMAIL:PASSWORD
		STEP 3. THEN PASS IT TO main_process() FUNCTION AND RETRIVE OUTPUT
		STEP 4. CLEAR AND SHRINK ALL CONTAINER
		STEP 5. RETURN OUTPUT
	*/
	string process_target(string targetPassword, string targetEmail = "") {		

		//if email is empty then set default value
		if (targetEmail == "") {
			targetEmail = Constants::defaultEmailString;
		}
		//temp vector to store email:password
		vector<string> tempVector;
		tempVector.push_back(targetEmail + Constants::inputDelimiter + targetPassword);
		
		//create a temporary directory to operate in
		filesystem::create_directory(Constants::singleTargetFileDirectory);
		//store vector into a file to process it
		FileHandler::write_file(tempVector, Constants::singleTargetFileDirectory+"single_target.txt");

		//pass it to main process
		APILayer::main_program(1, Constants::singleTargetFileDirectory, Constants::singleTargetFileDirectory);
		
		//clear vector
		tempVector.clear();
		//delete input file
		if (remove((Constants::singleTargetFileDirectory + "single_target.txt").c_str()) != 0) {
			cout << "Error deleting file" + (Constants::singleTargetFileDirectory + "single_target.txt") + "\n";
		}

		//read output file then delete it
		string filePath, resultString = "";

		//get address of output file
		for (const auto& entry : filesystem::recursive_directory_iterator(Constants::singleTargetFileDirectory)) {
			filePath = entry.path().string();
		}
		
		//read output
		FileHandler::read_file(tempVector, filePath);
		
		//delete output vector containing file
		if (remove(filePath.c_str()) != 0) {
			cout << "Error deleting file" + filePath + "\n";
		}

		//return file output value as a string
		for (int i = 0; i < tempVector.size(); i++) {
			resultString += tempVector[i];
		}
		return resultString;
	}

}
#endif // !APILAYER_H