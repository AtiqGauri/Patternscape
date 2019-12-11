#include <iostream>
#include"APILayer.h"

/*
************************************
PROJECT SETTINGS
************************************
1. Project -> Project Properties -> C/C++ -> Language -> C++ Language Standard -> std:c++latest

2. Set Project in Debug to Release mode

3. Set Arch to 64x (optional)
*/


int main()
{

	auto start = APILayer::time_stamp();
	//APILayer::main_program(6);
	//APILayer::pattern_stats(2);
	string str = APILayer::process_target("iloveapeksha@9814", "");
	cout << "\n" << str << "\n";
	auto stop = APILayer::time_stamp();
	cout << "Program RunTime:  "; APILayer::time_elasped(start, stop);
	
	/*
	Resources::read_resources();
	Comparison c;
	c.Comparison::name_list_comparison("iloveapeksha@9814");
	*/
	
	int i; cin >> i;
	return 0;
}