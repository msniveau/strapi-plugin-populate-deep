'use strict';
const { getFullPopulateObject } = require('./helpers')

module.exports = ({ strapi }) => {
  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === 'beforeFindMany' || event.action === 'beforeFindOne') {
      const ctx = strapi.requestContext.get();
      const urlParams = new URLSearchParams(ctx?.originalUrl.split('?')[1]);
      const populate = urlParams.get("populate")?.split(",");
      const defaultDepth = strapi.plugin('strapi-plugin-populate-deep')?.config('defaultDepth') || 5

      if (populate && populate[0] === 'deep') {
        const depth = populate[1] ?? defaultDepth
        const modelObject = getFullPopulateObject(event.model.uid, depth, []);
        event.params.populate = modelObject.populate
      }
    }
  });
};
