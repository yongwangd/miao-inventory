const request = require("request-promise-native");
const Rx = require("rxjs");

const letters = "abcdefghijklmnopqrstuvwxyz";

const arr = letters.split("");

const name = "abc";

let list = [];

arr.forEach(a => {
  arr.forEach(b => {
    arr.forEach(c => {
      const name = a + b + c;
      list = [...list, name];
    });
  });
});
console.log("list", list);

Rx.Observable
  .from(list)
  .zip(Rx.Observable.interval(500))
  .subscribe(name => {
    request(`https://api.github.com/users/${name}`, {
      headers: {
        "User-Agent": "request"
      }
    }).then(res => {
      const json = JSON.parse(res);
      if (json.login) {
        console.log(json.login);
      } else {
        console.log(name, "used");
      }
    });
  });
