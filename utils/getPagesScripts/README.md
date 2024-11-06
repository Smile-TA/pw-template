# Get Links Scripts Reference

## `getLinksByType.js`

Gets links by post type. By default, it gets page links
```sh
# Get all page links
$ node getLinksByType.js https://integrity.com/
```
OR
```sh
# Get all posts links
$ node getLinksByType.js https://integrity.com/ posts
```

## `getPostTypes.js`

```sh
# Get all post types
$ node getLinksByType.js https://integrity.com/
```

## `getPagesWithSitemap.js`
```sh
# Get all available pages and posts if sitemap.xml is available
$ node getPagesWithSitemap.js https://integrity.com/
```