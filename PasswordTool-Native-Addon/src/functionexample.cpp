#include "functionexample.h"
#include "APILayer.h"

//Working
std::string functionexample::stats_generator_api(int threadN){
	APILayer::pattern_stats(threadN);
	string s ="Stats Generated";
  	return s;
}

Napi::String functionexample::stats_generator_wrapped(const Napi::CallbackInfo& info)
{
  Napi::Env env = info.Env();

  if(info.Length()<1 || !info[0].IsNumber()){
	Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }

  Napi::Number first = info[0].As<Napi::Number>();
  
  Napi::String returnValue = Napi::String::New(env, functionexample::stats_generator_api(first.Int32Value()));
  
  return returnValue;
}

//Argument
int functionexample::analyze_data_api(int a, int b){
	APILayer::main_program(a);
  	return a + b;
}

Napi::Number functionexample::analyze_data_wrapped(const Napi::CallbackInfo& info){
	Napi::Env env = info.Env();
	
	if(info.Length()<2 || !info[0].IsNumber() || !info[1].IsNumber()){
		Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
	}

	Napi::Number first = info[0].As<Napi::Number>();
	Napi::Number second = info[1].As<Napi::Number>();

	int returnValue = functionexample::analyze_data_api(first.Int32Value(), second.Int32Value());

	return Napi::Number::New(env, returnValue);
}



//API function
Napi::Object functionexample::Init(Napi::Env env, Napi::Object exports) 
{
  exports.Set("stats_generator_api", Napi::Function::New(env, functionexample::stats_generator_wrapped));
  exports.Set("analyze_data_api", Napi::Function::New(env, functionexample::analyze_data_wrapped));

  return exports;
}