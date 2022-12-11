const { rejects } = require("assert");
const { resolve } = require("path");
const FileSystem = require("./FileSystem");

module.exports = class Account {
  #name;
  #balance;

  constructor(name) {
    this.#name = name;
  }

  get name() {
    return this.#name;
  }
  get balance() {
    return this.#balance;
  }

  get filePath() {
    return `accounts/${this.#name}.txt`;
  }

  // Load balance from FileSystem
  async #load() {
    this.#balance = parseFloat(await FileSystem.read(this.filePath));
  }

  // Deposit money
  async deposit(amount) {
    await FileSystem.write(this.filePath, this.#balance + amount);
    this.#balance = this.#balance + amount;
  }

  // Withdraw money
  async withdraw(amount) {
    if (this.balance < amount) throw new Error("Not enough balance");

    await FileSystem.write(this.filePath, this.#balance - amount);
    this.#balance = this.#balance - amount;
  }

  // Find account
  static async find(accountName) {
    const account = new Account(accountName);

    try {
      await account.#load();
      return account;
    } catch (e) {
      return;
    }
  }

  // Create new Account
  static async create(accountName) {
    const account = new Account(accountName);

    await FileSystem.write(account.filePath, 0);
    account.#balance = 0;

    return account;
  }
};
