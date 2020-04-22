const express = require('express');
const router = express.Router();
// var RutrackerApi = require('rutracker-api');
// const Rutracker = require('rutracker-api');
const RutrackerApi = require('../src/rutrackerAPI');

router.get('/', function (req, res, next) {
    const rutracker = new RutrackerApi();

    const {username, password, cap_code_name, cap_code_value, cap_sid} = req.query;
    const cap = cap_code_name ? {
        cap_sid: cap_sid,
        [cap_code_name]: cap_code_value
    } : null;

    // login

    if (!username) {
        res.send("NO_USERNAME");
    } else if (!password) {
        res.send("NO_PASSWORD");
    } else {
        rutracker.login(username, password, cap)
            .then((status) => {
                res.send(status);

                // search
                // rutracker.search('Adobe Photoshop').exec()
                //     .then((results) => {
                //         console.log(results);
                //         res.send(results);
                //     })
            })
            .catch((err) => {
                res.send(err);
            });
    }

    // login Captcha
    // rutracker.login(username, password, {
    //     cap_sid: '3DLjkXyRdgl5kJlub15B',
    //     cap_code_328089da9af21e7640cb80a09dc4cbe2: 'mg29' //captcha code
    // })


    // var rutracker = new RutrackerApi();
    // rutracker.login({username, password})
    //     .then(() => {
    //         console.log(true);
    //         res.send(true);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.send(false)
    //     });

    // rutracker.login({username, password})
    //     .then(() =>
    //         rutracker.search({query: 'Adobe Photoshop', sort: 'size'})
    //     )
    //     .then(torrents => {
    //         console.log(torrents);
    //         res.send(torrents)
    //     });

});

module.exports = router;