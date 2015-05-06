let env = process.env.NODE_ENV || 'development'

let config = {
  development: require('./development'),
  production: require('./production')
}

export default config[env]
