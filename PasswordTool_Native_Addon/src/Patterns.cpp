#include "Patterns.h"
#include "Constants.h"

void Patterns::pattern(string password) {
	/*
		HERE PROCESSED DATA WILL BE CONVERTED INTO PATTERNS
		STEP 1. SORT DATA
		STEP 2. CALL DIVIDE_PATTERNS() ON DATA TO DIVIDE OVERLAPPING PATTERNS AND ADDRESSING UNDETECTED PART
		STEP 3. SORT DATA ON BASIS OF STRUCT LENGTH ELEMENT
		STEP 4. FORMATTING OUTPUT AND WRITE IT IN A FILE
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
		value_pattern = Constants::outputDelimiter;
		for (size_t j = 0; j < splittedResults[i].size(); j++)
		{
			finalOutputString += splittedResults[i][j].key;
			value_pattern += "\"" + splittedResults[i][j].value + "\"" + Constants::outputDelimiter + Constants::outputLengthDelimiter + to_string(splittedResults[i][j].len) + Constants::outputPositionDelimiter + to_string(splittedResults[i][j].loc) + Constants::outputDelimiter;
		}
		//finalOutputString += "<|>Password: " + password + value_pattern + "\n";
		finalOutputString += Constants::outputDelimiter + password + value_pattern + "\n";
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
		THIS FUNCTION TAKES A VECTOR OF TYPE PATTERNSTRUCTURE AND SORT IT
		ON THE BASIS OF ITS LENGTH ELEMENT
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
		THIS FUNCTION TAKES A VECTOR OF TYPE PATTERNSTRUCTURE AND SORT IT
		ON THE BASIS OF ITS LOCATION ELEMENT
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
		HERE A SINGLE PATTERN GET DIVIDED INTO MULTIPLE IF IT OVERLAPPING ITSELF.
		TO ADDRESS UNDETECTED PART UNDETECTED() WILL CALLED AFTER DIVIDING PATTER IN MULTIPLE PATTERNS
		STEP 1. EVERY PART WILL BE TESTED TO VERIFY LOCATION ATTRIBUTE IS OVERLAPPING OR NOT
		STEP 2. IF SO THEN OVERLAPPING PART WILL BE CALLED REQURSIVLY AND CURRENT PART WILL BE STORED.
		STEP 3. THIS WILL END WITH CALLING UNDETECTED() ON ALL THE PATTERNS.
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
		patternVector.push_back({ Constants::undetectedTag, password, int(password.length()), 0 });
		splittedResults.push_back(patternVector);
	}
}

void Patterns::undetected(string password) {
	/*
		THIS FUNCTION TAKES SPLITTEDRESULTS AND ANALYSE THEIR UNDETECTED PART TO ADD UNDETECTED TAG.
		STEP 1. EVERY PATTERN WILL GO THROUGH FOR LOOP ONE BY ONE
		STEP 2. FOR LOOP HAS 3 IF STATEMENTS TO ADDRESS FRONT - MIDDLE - END PART OF PATTERN
		STEP 3. FIRST IF WILL CHECK IF LOCATION 0 IS AN UNDETECTED PART OR NOT
		STEP 4. SECOND IF WILL RUN A LOOP UNTIL LAST DETECTED PART TO CHECK IF THERE IS AN UNDETECTED
				PART IN MIDDLE
		STEP 5. THIRD IF WILL CHECK IF END OF PASSWORD IS UNDETECTED PART OR NOT
		STEP 6. IF ANY PART OF PASSWORD IS FOUND TO BE UNDETECTED THAN A TAG WILL WE ADDED TO THAT 
				LOCATION.
	*/
	if (splittedResults.size() != 0) {
		int p_size = (int)password.length();
		vector<Resources::patternStructure> x_i_temp;
		for (size_t i = 0; i < splittedResults.size(); i++) {
			int x_i_size = (int)splittedResults[i].size();
			if (splittedResults[i][0].loc != 0) {
				x_i_temp.push_back({ Constants::undetectedTag, password.substr(0, splittedResults[i][0].loc), splittedResults[i][0].loc, 0 });
			}
			for (int j = 0; j < x_i_size - 1; j++) {
				if ((splittedResults[i][j + (size_t)1].loc - (splittedResults[i][j].loc + splittedResults[i][j].len - 1) - 1) > 0) {
					x_i_temp.push_back({ Constants::undetectedTag, password.substr(((size_t)splittedResults[i][j].loc + (size_t)splittedResults[i][j].len), ((size_t)splittedResults[i][j + (size_t)1].loc - ((size_t)splittedResults[i][j].loc + (size_t)splittedResults[i][j].len - (size_t)1) - (size_t)1)), (splittedResults[i][j + (size_t)1].loc - (splittedResults[i][j].loc + splittedResults[i][j].len - 1) - 1), (splittedResults[i][j].loc + splittedResults[i][j].len) });
				}
			}
			if ((splittedResults[i][x_i_size - (size_t)1].loc + splittedResults[i][x_i_size - (size_t)1].len) != p_size) {
				x_i_temp.push_back({ Constants::undetectedTag, password.substr(((size_t)splittedResults[i][x_i_size - (size_t)1].loc + (size_t)splittedResults[i][x_i_size - (size_t)1].len), (p_size - ((size_t)splittedResults[i][x_i_size - (size_t)1].loc + (size_t)splittedResults[i][x_i_size - (size_t)1].len))), (p_size - (splittedResults[i][x_i_size - (size_t)1].loc + splittedResults[i][x_i_size - (size_t)1].len)), (splittedResults[i][x_i_size - (size_t)1].loc + splittedResults[i][x_i_size - (size_t)1].len) });
			}
			splittedResults[i].insert(splittedResults[i].end(), x_i_temp.begin(), x_i_temp.end());
			x_i_temp.clear(); x_i_temp.shrink_to_fit();
		}
	}
}

void Patterns::insert_output() {
	/*
		THIS FUNCTION STARTS A MUTEX TO INSERT OUTPUT OF THIS THREAD TO MAIN RESOURCE OUTPUT CONTAINER
	*/
	lock_guard<mutex> lockGuard(Resources::resultsMutex);
	Resources::results.insert(Resources::results.end(), output.begin(), output.end());
}

void Patterns::clear_and_shrink() {
	/*
		THIS FUNCTION WILL CLEAR AND SHRINK VECTORS AND OTHER MEMBERS
	*/
	output.clear(); output.shrink_to_fit();
}