#include "FileHandler.h"
#include "Constants.h"


void FileHandler::get_files_recursive(deque<string>& fileNames, string directoryPath) {
	/*
		Using filesystem::recursive_directory_iterator to get names of all the files
		present in directoryPath and SUBFOLDERS.
		lastly saving all these functions in a deque(fileNames)
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
		Using filesystem::recursive_directory_iterator to get names of all the files
		present in directoryPath and SUBFOLDERS.
		lastly saving all these functions in a vector(fileNames)
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
		Using ifstream to open a file(filePath) and reading its content in deque(fileContent)
	*/
	string str;
	ifstream input(filePath);

	if (!input.is_open()) {
		cout << "File not found " << filePath << "\n";
	}
	else
	{
		while (getline(input, str)) {
			fileContent.push_back(str);
		}
	}
	input.close();
}

void FileHandler::read_file(vector<string>& fileContent, string filePath) {
	/*
		Using ifstream to open a file(filePath) and reading its content in vector(fileContent)
	*/
	string str;
	ifstream input(filePath);
	if (!input.is_open()) {
		cout << "File not found " << filePath << "\n";
	}
	else
	{
		while (getline(input, str)) {
			fileContent.push_back(str);
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
			fileContent.insert(str);
		}
	}
	input.close();
}

void FileHandler::write_file(deque<string>& fileContent, string filePath) {
	/*
		Using Of ofstream to open a file(filePath) and writing a deque(fileContent) in it
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
		Using Of ofstream to open a file(filePath) and writing a vector(fileContent) in it
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
		Using Of ofstream to open a file(filePath) and append a deque(fileContent) in it
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
		Using Of ofstream to open a file(filePath) and append a vector(fileContent) in it
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
		Here we are taking a path of directory(directoryPath) and resizing all its content
		in samll files.The length/size of small files is hardcoded.
		Step 1 while loop to iterate on number of files in that directory
		Step 2 every file is sent to resize_file function with a deque of vectors of strings
		Step 3 then we get deque of small vecotrs(vector of small vectors) of strings and make 
			   them individual files with another for loop.
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
		This is a helper function for resize_all_files() function.
		It resize a bigger file into multiple smaller files(The length/size of small files is hardcoded).
		Step 1. it checks if size of file content is bigger than desired number.
		Step 2. then starts while loop which divide them in smaller vectors and place these vectors in a deque
		Step 3. if file is smaller than desired size than just pass it normally in single vector
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