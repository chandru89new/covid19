const terminal = require("child_process").execSync;
const commands = [
  "cd origin && git pull origin master",
  "cd data && node compute",
  "git commit data",
  'git commit -m "data update"',
  "git push origin master"
];

const newLine = () => console.log("\n");

const runCommands = list => {
  while (list.length) {
    const a = list.shift();
    try {
      newLine();
      console.log(`>--------- ${a} ----------<`);
      terminal(a, { encoding: "utf-8" });
      console.log(`> ${a} success`);
    } catch (e) {
      console.log(`${a} failed with this message: ----->`);
      console.log(`--------`);
      console.log(e.output.join(""));
      console.log(`--------`);
      process.exit(1);
    }
  }
  console.log(`--------- DONE ------------`);
};

runCommands(commands);
