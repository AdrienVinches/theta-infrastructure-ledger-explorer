var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var helper = require('../helper/utils');


var tokenRouter = (app, tokenDao, tokenSumDao) => {
  router.use(bodyParser.urlencoded({ extended: true }));

  // The api to get token summary
  router.get("/tokenSummary/:address", (req, res) => {
    let address = helper.normalize(req.params.address.toLowerCase());
    if (!helper.validateHex(address, 40)) {
      res.status(400).send({ type: 'invalid_address' })
      return;
    }
    const { tokenId } = req.query;
    console.log('Querying the token summary.');
    if (tokenId !== undefined) {
      tokenDao.getRecordsNumberByAddressAndTokenIdAsync(address, tokenId)
        .then(num => {
          const data = ({
            "type": "token_number",
            body: { "total_transfers": num },
          })
          res.status(200).send(data);
        })
    } else {
      tokenSumDao.getInfoByAddressAsync(address)
        .then(result => {
          if (result === null) {
            res.status(404).send({
              type: 'error_not_found',
            });
            return;
          }
          const data = ({
            "type": "token_info",
            body: {
              "name": result.name,
              "holders": Object.keys(result.holders).length,
              "max_total_supply": result.max_total_supply,
              "total_transfers": result.total_transfers,
            }
          })
          res.status(200).send(data);
        })
    }
  });

  // The api to get token info
  router.get("/token/:address", (req, res) => {
    let address = helper.normalize(req.params.address.toLowerCase());
    if (!helper.validateHex(address, 40)) {
      res.status(400).send({ type: 'invalid_address' })
      return;
    }
    const { tokenId } = req.query;
    console.log('Querying the token info.');
    tokenDao.getInfoListByAddressAndTokenIdAsync(address, tokenId, 0, 0)
      .then(info => {
        const data = ({
          "type": "token_info",
          body: info,
        })
        res.status(200).send(data);
      })
  });

  //the / route of router will get mapped to /api
  app.use('/api', router);
}

module.exports = tokenRouter;