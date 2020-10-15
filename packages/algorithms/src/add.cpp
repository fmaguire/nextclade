#include <emscripten/bind.h>

#include <exception>
#include <string>


struct Foo {// NOLINT(cppcoreguidelines-pro-type-member-init)
  double bar;
};


struct Person {// NOLINT(cppcoreguidelines-pro-type-member-init)
  std::string name;
  int age;
  Foo foo;
};


int add(int x, int y) {
  return x + y;
}

std::string concat(const std::string& x, const std::string& y) {
  return x + y;
}

emscripten::val getObject() {
  auto obj = emscripten::val::object();
  obj.set("foo", 42);// NOLINT(cppcoreguidelines-avoid-magic-numbers)
  obj.set("bar", "Hello");

  const auto v = std::vector<int>({1, 2, 3});
  const auto arr = emscripten::val::array(v);
  obj.set("arr", arr);

  return obj;
}

Person getPerson() {
  return {.name = "Bob", .age = 33, .foo = {.bar = 3.1415}};// NOLINT(cppcoreguidelines-avoid-magic-numbers)
}

std::string toString(const Person& p) {
  return "Person: " + std::string(p.name) + " | " + std::to_string(p.age) + " | " + std::to_string(p.foo.bar);
}

void kaboom() {
  throw std::runtime_error("Error: in " + std::string(__FILE__) + ":" + std::to_string(__LINE__) + ": kaboom!");
}

std::string getExceptionMessage(std::intptr_t exceptionPtr) {// NOLINT(misc-unused-parameters)
  // NOLINTNEXTLINE(cppcoreguidelines-pro-type-reinterpret-cast,cppcoreguidelines-init-variables)
  const std::exception* e = reinterpret_cast<std::runtime_error*>(exceptionPtr);
  return e->what();
}


// NOLINTNEXTLINE(cert-err58-cpp,cppcoreguidelines-avoid-non-const-global-variables)
EMSCRIPTEN_BINDINGS(add) {
  emscripten::function("add", &add);
  emscripten::function("concat", &concat);
  emscripten::function("getObject", &getObject);

  emscripten::function("getPerson", &getPerson);
  emscripten::function("toString", &toString);

  emscripten::value_object<Foo>("Foo").field("bar", &Foo::bar);
  emscripten::value_object<Person>("Person")
          .field("name", &Person::name)
          .field("age", &Person::age)
          .field("foo", &Person::foo);

  emscripten::function("kaboom", &kaboom);
  emscripten::function("getExceptionMessage", &getExceptionMessage);
}