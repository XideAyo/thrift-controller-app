
exports.index = (req, res, next) => {
    let user = {
      name: 'Xide',
      age: '100',
      verified: true
    }
    res.render('index', { title: 'ToDo App', user: user, users: "Xide"});
  }

exports.about = (req, res, next) => {
    res.render('about', {title: "About Page"})
  }

exports.courses = (req, res, next) => {
    const course= [
        {
            name: 'Front-End',
            price: 60000,
            duration: '2 months',
            details: 'Learn web fundamentals, build clean interfaces, and properly version your code. Gain indepth knowledge of HTML5, CSS3, ES6+, React, Git, Github, and traspilers.',
        },
        {
            name: 'Back-End',
            price: 65000,
            duration: '2 months',
            details: `Learn how to build an efficient, scalable, and robust back end infrastructure to power organization's need. Learn how to create secure and irresitible API's.`,
        },
        {
            name: 'Mobile App',
            price: 80000,
            duration: '3 months',
            details: `Learn how to build cross platform mobile apps . This course will focus on Flutter (Dart), and React Native (Javascript), how to setup Android Studio, and deploy to app stores.`,
        },
        {
            name: 'Blockchain',
            price: 50000,
            duration: '3 months',
            details: `Learn how to build smart contracts, decentralized applications using industry standard tools like Solidity, Remix, truffle, ganache, metatask etc. Also learn trading.`,
        },
        {
            name: 'Ethical Hacking',
            price: 50000,
            duration: '3 months',
            details: `Learn how to hack and secure both Wi-Fi and Wired connections. Learn Kali Linux, exploit vulnerabilities in applications, and do Penetration testing.`,
        },
        {
            name: 'UI-UX',
            price: 50000,
            duration: '2 months',
            details: `Learn how to engineer clean, and usable interface. The viability of any product in the market is closely knit to the interface. Clients place more emphasis on what they see.`,
        },
        {
            name: 'IOT',
            price: 50000,
            duration: '3 months',
            details: `Learn how to design, code, build, and market IOT products. Learn and master Arduino IDE, learn how to program micro controllers, and connect to cloud IOT platforms.`,
        },
        {
            name: 'Data Science and ML',
            price: 60000,
            duration: '3 months',
            details: `Learn how to use Python for statistical analysis, develop business intuition using deep learning, and construct interesting machine learning algorithms.`,
        },
        
    ]
    res.render("courses", {title: "BigJara Courses", courses: course})
}

exports.sendForm = (req ,res ,next) => {
    let username = req.body.username
    let password = req.body.password
    res.send(username + ' and ' + password)
}