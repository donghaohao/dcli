#!/usr/bin/env node
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const fs = require('fs')
const handlebars = require('handlebars')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')
const shell = require("shelljs")
const { info, repos } = require('./info')

program
  .version(require('./package').version, '-v, --version')
  .command('init <name>')
  .description('create a new project')
  .alias('i')
  .action(name => {
    if (fs.existsSync(name)) {
      console.log(symbols.error, chalk.red(`${name} is already exist`))
      process.exit(1)
    }
    inquirer.prompt(info.step1)
    .then(res => {
      const spinner = ora(`Downloading ${res.repo}`)
      spinner.start()
      download(repos[res.repo], name, err => {
        if (err) {
          spinner.fail();
          console.log(symbols.error, chalk.red(err))
        } else {
          spinner.succeed()
          const fileName = `${name}/package.json`
          const meta = {
            name,
            description: res.description,
            author: res.author
          }
          if (fs.existsSync(fileName)) {
            const content = fs.readFileSync(fileName).toString()
            const result = handlebars.compile(content)(meta)
            fs.writeFileSync(fileName, result)
          }
          console.log(symbols.success, chalk.green(`The project ${name} has been created successfully!`))
          inquirer.prompt(info.step2)
          .then(res => {
            if (res.choice) {
              let spinner = ora('Installing...')
              spinner.start()
              shell.exec("cd " + name + " && npm i", function (err) {
                if (err) {
                  spinner.fail()
                  console.log(symbols.error, chalk.red(err))
                } else {
                  spinner.succeed()
                  console.log(symbols.success, chalk.green('The dependence has installed successfully!'))
                }
              })
            } else {
              console.log(symbols.success, chalk.green('You should install the dependence manually'))
            }
          })
        }
      })
    })
  })

program.parse(process.argv)
