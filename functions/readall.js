const faunadb = require('faunadb');
require('dotenv').config();
const q = faunadb.query;

exports.handler = async (event, context) => {
    const client = new faunadb.Client({
        secret: process.env.FAUNADB_SECRET,
        domain: 'db.us.fauna.com',
        port: 443,
        scheme: 'https',
    });

    return client
        .query(q.Paginate(q.Match(q.Ref('indexes/all_recipes'))))
        .then((response) => {
            const recipesRefs = response.data;

            const getQuery = recipesRefs.map((ref) => {
                return q.Get(ref);
            });

            return client.query(getQuery).then((ret) => {
                /* Victory! */
                return {
                    statusCode: 200,
                    body: JSON.stringify(ret),
                };
            });
        })
        .catch((error) => {
            /* D'aw crap */
            console.log('error', error);
            return {
                statusCode: 400,
                body: JSON.stringify(error),
            };
        });
};
