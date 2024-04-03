// modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// modulos internos
const fs = require('fs');

operation()

function operation() {

  inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'what do you want to do?',
    choices: [
      'Create account',
      'Check your balance',
      'Deposit',
      'Withdraw',
      'exit']
    },
  ])
  .then((answer) => {

    const action = answer['action']

    if(action === 'Create account') {
      createAccount()
    } else if(action === 'Check your balance') {
      checkBalance()
    } else if(action === 'Deposit') {
      depositBalance()
    } else if(action === 'Withdraw') {
      withdrawBalance()
    } else if(action === 'exit') {
      console.log(chalk.bgBlue.black('Thanks for using Accounts!'))
      process.exit()
    }
  })
  .catch((err) => console.log(err))
}

//create an account
function createAccount() {
  console.log(chalk.bgGreen.bold.black('Thanks for chosing our bank!'))
  console.log(chalk.green('Define your account options bellow'))
  buildAccount()
}

function buildAccount() {

  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Type a name for your account:'
    },
]).then(answer => {
    const accountName = answer['accountName']
    console.info(accountName);

    if (!fs.existsSync('accounts')) {
      fs.mkdirSync('accounts')
    }

    if (fs.existsSync(`accounts/${accountName}.json`)) {
      console.log(chalk.bgRed.bold.black('This account aready exists, choose another name!')
      )
      buildAccount()
      return
    }

    fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function(err) {
      console.log(err);
    })
    console.log(chalk.green('Congratulations! Your account was been created!'));
    operation()
  }).catch((err) => console.log(err))
}

// add an amount to user account
function depositBalance() {

  inquirer.prompt([
    {
      name: 'accountName',
      message: 'What is your account name?'
    }
  ])
  .then((answer) => {

    const accountName = answer['accountName']
    // verify if the account exists
    if(!checkIfAccountExists(accountName)) {
      return depositBalance()
    }

    inquirer.prompt([
      {
        name: "amount",
        message: "how much do you want to deposit?"
      }
    ])
    .then((answer) => {

      const amount = answer['amount']

      //add na amount
      addAmount(accountName, amount)
      operation()

    })
    .catch((err) => console.log(err))

  })
  .catch((err) => console.log(err))
}

function checkIfAccountExists(accountName) {

  // function to verify if the account exists
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black(`This account doesn't exists, try again!`))
    return false
  }
  return true
}

function addAmount(accountName, amount) {

  const accountData = getAccount(accountName)

  if(!amount) {
    console.log(chalk.bgRed.black('An error as ocurred, try again later!'));
    return depositBalance()
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    },
  )

  console.log(chalk.green(`The deposit in value of R$${amount} has been done sucessfuly!`))
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf-8',
    flag: 'r'
  })

  return JSON.parse(accountJSON)
}


function checkBalance() {

  inquirer.prompt([
    {
      name: 'accountName',
      message: 'What is your account name?'
    }
  ])
  .then((answer) => {
    const accountName = answer['accountName']

    // verify if the account exists
    if(!checkIfAccountExists(accountName)) {
      return checkBalance()
    }
    // say the account balance
    const accountData = getAccount(accountName)
    console.log(chalk.bgBlue.black(`Your account balance is: R$${accountData.balance}`));
    operation()
  })
  .catch((err) => console.log(err))
}

// get an amount
function withdrawBalance() {

  inquirer.prompt([
    {
      name: 'accountName',
      message: 'What is your account name?'
    }
  ])
  .then((answer) => {

    const accountName = answer['accountName']
    // verify if the account exists
    if(!checkIfAccountExists(accountName)) {
      return withdrawBalance()
    }

    inquirer.prompt([
      {
        name: "amount",
        message: "how much do you want to withdraw?"
      }
    ])
    .then((answer) => {

      const amount = answer['amount']

      removeAmount(accountName, amount)

    })
    .catch((err) => console.log(err))

  })
  .catch((err) => console.log(err))
}

function removeAmount(accountName, amount) {

  const accountData = getAccount(accountName)

  if(!amount) {
    console.log(chalk.bgRed.black('An error as ocurred, try again later!'));
    return withdrawBalance()
  }

  if(accountData.balance < amount) {
    console.log(chalk.bgRed.black(`You only have ${accountData.balance} in your account`));
    return withdrawBalance()
  }
  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    },
  )

  console.log(chalk.green(`The withdraw in value of R$${amount} has been done sucessfuly!`)
  )
  operation()
}
