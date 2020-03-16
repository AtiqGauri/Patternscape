#ifndef FILEHANDLER_H
#define FILEHANDLER_H

/*
	All the methods have their documentation in source file
*/

#include <iostream>
#include <filesystem>
#include <fstream>
#include <cstdio>
#include <string>
#include <vector>
#include <deque>
#include <unordered_set>

using namespace std;

class FileHandler
{
public:
	/*
		Using experimental::filesystem::recursive_directory_iterator to get names of all the files
		present in directoryPath and SUBFOLDERS.
		lastly saving all these functions in a deque(fileNames)
	*/
	static void get_files_recursive(deque<string>& fileNames, string directoryPath);
	
	/*
		Using experimental::filesystem::recursive_directory_iterator to get names of all the files
		present in directoryPath and SUBFOLDERS.
		lastly saving all these functions in a vector(fileNames)
	*/
	static void get_files_recursive(vector<string>& fileNames, string directoryPath);
	
	/*
		Using ifstream to open a file(filePath) and reading its content in deque(fileContent)
	*/
	static void read_file(deque<string>& fileContent, string filePath);

	/*
		Using ifstream to open a file(filePath) and reading its content in vector(fileContent)
	*/
	static void read_file(vector<string>& fileContent, string filePath);

	static void read_file(unordered_set<string>& fileContent, string filePath);

	/*
		Using Of ofstream to open a file(filePath) and writing a deque(fileContent) in it
	*/
	static void write_file(deque<string>& fileContent, string filePath);

	/*
		Using Of ofstream to open a file(filePath) and writing a vector(fileContent) in it
	*/
	static void write_file(vector<string>& fileContent, string filePath);

	
	static void write_and_append_file(deque<string>& fileContent, string filePath);

	static void write_and_append_file(vector<string>& fileContent, string filePath);

	/*
		Here we are taking a path of directory(directoryPath) and resizing all its content
		in samll files.The length/size of small files is hardcoded.
		Step 1 while loop iterate on number of files in that directory
		Step 2 every file is sent to resize_file function with a deque of vectors of strings
		Step 3 we get deque of small vectors of strings and make them individual files with another for loop
	*/
	static void resize_all_files(string directoryPath);

	/*
		This function is only called by resize_all_files().
		It resize a bigger file into smaller file.The length/size of small files is hardcoded.
		Step 1. it checks if size of file content is bigger than desired number.
		Step 2. then starts while loop which pieces them in smaller content vectors and place these vectors in deque
		Step 3. if file is smaller than lesser than desired size than just pass it normally in single vector
	*/
	static void resize_file(deque<vector<string>>& resizedContent, vector<string> tempVector);
};

#endif // !FILEHANDLER_H


