#include "FileHandler.h"
#include "Constants.h"


void FileHandler::get_files_recursive(deque<string>& fileNames, string directoryPath) {
	/*
		USING FILESYSTEM::RECURSIVE_DIRECTORY_ITERATOR TO GET NAMES OF ALL THE FILES
		PRESENT IN DIRECTORYPATH AND SUBFOLDERS.
		LASTLY SAVING ALL THESE FUNCTIONS IN A DEQUE(FILENAMES)
	*/
	size_t findErrorFile;
	for (const auto& entry : filesystem::recursive_directory_iterator(directoryPath)) {
		findErrorFile = entry.path().string().find(Constants::errorLogFileName);
		if (findErrorFile == string::npos) {
			fileNames.push_back(entry.path().string());
		}
	}
	/*
	for (const auto& entry : experimental::filesystem::recursive_directory_iterator(directoryPath))
		if (entry.path().string() != "Error Log") {
			fileNames.push_back(entry.path().string());
		}
	*/
	/*
	if code is working file you can delete this comment section
	for (const auto& entry : filesystem::recursive_directory_iterator(directoryPath))
		fileNames.push_back(entry.path().string());
	*/
}

void FileHandler::get_files_recursive(vector<string>& fileNames, string directoryPath) {
	/*
		USING FILESYSTEM::RECURSIVE_DIRECTORY_ITERATOR TO GET NAMES OF ALL THE FILES
		PRESENT IN DIRECTORYPATH AND SUBFOLDERS.
		LASTLY SAVING ALL THESE FUNCTIONS IN A VECTOR(FILENAMES)
	*/
	size_t findErrorFile;
	for (const auto& entry : filesystem::recursive_directory_iterator(directoryPath)) {
		findErrorFile = entry.path().string().find(Constants::errorLogFileName);
		if (findErrorFile == string::npos) {
			fileNames.push_back(entry.path().string());
		}
	}
	/*
	for (const auto& entry : experimental::filesystem::recursive_directory_iterator(directoryPath)){
		if (entry.path().string() != "Error Log") {
			fileNames.push_back(entry.path().string());
		}
	}
	*/
}

void FileHandler::read_file(deque<string>& fileContent, string filePath) {
	/*
		USING IFSTREAM TO OPEN A FILE(FILEPATH) AND READING ITS CONTENT IN DEQUE(FILECONTENT)
	*/
	string str;
	ifstream input(filePath);

	if (!input.is_open()) {
		cout << "File not found " << filePath << "\n";
	}
	else
	{
		while (getline(input, str)) {
			if (str.size() > 0) {
				fileContent.push_back(str);
			}
		}
	}
	input.close();
	return;
}

void FileHandler::read_file(vector<string>& fileContent, string filePath) {
	/*
		USING IFSTREAM TO OPEN A FILE(FILEPATH) AND READING ITS CONTENT IN VECTOR(FILECONTENT)
	*/
	string str;
	ifstream input(filePath);
	if (!input.is_open()) {
		cout << "File not found " << filePath << "\n";
	}
	else
	{
		while (getline(input, str)) {
			if (str.size() > 0) {
				fileContent.push_back(str);
			}
		}
	}
	input.close();
}

void FileHandler::read_file(unordered_set<string>& fileContent, string filePath) {
	string str;
	ifstream input(filePath);
	if (!input.is_open()) {
		cout << "File not found " << filePath << "\n";
	}
	else
	{
		while (getline(input, str)) {
			if (str.size() > 0) {
				fileContent.insert(str);
			}
		}
	}
	input.close();
}

void FileHandler::write_file(deque<string>& fileContent, string filePath) {
	/*
		USING OF OFSTREAM TO OPEN A FILE(FILEPATH) AND WRITING A DEQUE(FILECONTENT) IN IT
	*/
	ofstream output(filePath);
	if (!output.is_open()) {
		cout << "There is a problem while writing a file \n"<<filePath<<"\n";
		return;
	}
	for (auto it = fileContent.begin(); it != fileContent.end(); it++) {
		output << *it << "\n";
	}
	output.close();
}

void FileHandler::write_file(vector<string>& fileContent, string filePath) {
	/*
		USING OF OFSTREAM TO OPEN A FILE(FILEPATH) AND WRITING A VECTOR(FILECONTENT) IN IT
	*/
	ofstream output(filePath);
	if (!output.is_open()) {
		cout << "There is a problem while writing a file \n";
		return;
	}
	for (auto it = fileContent.begin(); it != fileContent.end(); it++) {
		output << *it << "\n";
	}
	output.close();
}


void FileHandler::write_and_append_file(deque<string>& fileContent, string filePath) {
	/*
		USING OF OFSTREAM TO OPEN A FILE(FILEPATH) AND APPEND A DEQUE(FILECONTENT) IN IT
	*/
	ofstream appendFile(filePath, ios::app);
	if (!appendFile.is_open()) {
		FileHandler::write_file(fileContent, filePath);
		return;
	}
	for (auto it = fileContent.begin(); it != fileContent.end(); it++) {
		appendFile << *it << "\n";
	}
	appendFile.close();
}

void FileHandler::write_and_append_file(vector<string>& fileContent, string filePath) {
	/*
		USING OF OFSTREAM TO OPEN A FILE(FILEPATH) AND APPEND A VECTOR(FILECONTENT) IN IT
	*/
	ofstream appendFile(filePath, ios::app);
	if (!appendFile.is_open()) {
		FileHandler::write_file(fileContent, filePath);
		return;
	}
	for (auto it = fileContent.begin(); it != fileContent.end(); it++) {
		appendFile << *it << "\n";
	}
	appendFile.close();
}

void FileHandler::resize_all_files(string directoryPath) {
	/*
		HERE WE ARE TAKING A PATH OF DIRECTORY(DIRECTORYPATH) AND RESIZING ALL ITS CONTENT
		IN SMALL FILES.THE LENGTH/SIZE OF SMALL FILES IS HARDCODED.
		STEP 1 WHILE LOOP TO ITERATE ON NUMBER OF FILES IN THAT DIRECTORY
		STEP 2 EVERY FILE IS SENT TO RESIZE_FILE FUNCTION WITH A DEQUE OF VECTORS OF STRINGS
		STEP 3 THEN WE GET DEQUE OF SMALL VECTORS(VECTOR OF SMALL VECTORS) OF STRINGS AND MAKE 
			   THEM INDIVIDUAL FILES WITH ANOTHER FOR LOOP.
	*/
	deque<string> allFilesPaths;
	get_files_recursive(allFilesPaths, directoryPath);
	vector<string> randomData;
	string str;
	long long int fileCounter = 1;
	deque<vector<string>> resizedDataFiles;
	deque<string>::iterator it = allFilesPaths.begin();
	while (it != allFilesPaths.end()) {

		read_file(randomData, *it);
		if (randomData.size() == 0) {
			it++;
			continue;
		}
		str = *it;
		if (remove(str.c_str()) != 0)
			cout << "Error deleting file" + *it + "\n";
		resize_file(resizedDataFiles, randomData);
		randomData.clear(); randomData.shrink_to_fit();
		for (int i = 0; i < resizedDataFiles.size(); i++) {
			write_file(resizedDataFiles[i], Constants::resizedFileName + to_string(fileCounter) + Constants::txtExtension);
			fileCounter++;
		}
		resizedDataFiles.clear(); resizedDataFiles.shrink_to_fit();
		it++;
	}
}

void FileHandler::resize_file(deque<vector<string>>& resizedContent, vector<string> tempVector) {
	/*
		THIS IS A HELPER FUNCTION FOR RESIZE_ALL_FILES() FUNCTION.
		IT RESIZE A BIGGER FILE INTO MULTIPLE SMALLER FILES(THE LENGTH/SIZE OF SMALL FILES IS HARDCODED).
		STEP 1. IT CHECKS IF SIZE OF FILE CONTENT IS BIGGER THAN DESIRED NUMBER.
		STEP 2. THEN STARTS WHILE LOOP WHICH DIVIDE THEM IN SMALLER VECTORS AND PLACE THESE VECTORS IN A DEQUE
		STEP 3. IF FILE IS SMALLER THAN DESIRED SIZE THAN JUST PASS IT NORMALLY IN SINGLE VECTOR
	*/
	vector<string> temp;
	vector<string>::iterator it = tempVector.begin();
	if ((float(tempVector.size()) / Constants::resizedFileSize) > 1.0f) {
		int count = 0;
		while (count != Constants::resizedFileSize) {
			temp.push_back(*it);
			count++;
			it++;
		}
		resizedContent.push_back(temp);
		temp.clear(); temp.shrink_to_fit();
		temp.insert(temp.begin(), it, tempVector.end());
		FileHandler::resize_file(resizedContent, temp);
	}
	else
	{
		while (it != tempVector.end()) {
			temp.push_back(*it);
			it++;
		}
		resizedContent.push_back(temp);
	}
}