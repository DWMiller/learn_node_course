const mongoose = require('mongoose');

const Store = mongoose.model('Store');

exports.homepage = (req, res) => {
  console.log(req.name);
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add Store',
  });
};

exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();

  req.flash(
    'success',
    `Successfully Created ${store.name}. Care to leave a review.`
  );

  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // 1. Query database for all stores

  const stores = await Store.find();

  res.render('stores', {
    title: 'Stores',
    stores,
  });
};

exports.editStore = async (req, res) => {
  //Find store, confirm owner, render edit form

  const storeId = req.params.id;

  const store = await Store.findOne({
    _id: storeId,
  });

  res.render('editStore', {
    title: `Edit ${store.name} `,
    store,
  });
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';

  const store = await Store.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    { new: true, runValidators: true }
  ).exec();

  req.flash(
    'success',
    `Successfully updated <strong>${store.name}<strong> 
  <a href="/stores/${store.slug}">View Store -></a>`
  );

  res.redirect(`/stores/${store._id}/edit`);
};
