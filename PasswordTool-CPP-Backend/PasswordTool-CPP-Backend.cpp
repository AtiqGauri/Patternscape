#include <iostream>
#include"APILayer.h"

int main()
{

	auto start = APILayer::time_stamp();
	APILayer::main_program(4);
	//APILayer::pattern_stats(2);
	auto stop = APILayer::time_stamp();
	cout << "Program RunTime:  "; APILayer::time_elasped(start, stop);

	int i; cin >> i;
	return 0;
}