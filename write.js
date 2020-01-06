const fs = require('fs');

let victorianSlang = [{
    term: "doing the bear",
    found: true,
    popularity: 108
},
{
    term: "katterzem",
    found: false,
    popularity: null
},
{
    term: "bone shaker",
    found: true,
    popularity: 609
},
{
    term: "smothering a parrot",
    found: false,
    popularity: null
},
{
    term: "damfino",
    found: true,
    popularity: 232
},
{
    term: "rain napper",
    found: false,
    popularity: null
},
{
    term: "donkey’s breakfast",
    found: true,
    popularity: 787
},
{
    term: "rational costume",
    found: true,
    popularity: 513
},
{
    term: "mind the grease",
    found: true,
    popularity: 154
}
];

let tempData = JSON.stringify(victorianSlang).replace(/^\[|\]$/g, '');
for (let index = 0; index < 16; index++) {
    tempData += `,${tempData}`
}
tempData = "[" + tempData + "]";


// for (let index = 0; index < 20; index++) {
//     victorianSlang = victorianSlang.concat(JSON.parse(tempData))
// }

fs.writeFile('./data.json', tempData, (err, data) => {
    if (err) {
        console.log(err);
    }

    console.log('bingo');
})

// fs.readFile('./data.json', (err, data) => {
//     if (err) {
//         return console.log(err)
//     }

//     let redata = JSON.parse(data);
//     console.log(redata);
// })