(async () => {
  const request = require("request");
  const requestPromise = require("request-promise");
  const cheerio = require("cheerio");
  const download = require("image-downloader");
  const URL = "https://www.cbre-propertysearch.jp/industrial/tokyo/?q=東京都";

  requestPromise(encodeURI(URL), async function (error, response, body) {
    if (error) {
      console.error(error);
      return;
    }

    let $ = cheerio.load(body);

    // Lấy link của các page
    let totalPage = +$(
      "#contents > div > div.propertyList > div > div.tools.bottom > div > ul > li:last-child > a"
    ).text();
    let listPage = [];
    for (let i = 1; i <= totalPage; i++) {
      listPage.push(
        `https://www.cbre-propertysearch.jp/industrial/tokyo/?q=東京都&page=${i}`
      );
    }
    // Đã lấy được listPage
    // console.log(listPage);

    // Lặp từng page lấy ra link của các warehouse
    let listLink = [];
    // await requestPromise(listPage.forEach((page, index) => {
    Promise.all(
      listPage.map(async (page) => {
        await request(encodeURI(page), function (error, response, body) {
          if (error) {
            console.error(error);
            return;
          }

          let $ = cheerio.load(body);

          // Lấy tất cả link của các warehouse trong 1 trang
          let warehouses = $("div.itemGroup div.item h2.name a");
          warehouses = [...warehouses];

          let links = warehouses.map(function (item) {
            return $(item).attr("href");
          });
        //   console.log(links);
          listLink.push(links);
        });
      })
    );
  });
})();
