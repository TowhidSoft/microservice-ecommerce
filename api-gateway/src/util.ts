import { Express, Request, Response } from 'express';
import config from './config.json';
import axios from 'axios';
import middlewares from './middlewares';


function createHandler(hostname: string, path: string, method: string) {
  return async (req: Request, res: Response) => {
    try {

      let url = `${hostname}${path}`;
      req.params && Object.keys(req.params).forEach((param) => {
        url = url.replace(`:${param}`, req.params[param] as string);
      })

      const { data } = await axios({
        method,
        url,
        data: req.body,
        headers: {
          origin: 'http://localhost:8081',
          'x-user-id': req.headers['x-user-id'] || '',
          'x-user-email': req.headers['x-user-email'] || '',
          'x-user-name': req.headers['x-user-name'] || '',
          'x-user-role': req.headers['x-user-role'] || '',
          'user-agent': req.headers['user-agent'] || ''
        }
      })
      return res.json(data)
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        return res.status(error.response?.status || 500).json(error.response?.data)
      }
      console.log(error)
      return res.status(500).json({ message: "Internal Server Error", error: error })
    }
  }
}

export const getMiddlewares = (names: string[]) => {
  return names.map((name) => middlewares[name]);
}

export const configureRoutes = (app: Express) => {
  Object.entries(config.services).forEach(([_name, service]) => {
    const hostname = service.url;
    service.routes.forEach((route) => {
      route.methods.forEach((method) => {
        const endpoint = `/api${route.path}`;
        const middleware = getMiddlewares(route.middlewares);
        const handler = createHandler(hostname, route.path, method)
        app[method](endpoint, ...middleware, handler);


        console.log(`Adding route ${method.toUpperCase()} ${endpoint}`)
      })
    })
  });
}