const storeModel = require('../../../modules/storeModel')
const factory = require('../../handleFactor/handlerFactory')

// @ dec update  store data
// @ route put  /api/vi/store/:storeId
// @ access protected/store owner
exports.updateStore = factory.updateOne(storeModel, 'store')