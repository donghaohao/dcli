const step1 = [{
  name: 'description',
  message: 'type the project description'
}, {
  name: 'author',
  message: 'type the project author'
}, {
  type: 'list',
  name: 'repo',
  message: 'choose a repo',
  choices: ['vue', 'vue-mutipage']
}]
const step2 = [{
  type: 'confirm',
  name: 'choice',
  message: 'Do you want to install dependence right now?',
  default: true
}]

const repos = {
  vue: 'donghaohao/vue-webpack',
  'vue-mutipage': 'donghaohao/vue-multi-page-webpack'
}
module.exports = {
  info: {
    step1,
    step2,
  },
  repos,
}
