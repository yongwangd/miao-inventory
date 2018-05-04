import fs from "fs";
import { liveCrawler } from "flaming";
import cheerio from "cheerio";
import R from "ramda";
import config from "./crawlerConfig";

console.log("config", config);

config.sites.forEach(options => {
  const { pageSource$, addLink, addData, data$ } = liveCrawler({
    domain: options.domain,
    startFrom: options.startFrom,
    pipes: [
      {
        predicate: R.always(true),
        fn: chm => chm
      }
    ]
  });

  const file = `./webcrawlers/output/${options.fileName}`;

  fs.writeFileSync(file, "yelpId,Name,address,phone,review,website\n");

  const cleanStr = (str = "") => {
    const s = str.trim().replace(/(\r\n|\n|\r)/gm, "");
    return s.includes(",") ? `"${s}"` : s;
  };

  // addLink('/search?find_desc=weave&find_loc=NC');

  pageSource$
    .filter(({ url }) => url.includes("search?"))
    .subscribe(({ src }) => {
      const $ = cheerio.load(src);
      const divs = $(".regular-search-result .search-result")
        .toArray()
        .map(d => {
          const div = $(d);
          const id = div.attr("data-biz-id");
          const site = div.find(".biz-name").attr("href");
          const name = div.find(".biz-name span").text();
          const address = div.find("address").text();

          const stars = cleanStr(div.find(".i-stars").attr("title")).split(
            " "
          )[0];
          const ratingCount = cleanStr(div.find(".review-count").text());

          const phone = div.find(".biz-phone").text();

          console.log(`${id},${name},${address},${(phone || "").trim()}`);

          addLink(site, {
            id: cleanStr(id),
            name: cleanStr(name),
            address: cleanStr(address),
            phone: cleanStr(phone),
            review: stars ? `${stars}/${ratingCount}` : "no review"
          });
        });

      const nextLink = $(".pagination-links a.next").attr("href");
      addLink(nextLink);
    });

  pageSource$
    .filter(({ url }) => !url.includes("search?"))
    .subscribe(({ data, src }) => {
      const $ = cheerio.load(src);
      const website = $(".biz-page-subheader .biz-website a").text();
      addData({
        ...data,
        website
      });
    });

  data$.distinct(x => x.id).subscribe(data => {
    const str = `${R.values(data).join(",")}\n`;
    fs.appendFileSync(file, str);
  });
});
