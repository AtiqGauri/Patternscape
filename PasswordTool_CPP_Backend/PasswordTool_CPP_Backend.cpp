#include <iostream>
#include"APILayer.h"

/*
IMPORTANT
************************************
PROJECT SETTINGS
************************************
1. Project -> Project Properties -> C/C++ -> Language -> C++ Language Standard -> std:c++latest

2. SET PROJECT IN DEBUG TO RELEASE MODE

3. SET ARCH TO 64X (OPTIONAL)
*/


int main()
{
	auto start = APILayer::time_stamp();
	//APILayer::main_program(4);
	APILayer::pattern_stats(2);
	//string str = APILayer::process_target("idontknowthatyet", "");
	//cout << "\n" << str << "\n";
	
	/*
	vector<string> vec;
	FileHandler::read_file(vec, "data/Stats/Patterns Data/Common1.txt");
	DataCleanser::remove_vector_duplicates(vec);
	FileHandler::write_file(vec, "out.txt");
	*/
	auto stop = APILayer::time_stamp();
	cout << "Program RunTime:  "; APILayer::time_elapsed(start, stop);
	
	int i; cin >> i;
	return 0;
}