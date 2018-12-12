import path from 'path';
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { matchPath } from 'react-router-dom';
import App from './app';

class Test extends React.Component {
  static load() {
    return Promise.resolve('Other data');
  }

  render() {
    return null;
  }
}

const routes = [
  {
    path: '/',
    load: () => Promise.resolve('Stuff'),
    routes: [
      {
        path: '/test',
        component: Test,
        routes: [
          {
            path: '/:id'
          }
        ]
      }
    ]
  }
];

function flattenRoutes(routes, basePath = '/') {
  return routes.reduce((acc, route) => {
    acc.push({
      ...route,
      path: basePath != '/' ? `${basePath}${route.path}` : route.path
    });

    if (route.routes) {
      acc.push(...flattenRoutes(route.routes, route.path));
    }

    return acc;
  }, []);
}

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  const matches = flattenRoutes(routes).reduce((acc, route) => {
    const match = matchPath(req.url, route);
    if (match) acc.push(route);
    return acc;
  }, []);

  // TODO: should load in order maybe
  // TODO: make sure promises finished (catch each one individually)
  const promises = matches.reduce((acc, match) => {
    if (match.load) acc.push(match.load());
    if (match.component && match.component.load) acc.push(match.component.load());

    return acc;
  }, []);

  Promise.all(
    promises.map(p =>
      p.catch(err => ({
        isError: true,
        error: err
      }))
    )
  ).then(results => {
    // do sth with the data and put it in the html

    const html = renderToString(<App />);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div id="root">${html}</div>
          <script src="bundle.js"></script>
        </body>
      </html>
    `);
  });
});

app.listen(8080, () => {
  console.log(`Server listening on port 8080`);
});
