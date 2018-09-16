import cheerio from 'cheerio';
import fetch from 'node-fetch';

export const getAdditionalSysWineInfo = async url => {
  let allrows;
  let body = await fetch(url);
  body = await body.text();
  let page = cheerio.load(body);
  let listprops = page('#destopview ul li');
  let image = page('.product-image .carousel-container');
  let regex = '//.*.jpg';
  if (image.html()) {
    image = image.html().match(regex);
    image = image[0];
  } else {
  	image = null;
  }
  for (var j = 0; j < listprops.length; j++) {
  let liItem = page(listprops[j]);
    if (liItem.find('h3').text().indexOf('Råvaror') > -1) {
      allrows = liItem.find('p');
      liItem.find('div').remove();
      allrows = liItem.html().replace(/<\/button>|samt |och |, |\d% |\d\d% |\d\d\d% |<p>/g, "");
      allrows = allrows.split(/\r\n|<\/button>|<button /);
      for (var i = 0; i < allrows.length; i++) {
        allrows[i] = allrows[i].trim();
        if (allrows[i] && allrows[i].startsWith("class")) {
          allrows.splice(i, 1);
          i = i - 1;
        }
        if (allrows[i] && allrows[i].startsWith("<h3")) {
          allrows.splice(i, 1);
          i = i - 1;
        }
        if (allrows[i] && allrows[i].startsWith("R&#xE5;varor")) {
          allrows.splice(i, 1);
          i = i - 1;
        }
        if (allrows[i] && allrows[i].endsWith("</p>")) {
          allrows.splice(i, 1);
          i = i - 1;
        }
        if (allrows[i] !== undefined && allrows[i].length < 2) {
          allrows.splice(i, 1);
          i = i - 1;
        }
      }
    }
  }
  if (!allrows) {
    allrows = [];
  }
  return { grapes: allrows, image: image };   
}