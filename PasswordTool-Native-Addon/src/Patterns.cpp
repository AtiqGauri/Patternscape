#include "Patterns.h"

void Patterns::pattern(string password) {
	/*
		Here processed data will be converted into patterns
		Step 1. sort data
		Step 2. call divide_patterns() on data to divide overlapping patterns and addressing undetected part
		Step 3. sort data on basis of struct length element
		Step 4. Formatting output and write it in a file
	*/

	string value_pattern, finalOutputString;
	//Step 1
	sort_vector_struct_on_length(rawResults);
	//Step 2
	divide_patterns(rawResults, password);
	rawResults.clear(); rawResults.shrink_to_fit();
	//Step 3
	for (size_t i = 0; i < splittedResults.size(); i++) {
		sort_vector_struct_on_location(splittedResults[i]);
	}
	//Step 4 
	for(size_t i=0; i<splittedResults.size(); i++)
	{
		//finalOutputString += "Pattern: ";
		//value_pattern = "<|>Values: ";
		value_pattern = "<|>";
		for (size_t j = 0; j < splittedResults[i].size(); j++)
		{
			finalOutputString += splittedResults[i][j].key;
			value_pattern += "\"" + splittedResults[i][j].value + "\"" + "<|>" + " Length:" + to_string(splittedResults[i][j].len) + " Position:" + to_string(splittedResults[i][j].loc) + "<|>";
		}
		//finalOutputString += "<|>Password: " + password + value_pattern + "\n";
		finalOutputString += "<|>" + password + value_pattern + "\n";
	}
	//To remove extra newline form the end of loop
	finalOutputString.pop_back();

	//Clear and shrink vectors 
	for (size_t i = 0; i < splittedResults.size(); i++) {
		splittedResults[i].clear(); splittedResults[i].shrink_to_fit();
	}
	splittedResults.clear(); splittedResults.shrink_to_fit();
	//insert final string to output vector
	output.push_back(finalOutputString);
}

void Patterns::sort_vector_struct_on_length(vector<Resources::patternStructure>& x) {
	/*
		This function takes a vector of type patternStructure and sort it
		on the basis of its length element
	*/
	sort(x.begin(), x.end(), [](Resources::patternStructure a, Resources::patternStructure b) -> bool
		{
			if (a.len != b.len) {
				return a.len > b.len;
			}
			else {
				return a.loc < b.loc;
			}
		});
}

void Patterns::sort_vector_struct_on_location(vector<Resources::patternStructure>& x) {
	/*
		This function takes a vector of type patternStructure and sort it
		on the basis of its location element
	*/
	sort(x.begin(), x.end(), [](Resources::patternStructure a, Resources::patternStructure b) -> bool
		{
			if (a.loc != b.loc) {
				return a.loc < b.loc;
			}
			else {
				return a.len > b.len;
			}
		});
}

void Patterns::divide_patterns(vector<Resources::patternStructure>& patternVector, string password) {
	/*
		Here a single pattern get divided into multiple if it overlapping itself.
		To address undetected part Undetected() will called after dividing patter in multiple patterns
		Step 1. every part will be tested to verify location attribute is overlapping or not
		Step 2. if so then overlapping part will be called reqursivly and current part will be stored.
		Step 3. this will end with calling Undetected() on all the patterns.
	*/
	vector<Resources::patternStructure> temp;
	if (patternVector.size() != 0) {
		for (size_t i = 0; i < patternVector.size() - 1; ++i) {
			for (size_t j = i + 1; j < patternVector.size(); ++j) {
				if ((patternVector[j].loc >= patternVector[i].loc) && (patternVector[j].loc <= (patternVector[i].loc + patternVector[i].len - 1))) {
					temp.push_back(patternVector[j]);
					patternVector.erase(patternVector.begin() + j);
					j--;
				}
			}
		}
		if (temp.size() == 0) {
			splittedResults.push_back(patternVector);
		}
		else {
			splittedResults.push_back(patternVector);
			return divide_patterns(temp, password);
		}
		undetected(password);
	}
	else
	{
		patternVector.push_back({ "Undetected/", password, int(password.length()), 0 });
		splittedResults.push_back(patternVector);
	}
}

void Patterns::undetected(string password) {
	/*
		This function takes splittedResults and analyse their undetected part to add undetected tag.
		Step 1. every pattern will go through for loop one by one
		Step 2. for loop has 3 if statements to address front - middle - end part of pattern
		Step 3. first if will check if location 0 is an undetected part or not
		Step 4. second if will run a loop until last detected part to check if there is an undetected
				part in middle
		Step 5. Thired if will check if end of password is undetected part or not
		Step 6. If any part of password is found to be undetected than a tag will we added to that 
				location.
	*/
	if (splittedResults.size() != 0) {
		int p_size = (int)password.length();
		vector<Resources::patternStructure> x_i_temp;
		for (size_t i = 0; i < splittedResults.size(); i++) {
			int x_i_size = (int)splittedResults[i].size();
			if (splittedResults[i][0].loc != 0) {
				x_i_temp.push_back({ "Undetected/", password.substr(0, splittedResults[i][0].loc), splittedResults[i][0].loc, 0 });
			}
			for (int j = 0; j < x_i_size - 1; j++) {
				if ((splittedResults[i][j + (size_t)1].loc - (splittedResults[i][j].loc + splittedResults[i][j].len - 1) - 1) > 0) {
					x_i_temp.push_back({ "Undetected/", password.substr(((size_t)splittedResults[i][j].loc + (size_t)splittedResults[i][j].len), ((size_t)splittedResults[i][j + (size_t)1].loc - ((size_t)splittedResults[i][j].loc + (size_t)splittedResults[i][j].len - (size_t)1) - (size_t)1)), (splittedResults[i][j + (size_t)1].loc - (splittedResults[i][j].loc + splittedResults[i][j].len - 1) - 1), (splittedResults[i][j].loc + splittedResults[i][j].len) });
				}
			}
			if ((splittedResults[i][x_i_size - (size_t)1].loc + splittedResults[i][x_i_size - (size_t)1].len) != p_size) {
				x_i_temp.push_back({ "Undetected/", password.substr(((size_t)splittedResults[i][x_i_size - (size_t)1].loc + (size_t)splittedResults[i][x_i_size - (size_t)1].len), (p_size - ((size_t)splittedResults[i][x_i_size - (size_t)1].loc + (size_t)splittedResults[i][x_i_size - (size_t)1].len))), (p_size - (splittedResults[i][x_i_size - (size_t)1].loc + splittedResults[i][x_i_size - (size_t)1].len)), (splittedResults[i][x_i_size - (size_t)1].loc + splittedResults[i][x_i_size - (size_t)1].len) });
			}
			splittedResults[i].insert(splittedResults[i].end(), x_i_temp.begin(), x_i_temp.end());
			x_i_temp.clear(); x_i_temp.shrink_to_fit();
		}
	}
}

void Patterns::insert_output() {
	/*
		This function starts a mutex to insert output of this thread to main resource output container
	*/
	mutex m;
	lock_guard<mutex> lockGuard(m);
	Resources::results.insert(Resources::results.end(), output.begin(), output.end());
}

void Patterns::clear_and_shrink() {
	/*
		This function will clear and shrink vectors and other members
	*/
	output.clear(); output.shrink_to_fit();
}