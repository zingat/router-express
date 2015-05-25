var utils = {};

/**
 * Url cleaner
 */

utils.cleanUrl = function (url) {
  url = url
  //.replace(/[^\-\?]*\-?\??/g, '')
  .replace(/\-?:[^\-\?]*\-?\??/g, '') // https://regex101.com/r/cK7yE5/1

  .replace(/\/{2,}/g, '\/') // Tum cift // lari siliyor

  .replace(/\/-/g, '/') // -/ lari siliyor

  .replace(/\/-(.*)/g, '/$1') // /-.... > / (tireyle baslayani eliyor)

  .replace(/(-:.*)(?=\?)/g, '') // /satilik-:var? > /satilik
  .replace(/\/:.*\?-/g, '') // /:var?-satilik > /satilik
  .replace(/\/(.*)-$/g, '/$1') // /izmir-satilik- > /izmir-satilik
  .replace(/\/.*(-)\?.*$/g, '') // /izmir-satilik-?listType=table > /izmir-satilik?listType=table

  .replace(/\?+/g, '') // /satilik?? > /satilik?
  //.replace(/\/\/(.*)/g, '/$1') // //.... > // (baslangictaki // i siliyor)

  //.replace(/-\?/g, '') // /...:?... > /..... , may not be needed anymore
  //.replace(/\/\?/g, '') // /.../?...  >/...., dunno where it is used
  //.replace(/\/:[a-zA-Z]*[\?]?/g, '')
  //.replace(/:([^}?]*)\?/g, '')
  ;
  return url;
}

module.exports = utils;