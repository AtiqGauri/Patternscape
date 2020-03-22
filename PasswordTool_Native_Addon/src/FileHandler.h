#ifndef FILEHANDLER_H
#define FILEHANDLER_H

#include <iostream>
#include <filesystem>
#include <fstream>
#include <cstdio>
#include <string>
#include <vector>
#include <deque>
#include <unordered_set>

#include"DataCleanser.h"

using namespace std;

class FileHandler
{
public:
	/*
		USING EXPERIMENTAL::FILESYSTEM::RECURSIVE_DIRECTORY_ITERATOR TO GET NAMES OF ALL THE FILES
		PRESENT IN DIRECTORYPATH AND SUBFOLDERS.
		LASTLY SAVING ALL THESE FUNCTIONS IN A DEQUE(FILENAMES)
	*/
	static void get_files_recursive(deque<string>& fileNames, string directoryPath);
	
	/*
		Using experimental::filesystem::recursive_directory_iterator to get names of all the files
		present in directoryPath and SUBFOLDERS.
		lastly saving all these functions in a vector(fileNames)
	*/
	static void get_files_recursive(vector<string>& fileNames, string directoryPath);
	
	/*
		USING IFSTREAM TO OPEN A FILE(FILEPATH) AND READING ITS CONTENT IN DEQUE(FILECONTENT)
	*/
	static void read_file(deque<string>& fileContent, string filePath);

	/*
		USING IFSTREAM TO OPEN A FILE(FILEPATH) AND READING ITS CONTENT IN VECTOR(FILECONTENT)
	*/
	static void read_file(vector<string>& fileContent, string filePath);

	static void read_file(unordered_set<string>& fileContent, string filePath);

	/*
		USING OF OFSTREAM TO OPEN A FILE(FILEPATH) AND WRITING A DEQUE(FILECONTENT) IN IT
	*/
	static void write_file(deque<string>& fileContent, string filePath);

	/*
		USING OF OFSTREAM TO OPEN A FILE(FILEPATH) AND WRITING A VECTOR(FILECONTENT) IN IT
	*/
	static void write_file(vector<string>& fileContent, string filePath);

	/*
		USING OF OFSTREAM TO OPEN A FILE(FILEPATH) AND APPENDING A DEQUE(FILECONTENT) IN IT
	*/
	static void write_and_append_file(deque<string>& fileContent, string filePath);

	/*
		USING OF OFSTREAM TO OPEN A FILE(FILEPATH) AND APPENDING A VECTOR(FILECONTENT) IN IT
	*/
	static void write_and_append_file(vector<string>& fileContent, string filePath);

	/*
		HERE WE ARE TAKING A PATH OF DIRECTORY(DIRECTORYPATH) AND RESIZING ALL ITS CONTENT
		IN SMALL FILES.THE LENGTH/SIZE OF SMALL FILES IS HARDCODED.
		STEP 1 WHILE LOOP ITERATE ON NUMBER OF FILES IN THAT DIRECTORY
		STEP 2 EVERY FILE IS SENT TO RESIZE_FILE FUNCTION WITH A DEQUE OF VECTORS OF STRINGS
		STEP 3 WE GET DEQUE OF SMALL VECTORS OF STRINGS AND MAKE THEM INDIVIDUAL FILES WITH ANOTHER FOR LOOP
	*/
	static void resize_all_files(string directoryPath);

	/*
		THIS FUNCTION IS ONLY CALLED BY RESIZE_ALL_FILES().
		IT RESIZE A BIGGER FILE INTO SMALLER FILE.THE LENGTH/SIZE OF SMALL FILES IS HARDCODED.
		STEP 1. IT CHECKS IF SIZE OF FILE CONTENT IS BIGGER THAN DESIRED NUMBER.
		STEP 2. THEN STARTS WHILE LOOP WHICH PIECES THEM IN SMALLER CONTENT VECTORS AND PLACE THESE VECTORS IN DEQUE
		STEP 3. IF FILE IS SMALLER THAN LESSER THAN DESIRED SIZE THAN JUST PASS IT NORMALLY IN SINGLE VECTOR
	*/
	static void resize_file(deque<vector<string>>& resizedContent, vector<string> tempVector);
};

#endif // !FILEHANDLER_H


