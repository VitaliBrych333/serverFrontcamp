const express = require('express');
const asyncHandler = require('../handdleMidleware/utils');
// const fs = require('fs');
const newsModel = require('../models/news-model');
const router = new express.Router();
const passport = require('passport');
// const uniqid = require('uniqid');
// const dbNews = require('../db.json/news.json');
const logger = require('../logger/logger');
const authenticate = passport.authenticate('local', {session: true});
router.get(
    '/news',
    asyncHandler(async (req, res, next) => { 
        const news = await newsModel.find({}).exec();
        logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
        res.json(news);
        res.end(); 
        // const news = fs.readFileSync('./db.json/news.json');
        // const data = JSON.parse(news)['news'].map(news => {
        //     let obj = {};
        //     obj.title = news['title'];
        //     return obj;
        // });

        // console.log(`${req.method} - ${req.url}`, data);
        // logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
        // res.send(data);
        // res.end();
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
       
        // const id = req.params.id;
        // const news = fs.readFileSync('./db.json/news.json');
        // const data = JSON.parse(news)['news'].find(news => news['id'] === id);

        // if (data) {
        //     console.log(`${req.method} - ${req.url}`, data);
        //     logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
        //     res.send(data);
        //     res.end();
        // } else {
        //     throw new Error('Not found!');
        // }
    })
);

router.post(
    '/news',
    asyncHandler(async (req, res, next) => {
        const content = req.body;
        if (!content['title']) {
            throw new Error('Did not set the title!');
        }

        logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});

        await newsModel.create(content, (err) => {
            if (err) throw new Error(`${err}`);
            res.end();
        });
        // const content = req.body;

        // if (!content['title']) {
        //     throw new Error('Did not set the title!');
        // }
        // const news = fs.readFileSync('./db.json/news.json');

        // let data = JSON.parse(news);   

        // const newNews = {
        //     id: uniqid(),
        //     title: content['title'],
        // }
      
        // data['news'].push(newNews);

        // fs.writeFileSync('./db.json/news.json', JSON.stringify(data, null, 4));

        // console.log(`${req.method} - ${req.url}`, content);
        // logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
        // res.send('Recorded successfully');
        // res.end();
    })
);

router.put(
    '/news/:id',
    // isLoggedIn,
    asyncHandler(async (req, res, next) => {
        console.log('tttttttt' , req.isAuthenticated)
        if (req.isAuthenticated()) {
            const id = req.params.id;

            logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
    
            await newsModel.findByIdAndUpdate(id, {$set: req.body}, (err) => {
                if (err) throw new Error(`${err}`);
                res.end();
            });
        
        } else {
            res.send('YOU not autorized');
            res.end();
        }
        
        // const id = req.params.id;
        // const content = req.body;

        // const news = fs.readFileSync('./db.json/news.json');

        // let data = JSON.parse(news);
        
        // const num = data['news'].findIndex((elem) => elem['id'] === id);

        // if (num !== -1) {
        //     data['news'][num]['title'] = content['title'];
        //     fs.writeFileSync('./db.json/news.json', JSON.stringify(data, null, 4));

        //     console.log(`${req.method} - ${req.url}`, content);
        //     logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
        //     res.send('Update successfully');
        //     res.end();
        // } else {
        //     throw new Error('Not found!');
        // }
    })
);

router.delete(
  '/news/:id',
  
  asyncHandler(async (req, res, next) => {
        const id = req.params.id;

        logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});

        await newsModel.findByIdAndDelete(id, (err, field) => {
            if (err) throw new Error(`${err}`);
            res.send(field);
        });
    //   const id = req.params.id;
    //   const news = fs.readFileSync('./db.json/news.json');

    //   let data = JSON.parse(news);

    //   const num = data['news'].findIndex((elem) => elem['id'] === id);

    //   if (num !== -1) {
    //       data['news'] = data['news'].filter(news => news['id'] !== id);
    //       fs.writeFileSync('./db.json/news.json', JSON.stringify(data, null, 4));

    //       console.log(`${req.method} - ${req.url}`, data);
    //       logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
    //       res.send('Delete successfully');
    //       res.end();
    //   } else {
    //       throw new Error('Not found!');
    //   }
  })
)

// router.all(
//   '/*',
//   asyncHandler(async (req, res, next) => {
//       const news = await newsModel.find({}).exec();
//       logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
//       res.json(news);
//       res.end(); 

//     //   console.log(`${req.method} - ${req.url}`, dbNews);
//     //   logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});
//     //   res.send(dbNews);
//     //   res.end();
//   }),
// );
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/authorization');
    }
}

module.exports = router;
