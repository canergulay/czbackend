const moment = require('moment')

moment.updateLocale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s",
        s  : 'now',
        ss : '%d sec',
        m:  "1 min",
        mm: "%d min",
        h:  "1 hour",
        hh: "%d hours",
        d:  "1 day",
        dd: "%d days",
        w:  "a week",
        ww: "%d weeks",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
});




module.exports=moment