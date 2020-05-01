const express = require('express');
const router = express.Router();
const RutrackerApi = require('../src/RutrackerApi');

router.get('/', function (req, res, next) {
    const rutracker = new RutrackerApi();

    const {username, password, cap_code_name, cap_code_value, cap_sid, query, sort, id, page} = req.query;
    const cap = cap_code_name ? {
        cap_sid: cap_sid,
        [cap_code_name]: cap_code_value
    } : null;

    if (!username) {
        res.send("NO_USERNAME");
    } else if (!password) {
        res.send("NO_PASSWORD");
    } else {

        // login
        const logoutStatus = query || id ? false : true;

        rutracker.login(username, password, cap, logoutStatus)
            .then((status) => {

                if (query) {
                    // search
                    rutracker.search(query).sort(sort).page(page).exec()
                        .then((results) => {
                            console.log(results);
                            res.send(results);
                        })
                        .catch(err => res.send(err))
                } else if (id) {
                    // topic
                    rutracker.topic(id)
                        .then((topic) => {
                            console.log(topic);
                            res.send(topic);
                        })
                        .catch(err => res.send(err))
                } else {
                    res.send(status);
                }

            })
            .catch(err => res.send(err));

    }

});

module.exports = router;