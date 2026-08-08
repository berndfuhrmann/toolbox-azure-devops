// prettier-format.js
const prettier = require("prettier");

let input = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => input += chunk);
process.stdin.on("end", () => {
  try {
    const formatted = prettier.format(input, { parser: "typescript" });
    process.stdout.write(formatted);
  } catch (e) {
    process.stderr.write("Prettier error: " + e.message);
    process.exit(1);
  }
});