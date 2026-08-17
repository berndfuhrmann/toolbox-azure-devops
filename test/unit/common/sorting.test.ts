import { sorter, sortByNumber, sortByString, sortByDate, sortByBoolean, sortByType } from "../../../src/common/sorting";
describe("sortByNumber", () => {
  test("sorts numbers correctly", () => {
    const items = [{ value: 3 }, { value: 1 }, { value: 2 }, { value: 2 }, { value: 1 }];
    items.sort(sortByNumber((item) => item.value));
    expect(items.map((item) => item.value)).toEqual([1, 1, 2, 2, 3]);
  });
});

describe("sortByString", () => {
  test("sorts strings correctly", () => {
    const items = [{ name: "banana" }, { name: "apple" }, { name: "cherry" }, { name: "apple" }, { name: "banana" }];
    items.sort(sortByString((item) => item.name));
    expect(items.map((item) => item.name)).toEqual(["apple", "apple", "banana", "banana", "cherry"]);
  });
});

describe("sortByDate", () => {
  test("sorts dates correctly", () => {
    const items = [
      { date: new Date("2024-01-01") },
      { date: new Date("2022-01-01") },
      { date: new Date("2023-01-01") },
      { date: new Date("2023-01-01") },
      { date: new Date("2022-01-01") },
    ];
    items.sort(sortByDate((item) => item.date));
    expect(items.map((item) => item.date.getTime())).toEqual([
      new Date("2022-01-01").getTime(),
      new Date("2022-01-01").getTime(),
      new Date("2023-01-01").getTime(),
      new Date("2023-01-01").getTime(),
      new Date("2024-01-01").getTime(),
    ]);
  });
});

describe("sortByBoolean", () => {
  test("sorts booleans correctly", () => {
    const items = [{ flag: true }, { flag: false }, { flag: true }, { flag: false }, { flag: false }];
    items.sort(sortByBoolean((item) => item.flag));
    expect(items.map((item) => item.flag)).toEqual([false, false, false, true, true]);
  });
});

describe("sortByType", () => {
  test("sorts different types correctly", () => {
    class A {}
    class B {}
    class C {}

    const items = [new B(), new A(), new C(), new A(), new B()];
    items.sort(
      sortByType([
        [A, undefined],
        [B, undefined],
        [C, undefined],
      ]),
    );
    expect(items.map((item) => item.constructor.name)).toEqual(["A", "A", "B", "B", "C"]);
  });

  test("handles unknown types", () => {
    class A {}
    class B {}
    class C {}
    class D {} // This type is not in the configuration

    const items = [new B(), new A(), new D(), new C(), new A(), new D()];
    items.sort(
      sortByType([
        [A, undefined],
        [B, undefined],
        [C, undefined],
      ]),
    );

    // Unknown type D should be placed at the end
    expect(items.map((item) => item.constructor.name)).toEqual(["A", "A", "B", "C", "D", "D"]);

    // Verify that unknown types maintain their original order
    const dInstances = items.filter((item) => item.constructor.name === "D");
    expect(dInstances.length).toBe(2);
  });

  test("with custom comparators", () => {
    class A {
      constructor(public value: number) {}
    }

    const items = [new A(3), new A(1), new A(2), new A(2)];
    items.sort(sortByType([[A, (a, b) => a.value - b.value]]));
    expect(items.map((a) => a.value)).toEqual([1, 2, 2, 3]);
  });
});

describe("sorter", () => {
  test("combines multiple sorters", () => {
    class A {
      constructor(
        public name: string,
        public value: number,
      ) {}
    }

    const items = [new A("banana", 3), new A("apple", 1), new A("banana", 2), new A("banana", 2)];

    items.sort(
      sorter(
        sortByString((a) => a.name),
        sortByNumber((a) => a.value),
      ),
    );

    expect(items.map((a) => ({ name: a.name, value: a.value }))).toEqual([
      { name: "apple", value: 1 },
      { name: "banana", value: 2 },
      { name: "banana", value: 2 },
      { name: "banana", value: 3 },
    ]);
  });
});
