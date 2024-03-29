'use strict';

var Treasure = require('../models/treasure'),
    mp       = require('multiparty');

exports.init = function(req, res){
  res.render('treasures/init');
};

exports.index = function(req, res){
  var query = {};
  if (req.query.tag) {
    query = { tags: { $in: [ req.query.tag ] } };
  }
  var sortby = {};
  sortby[req.query.sortby] = 1;
  Treasure.find(query, sortby, function(err, treasures){
    res.render('treasures/index', {treasures:treasures});
  });
};

exports.create = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    var t = {
      name: fields.name[0],
      loc: {
        name: fields.loc[0],
        lat: fields.lat[0],
        lng: fields.lng[0]
      },
      order: fields.order[0],
      difficulty: fields.difficulty[0],
      hint: fields.hint[0],
      tags: fields.tags[0]
    },
    treasure = new Treasure(t);
    treasure.save(function(){
      treasure.uploadPhotos(files, function(){
        res.redirect('/treasures');
      });
    });
  });
};

exports.show = function(req,res){
  Treasure.findById(req.params.id, function(treasure){
    res.render('treasures/show', {treasure:treasure});
  });
};

exports.toggleFound = function(req, res){
  Treasure.findById(req.params.id, function(treasure){
    treasure.toggleFound();
    treasure.save(function(){
      res.redirect('/treasures');
    });
  });
};
