const model = require('../models/models.js');

module.exports.getProducts = (req, res) => {
  let start = 65631;
  let page = Number(req.query.page) || 1;
  let count = Number(req.query.count) || 5;
  model.getProducts(page, count, start)
    .then((data) => {
      res.status(200).json(data.rows)
    })
    .catch((err) => {
      console.log('failed to get related data (controller) - ', err)
      res.sendStatus(404)
    });
}

module.exports.getOneProduct = (req, res) => {
  model.getOneProduct(req.params.product_id)
    .then((data) => {
      res.send(data.rows[0].row_to_json);
    })
    .catch((err) => console.log('failed to get ONE product info (controller) - ', err))
}



module.exports.getRelated = (req, res) => {
  model.getRelated(req.params.product_id)
    .then(data => {
      res.status(200).json(data.rows.flat().map(Number))
    })
    .catch((err) => {
      console.log('failed to get related data (controller) - ', err)
      res.sendStatus(404)
    });
}


module.exports.getStyles = (req, res) => {
  model.getStyles(req.params.product_id)
    .then((data) => {

      let parsed = data.rows.map((style) => {
        style.results.forEach((result) => {
          result['default?'] = result['default?'] ? true : false;
          result.photos.map((photo) => {
            photo.thumbnail_url = photo.thumbnail_url.split("\"")[1]
            photo.url = photo.url.split("\"")[1]
            return photo;
          })
        })
        return style;
      });
      res.status(200).json(data.rows)
    })
    .catch(err => {
      console.log('failed to get product style (controller) - ', err);
      res.sendStatus(404);
    })
}