test("", async () => {
  const obj = {
    hello: "bye",
  };

  const fn_ = (obj: any) => () => {
    return obj.hello;
  };

  const fn = fn_(obj);

  expect(fn()).toEqual("bye");

  obj.hello = "hello";

  expect(fn()).toEqual("hello");
});
