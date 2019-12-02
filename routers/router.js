const express = require('express');
const asyncHandler = require('../handdleMidleware/utils');
const newsModel = require('../models/news-model');
const router = new express.Router();
const logger = require('../logger/logger');

const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send('YOU not autorized');
        res.end();
        //or    return res.redirect('/authorization');
    }
};

router.get(
    '/logout',
    asyncHandler(async (req, res, next) => {
        logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
        req.logout();
        req.session.destroy(() => {
            res.redirect('/authorization');
        });
    })
);

router.get(
    '/news',
    asyncHandler(async (req, res, next) => { 
        const news = await newsModel.find({}).exec();
        logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
        res.json(news);
        res.end(); 
    })
);

router.get(
    '/news/:id',
    asyncHandler(async (req, res, next) => {
        const id = req.params.id;

        const news = await newsModel.findById(id).exec();
        if (news) {
            logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
            res.json(news);
            res.end();
        } else {
            throw new Error('Not found!');
        }
    })
);

router.post(
    '/news',
    asyncHandler(async (req, res, next) => {
        logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
        const content = req.body;

        if (!content['title']) {
            throw new Error('Did not set the title!');
        }

        await newsModel.create(content, (err) => {
            if (err) throw new Error(`${err}`);
            res.end();
        });
    })
);

router.put(
    '/news/:id',
    auth,
    asyncHandler(async (req, res, next) => {
        logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});

        const id = req.params.id;

        await newsModel.findByIdAndUpdate(id, {$set: req.body}, (err) => {
            if (err) throw new Error(`${err}`);
            res.end();
        });
    })
);

router.delete(
  '/news/:id',
  auth,
  asyncHandler(async (req, res, next) => {
        const id = req.params.id;

        logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});

        await newsModel.findByIdAndDelete(id, (err, field) => {
            if (err) throw new Error(`${err}`);
            res.send(field);
        });
  })
)

// router.all(
//   '/*',
//   asyncHandler(async (req, res, next) => {
//       logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});

//       const news = await newsModel.find({}).exec();
      
//       res.json(news);
//       res.end(); 
//   }),
// );

module.exports = router;