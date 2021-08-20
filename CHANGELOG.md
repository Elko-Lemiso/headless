# Change Log

## v1.0.0

1. packages version updated for all the major libraries
2. node10 deployment issue fixed
3. latest firebase tools issues fixed
4. 10x performance improved
5. Emulator support added

## Before v1.0.0

1. update all packages .
2. use env value from `next.config.js` (remove `.env`file) from web.
3. remove custom server in favour of next 9 `dynamic routing.`
4. `.yarnrc` file and `npmClientArgs` key(to `lerna.json`) added to avoid `node engine`version mismatch problem.
5. update root `babel.config.js` file.
6. update `.gitignore` file.
7. update \_app page (remove deprecated Container and ApolloProvider)
8. update \_document page
9. remove `react-apollo-hooks` package in favour of official `@apollo/react-hooks` package.
10. remove `init-apollo.js` and `with-apollo-client.js` file and make new one called `apollo.js`

```
* Simplify apollo setup

* Allow disabling of ssr in favor of automatic static optimization

- Converted Class to Function Component
- Added ssr config option

* Exclude @apollo/react-ssr from client bundle

* Remove WithApollo.getInitialProps from the client

* Remove displayName from production build

* Fix production switch

* Change export & fucntion naming

- Use named export
- Change function naming

* Warn if someone tries to use this HOC with _app.js
```

11. `ACCOUNT_PAGE` constant rename to `PROFILE_PAGE` according to define route.
12. Fix search page category loader component's size.
13. use `.env` variables from server package.
14. remove app.js function from server in faviour of next 9 dynamic routing.
15. remove `env` variables from `next.config.js`
