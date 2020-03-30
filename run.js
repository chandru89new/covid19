const terminal = require("child_process").execSync;
const COMMANDS_METRICS = [
  "cd origin && git pull origin master",
  "cd data && node compute",
  "git add data",
  'git commit -m "data update"',
  "git push origin master"
];
const COMMANDS_WEBSITE = [
  "cd web && parcel build index.html",
  "cd web && firebase deploy"
];

const newLine = () => console.log("\n");

// type runType = "data" | "website"

const main = () => {
  const runType = process.argv[2];
  run(runType);
};

const run = runType => {
  switch (runType) {
    case "data":
      runCommands(COMMANDS_METRICS)();
      break;
    case "website":
      runCommands(COMMANDS_WEBSITE);
      break;
    default:
      return console.log("No run type given.");
  }
};

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

main(process.argv[2]);
