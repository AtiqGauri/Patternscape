#include <napi.h>
#include <iostream>
#include <string>
#include <vector>
#include <fstream>

using namespace std;

namespace functionexample {

  	std::string stats_generator_api(int threadN);
  	Napi::String stats_generator_wrapped(const Napi::CallbackInfo& info);
  
  	int analyze_data_api(int a, int b);
  	Napi::Number analyze_data_wrapped(const Napi::CallbackInfo& info);



  	Napi::Object Init(Napi::Env env, Napi::Object exports);
  	NODE_API_MODULE(taddon, Init)
}