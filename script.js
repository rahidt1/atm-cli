// 1. Ask for account
// 2. If account does not exist ask to create account
// 3. Ask what they want to do
// 4. Execute command
//   a. View
//   b. Withdraw
//   c. Deposit

const { compileFunction } = require("vm");
const Account = require("./Account");
const CommandLine = require("./CommandLine");

// Helper function
/////////////////////////////////////////////////////

// Create new account
const promptCreateAccount = async function (accountName) {
  const response = await CommandLine.ask(
    "Account does not exist. Would you like to create one? (yes/no) "
  );

  if (response === "yes") return await Account.create(accountName);
  else throw new Error("Thanks for being with us.");
};

// Handle account related task
const promptTask = async function (account) {
  const response = await CommandLine.ask(
    "What would you like to do? (view/deposit/withdraw) "
  );

  // Deposit money
  if (response === "deposit") {
    const amount = parseFloat(await CommandLine.ask("How much? "));
    await account.deposit(amount);
  }

  // Withdraw money
  else if (response === "withdraw") {
    const amount = parseFloat(await CommandLine.ask("How much? "));

    try {
      await account.withdraw(amount);
    } catch (e) {
      CommandLine.print("Not enough money.");
    }
  }

  CommandLine.print(`Your balance is ${account.balance}`);
};

// Main
/////////////////////////////////////////////////////
const main = async function () {
  try {
    const accountName = await CommandLine.ask(
      "Which account would you like to access? "
    );

    const account = await Account.find(accountName);

    // If no account ask to create
    if (!account) account = await promptCreateAccount(accountName);

    // If account exists, ask what to do
    if (account) await promptTask(account);
  } catch (e) {
    CommandLine.print("ERROR: Please try again.");
  }
};

main();
