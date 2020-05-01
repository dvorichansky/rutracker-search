const cheerio = require('cheerio');
const windows1251 = require('windows-1251');

let parseSearch = (html) => {
    let $ = cheerio.load(html, {decodeEntities: false});

    let formatSize = (size_in_bytes) => {
        let size_in_megabytes = size_in_bytes / (1024 * 1024);
        return (size_in_megabytes.toString()).slice(0, 7);
    };

    let tracks = $('#tor-tbl tbody').find('tr');
    let search_quantity = Number($(".vMiddle").find("p.med").text().replace("(max: 500)", "").replace("Результатов поиска: ", ""));

    let results = [];

    for (let i = 0; i < 50; i++) {
        // Ah-m... Couldn't find any better method
        const document = tracks.find("td");
        const state = document.next();
        const category = state.next();
        const title = category.next();
        const author = title.next();
        const size = author.next();
        const seeds = size.next();
        const leeches = seeds.next();
        const downloads = leeches.next();
        const registered = downloads.next();

        const id = title.find("div a").attr("data-topic_id");

        // Handle case where search has no results
        if (id) {
            results.push({
                state: getStateConstant(state.attr("title")),
                id: id,
                url: 'http://rutracker.org/forum/' + title.find("div a").attr('href'),
                category: category.find(".f-name a").html(),
                title: title.find("div a").html(),
                author: author.find("div a").html(),
                size: Number(formatSize(size.attr("data-ts_text"))),
                seeds: Number(seeds.attr("data-ts_text")),
                leeches: Number(leeches.first().text()),
                downloads: Number(downloads.html()),
                registered: new Date(Number(registered.attr("data-ts_text")) * 1000),
                search_quantity: search_quantity
            });
        }

        tracks = tracks.next();
    }

    // return results.filter((x) => {
    //     return x.id;
    // });
    return results;
};

const getStateConstant = (state) => {
    switch (state) {
        case "проверено":
            return 'APPROVED';
            break;
        case "не проверено":
            return 'NOT_APPROVED';
            break;
        case "проверяется":
            return 'CHECKED';
            break;
        case "недооформлено":
            return 'UNFORMED';
            break;
        case "не оформлено":
            return 'NEED_EDIT';
            break;
        case "повтор":
            return 'REPLAY';
            break;
        case "поглощено":
            return 'ABSORBED';
            break;
        case "премодерация":
            return 'PRE_MODERATION';
            break;
        case "закрыто правообладателем":
            return 'CLOSED_COPYRIGHT';
            break;
        case "сомнительно":
            return 'DUBIOUSLY';
            break;
        case "закрыто":
            return 'CONSUMED';
            break;
        case "временная":
            return 'TEMPORARY';
            break;
        default:
            return 'UNKNOWN';
            break;
    }
};

let parseTopic = (html) => {
    let $ = cheerio.load(html, {decodeEntities: false});

    let topic = $('#topic_main tr');
    let result = {
        created: topic.find('.post-time').find('span a').html(),
        since: topic.find('.post-time').find('span').next().html(),
        image: topic.find('.post_body').find('.postImg').attr('title'),
        magnet: topic.find('.attach').find('.magnet-link').attr('href'),
        content: topic.find('.post_body').html()
    };

    // TODO: FIX ME
    // let isBody = true;
    // topic.find('.post_body').children().each((index, elm) => {
    //     if (elm.attribs.id == 'tor-reged') isBody = false;
    //     if (isBody) result.raw_body += $(elm).html();
    // });

    return result;
};

let parseCaptcha = (html) => {
    let $ = cheerio.load(html, {decodeEntities: false});
    let loginBox = $('#login-form-full tr').next();
    let captchaBox = loginBox.find('.login-ssl-block').prev().find('td').next();

    return {
        message: 'Captcha. Maybe incorrect username or password.',
        captcha: 'http:' + captchaBox.find('div img').attr('src'),
        cap_sid: captchaBox.find('div').next().find('input').attr('value'),
        cap_code: captchaBox.find('div').next().find('input').next().attr('name'),
    };
};

let toWin1251 = (data) => {
    return windows1251.decode(data, {mode: 'html'});
};

module.exports = {parseSearch, parseTopic, parseCaptcha, toWin1251};
