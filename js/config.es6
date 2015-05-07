import { merge } from 'lodash'

let config = {}

config.development = {
  db: {
    autosave: true,
    autosaveInterval: 10000,
    name: 'photostream'
  },
  pic: {
    host: '',
    rootDir: 'pics/'
  },
  picsService: {
    refreshProof: false
  },
  picsEndpoint: {
    defaultFolder: 'photos'
  }
}

config.test = merge({}, config.development, {
  db: {
    autosave: false,
    name: 'test'
  },
  picsEndpoint: {
    defaultFolder: ''
  }
})

config.production = merge({}, config.development, {
  pic: {
    rootDir: '/mnt/photostream/'
  },
  picsService: {
    refreshProof: true
  },
  picsEndpoint: {
    defaultFolder: 'syncable'
  }
})

export default config[process.env.NODE_ENV || 'development']
