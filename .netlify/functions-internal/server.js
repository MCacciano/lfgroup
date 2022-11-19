var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_stream = require("stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_runtime = require("react/jsx-runtime"), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return (0, import_isbot.default)(request.headers.get("user-agent")) ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext);
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.RemixServer, {
      context: remixContext,
      url: request.url
    }), {
      onAllReady() {
        let body = new import_stream.PassThrough();
        responseHeaders.set("Content-Type", "text/html"), resolve(
          new import_node.Response(body, {
            headers: responseHeaders,
            status: didError ? 500 : responseStatusCode
          })
        ), pipe(body);
      },
      onShellError(error) {
        reject(error);
      },
      onError(error) {
        didError = !0, console.error(error);
      }
    });
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.RemixServer, {
      context: remixContext,
      url: request.url
    }), {
      onShellReady() {
        let body = new import_stream.PassThrough();
        responseHeaders.set("Content-Type", "text/html"), resolve(
          new import_node.Response(body, {
            headers: responseHeaders,
            status: didError ? 500 : responseStatusCode
          })
        ), pipe(body);
      },
      onShellError(err) {
        reject(err);
      },
      onError(error) {
        didError = !0, console.error(error);
      }
    });
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_node3 = require("@remix-run/node"), import_react3 = require("@remix-run/react");

// app/utils/session.server.ts
var import_bcryptjs = __toESM(require("bcryptjs")), import_node2 = require("@remix-run/node");

// app/utils/db.server.ts
var import_client = require("@prisma/client"), db;
db = new import_client.PrismaClient();

// app/utils/session.server.ts
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret)
  throw new Error("SESSION_SECRET must be set in your .env file");
var storage = (0, import_node2.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: !0,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: !0
  }
});
function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}
async function getUserId(request) {
  let userId = (await getUserSession(request)).get("userId");
  return !userId || typeof userId != "string" ? null : userId;
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (typeof userId != "string")
    return null;
  try {
    return await db.user.findUnique({
      where: { id: userId },
      select: { id: !0, username: !0 }
    });
  } catch {
    throw logout(request);
  }
}
async function login({ username, password }) {
  try {
    let user = await db.user.findUnique({ where: { username } });
    return !user || !await import_bcryptjs.default.compare(password, user.passwordHash) ? null : { id: user.id, username };
  } catch (err) {
    throw err;
  }
}
async function logout(request) {
  let session = await getUserSession(request);
  return (0, import_node2.redirect)("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}
async function register({ username, password, email }) {
  let passwordHash = await import_bcryptjs.default.hash(password, await import_bcryptjs.default.genSalt());
  try {
    return await db.user.create({ data: { username, passwordHash, email } });
  } catch (err) {
    throw err;
  }
}
async function createUserSession(userId, redirectTo) {
  let session = await storage.getSession();
  return session.set("userId", userId), (0, import_node2.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}

// app/styles/app.css
var app_default = "/build/_assets/app-6QEMW6T3.css";

// app/components/Navigation.tsx
var import_react2 = require("react"), import_react_router_dom = require("react-router-dom"), import_solid = require("@heroicons/react/20/solid"), import_jsx_runtime = require("react/jsx-runtime");
function Navigation({ user }) {
  let [showUserNav, setShowUserNav] = (0, import_react2.useState)(!1), toggleUserNav = () => {
    setShowUserNav((prev) => !prev);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
    className: "border-b border-gray-900 font-rubik",
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      className: "flex justify-evenly",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          className: "flex-1 flex justify-start",
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_router_dom.Link, {
            to: "/feed",
            className: "p-5",
            children: "LFGroup"
          })
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          className: "flex-1 flex justify-end gap-4",
          children: user != null && user.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "relative",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                className: "flex cursor-pointer p-5",
                onClick: toggleUserNav,
                onMouseLeave: () => setShowUserNav(!1),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
                    children: user.username
                  }),
                  showUserNav ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_solid.ChevronUpIcon, {
                    className: "w-5"
                  }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_solid.ChevronDownIcon, {
                    className: "w-5"
                  })
                ]
              }),
              showUserNav ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
                className: "absolute top-14 right-6 bg-white border border-gray-900 font-rubik z-50",
                onMouseEnter: () => setShowUserNav(!0),
                onMouseLeave: () => setShowUserNav(!1),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
                    className: "border-b border-gray-900",
                    onClick: toggleUserNav,
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_router_dom.Link, {
                      to: `/user/${user.id}`,
                      className: "py-2 px-4 block hover:bg-gray-900 hover:text-white",
                      children: "Profile"
                    })
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
                    className: "border-b border-gray-900 py-2 px-4 hover:bg-gray-900 hover:text-white",
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
                      action: "/logout",
                      method: "post",
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                        type: "submit",
                        children: "Logout"
                      })
                    })
                  })
                ]
              }) : null
            ]
          }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_router_dom.Link, {
            to: "/login",
            className: "p-5 hover:bg-black hover:text-gray-100",
            children: "Login"
          })
        })
      ]
    })
  });
}

// app/root.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function links() {
  return [{ rel: "stylesheet", href: app_default }];
}
var meta = () => ({
  charset: "utf-8",
  title: "LFGroup",
  viewport: "width=device-width,initial-scale=1"
}), loader = async ({ request }) => {
  let user = await getUser(request);
  return (0, import_node3.json)(user);
};
function App() {
  let data = (0, import_react3.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
    lang: "en",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react3.Meta, {}),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react3.Links, {})
        ]
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, {
            user: data
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react3.Outlet, {}),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react3.ScrollRestoration, {}),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react3.Scripts, {}),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react3.LiveReload, {})
        ]
      })
    ]
  });
}

// app/routes/user/$userName.tsx
var userName_exports = {};
__export(userName_exports, {
  default: () => UserProfile,
  loader: () => loader2
});
var import_node4 = require("@remix-run/node"), import_react4 = require("@remix-run/react");
var import_jsx_runtime = require("react/jsx-runtime"), loader2 = async ({ request }) => {
  let user = await getUser(request);
  return (0, import_node4.json)(user);
};
function UserProfile() {
  let { id, username } = (0, import_react4.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
      children: [
        username,
        "'s Profile"
      ]
    })
  });
}

// app/routes/user/index.tsx
var user_exports = {};
__export(user_exports, {
  default: () => Index
});
var import_react5 = require("@remix-run/react"), import_jsx_runtime = require("react/jsx-runtime");
function Index() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react5.Outlet, {});
}

// app/routes/register.tsx
var register_exports = {};
__export(register_exports, {
  action: () => action,
  default: () => Register,
  loader: () => loader3
});
var import_node5 = require("@remix-run/node"), import_react6 = require("@remix-run/react");
var import_jsx_runtime = require("react/jsx-runtime"), validateUsername = (username) => {
  if (typeof username != "string" || username.length < 3)
    return "Username must be at least 3 characters long.";
}, validateEmail = (email) => {
  if (typeof email != "string" || !/^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i.test(email))
    return "Please enter a valid email.";
}, validatePassword = (password, confirmPassword) => {
  if (typeof password != "string" || password.length < 5)
    return "Password must be at least 5 characters long.";
  if (confirmPassword && password !== confirmPassword)
    return "Passwords do not match.";
}, badRequest = (data) => (0, import_node5.json)(data, { status: 400 }), loader3 = async ({ request }) => {
  let user = await getUser(request);
  return user ? (0, import_node5.redirect)("/") : (0, import_node5.json)(user);
}, action = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), email = form.get("email"), password = form.get("password"), redirectTo = form.get("redirectTo") || "/", confirmPassword = form.get("confirm-password");
  if (typeof username != "string" || typeof password != "string" || typeof email != "string" || typeof confirmPassword != "string" || typeof redirectTo != "string")
    return badRequest({ formError: "Form not submitted correctly" });
  let fields = { username, email, password, confirmPassword }, fieldErrors = {
    username: validateUsername(username),
    email: validateEmail(email),
    password: validatePassword(password, confirmPassword),
    confirmPassword: validatePassword(confirmPassword, password)
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fields, fieldErrors });
  if (await getUserId(request))
    return badRequest({
      fields,
      formError: `User with the username ${username} already exsists`
    });
  let newUser = await register({ username, password, email });
  return createUserSession(newUser.id, redirectTo);
};
function Register() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  let [searchParams] = (0, import_react6.useSearchParams)(), actionData = (0, import_react6.useActionData)();
  return console.log("actionData", actionData), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    className: "w-screen h-screen flex justify-center items-center",
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      className: "flex flex-col justify-center items-center gap-y-4 p-10 border border-black rounded shadow-md",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
          className: "text-4xl font-rubik font-medium",
          children: "Register"
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
          method: "post",
          action: "/register",
          className: "flex flex-col gap-y-5",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
              type: "hidden",
              name: "redirectTo",
              value: searchParams.get("redirectTo") ?? void 0
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "flex flex-col items-start gap-y-1",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
                  htmlFor: "username-input",
                  children: "Username"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                  type: "text",
                  id: "username-input",
                  name: "username",
                  defaultValue: (_a = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _a.username,
                  className: `w-full border border-black rounded p-1 ${(_b = actionData == null ? void 0 : actionData.fieldErrors) != null && _b.username ? "border-red-600" : ""}`
                }),
                ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.username) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  className: "text-red-600 text-sm",
                  children: (_d = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _d.username
                })
              ]
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "flex flex-col items-start gap-y-1",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
                  htmlFor: "email-input",
                  children: "Email"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                  type: "email",
                  id: "email-input",
                  name: "email",
                  defaultValue: (_e = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _e.email,
                  className: `w-full border border-black rounded p-1 ${(_f = actionData == null ? void 0 : actionData.fieldErrors) != null && _f.email ? "border-red-600" : ""}`
                }),
                ((_g = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _g.email) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  className: "text-red-600 text-sm",
                  children: (_h = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _h.email
                })
              ]
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "flex flex-col items-start gap-y-1",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
                  htmlFor: "password",
                  children: "Password"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                  id: "password",
                  name: "password",
                  type: "password",
                  defaultValue: (_i = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _i.password,
                  className: `w-full border border-black rounded p-1 ${(_j = actionData == null ? void 0 : actionData.fieldErrors) != null && _j.password ? "border-red-600" : ""}`
                }),
                ((_k = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _k.password) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  className: "text-red-600 text-sm",
                  children: (_l = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _l.password
                })
              ]
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "flex flex-col items-start gap-y-1",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
                  htmlFor: "confirm-password",
                  children: "Confirm Password"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                  id: "confirm-password",
                  name: "confirm-password",
                  type: "password",
                  defaultValue: (_m = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _m.passwordConfirm,
                  className: `w-full border border-black rounded p-1 ${(_n = actionData == null ? void 0 : actionData.fieldErrors) != null && _n.confirmPassword ? "border-red-600" : ""}`
                }),
                ((_o = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _o.confirmPassword) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  className: "text-red-600 text-sm",
                  children: (_p = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _p.confirmPassword
                })
              ]
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
              type: "submit",
              className: "bg-black text-gray-100 p-1 rounded shadow-md",
              children: "Submit"
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "flex gap-x-1",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  children: "Already registered?"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react6.Link, {
                  to: "/login",
                  className: "text-blue-600 cursor-pointer",
                  children: "Log In!"
                })
              ]
            })
          ]
        })
      ]
    })
  });
}

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action2,
  loader: () => loader4
});
var import_node6 = require("@remix-run/node");
var action2 = async ({ request }) => logout(request), loader4 = async () => (0, import_node6.redirect)("/");

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  loader: () => loader5
});
var import_node7 = require("@remix-run/node");
var loader5 = async ({ request }) => await getUser(request) ? (0, import_node7.redirect)("/feed") : (0, import_node7.redirect)("/login");

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action3,
  default: () => Login,
  loader: () => loader6
});
var import_node8 = require("@remix-run/node"), import_react7 = require("@remix-run/react");
var import_jsx_runtime = require("react/jsx-runtime"), validateUsername2 = (username) => {
  if (typeof username != "string" || username.length < 3)
    return "Username must be at least 3 characters long.";
}, validatePassword2 = (password) => {
  if (typeof password != "string" || password.length < 5)
    return "Password must be at least 5 characters long.";
}, badRequest2 = (data) => (0, import_node8.json)(data, { status: 400 }), loader6 = async ({ request }) => {
  let user = await getUser(request);
  return user ? (0, import_node8.redirect)("/") : (0, import_node8.json)(user);
}, action3 = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), password = form.get("password"), redirectTo = form.get("redirectTo") || "/";
  if (typeof username != "string" || typeof password != "string" || typeof redirectTo != "string")
    return badRequest2({ formError: "Form not submitted correctly" });
  let fields = { username, password }, fieldErrors = {
    username: validateUsername2(username),
    password: validatePassword2(password)
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest2({ fields, fieldErrors });
  let user = await login(fields);
  return user ? createUserSession(user.id, redirectTo) : badRequest2({ fields, formError: "Username and/or password incorrect" });
};
function Login() {
  var _a, _b, _c, _d, _e, _f, _g;
  let [searchParams] = (0, import_react7.useSearchParams)(), actionData = (0, import_react7.useActionData)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    className: "w-screen h-screen flex justify-center items-center",
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      className: "flex flex-col justify-center items-center gap-y-4 p-10 border border-black rounded shadow-md",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
          className: "text-4xl font-rubik font-medium",
          children: "Login"
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
          method: "post",
          action: "/login",
          className: "flex flex-col gap-y-5",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
              type: "hidden",
              name: "redirectTo",
              value: searchParams.get("redirectTo") ?? void 0
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "flex flex-col items-start gap-y-1",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
                  htmlFor: "username-input",
                  children: "Username"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                  type: "text",
                  id: "username-input",
                  name: "username",
                  defaultValue: (_a = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _a.username,
                  className: `w-full border border-black rounded p-1 ${(_b = actionData == null ? void 0 : actionData.fieldErrors) != null && _b.username ? "border-red-600" : ""}`
                }),
                ((_c = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _c.username) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  className: "text-red-600 text-sm",
                  children: (_d = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _d.username
                })
              ]
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "flex flex-col items-start gap-y-1",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
                  htmlFor: "password-input",
                  children: "Password"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                  id: "password-input",
                  name: "password",
                  type: "password",
                  className: `w-full border border-black rounded p-1 ${(_e = actionData == null ? void 0 : actionData.fieldErrors) != null && _e.password ? "border-red-600" : ""}`
                }),
                ((_f = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _f.password) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  className: "text-red-600 text-sm",
                  children: (_g = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _g.password
                })
              ]
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
              type: "submit",
              className: "bg-black text-gray-100 p-1 rounded shadow-md",
              children: "Submit"
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "flex gap-x-1",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  children: "New around here?"
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react7.Link, {
                  to: "/register",
                  className: "text-blue-600 cursor-pointer",
                  children: "Register!"
                })
              ]
            })
          ]
        })
      ]
    })
  });
}

// app/routes/feed.tsx
var feed_exports = {};
__export(feed_exports, {
  default: () => Feed,
  loader: () => loader7
});
var import_node9 = require("@remix-run/node"), import_react8 = require("@remix-run/react");
var import_jsx_runtime = require("react/jsx-runtime"), loader7 = async ({ request }) => {
  let user = await getUser(request);
  return (0, import_node9.json)(user);
};
function Feed() {
  let data = (0, import_react8.useLoaderData)();
  return console.log("data", data), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
      children: "Feed"
    })
  });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "1c6e2372", entry: { module: "/build/entry.client-BDZ4JZN3.js", imports: ["/build/_shared/chunk-4R3J2XGV.js", "/build/_shared/chunk-Q3IECNXJ.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-5ODTH6UC.js", imports: ["/build/_shared/chunk-QVTEGN3F.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/feed": { id: "routes/feed", parentId: "root", path: "feed", index: void 0, caseSensitive: void 0, module: "/build/routes/feed-3ZCIPRDP.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/index-PEN3FIEE.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-Z3MNOKSX.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-GPTXG6BX.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/register": { id: "routes/register", parentId: "root", path: "register", index: void 0, caseSensitive: void 0, module: "/build/routes/register-5IJZBCIL.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/user/$userName": { id: "routes/user/$userName", parentId: "root", path: "user/:userName", index: void 0, caseSensitive: void 0, module: "/build/routes/user/$userName-KFM2FFQM.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/user/index": { id: "routes/user/index", parentId: "root", path: "user", index: !0, caseSensitive: void 0, module: "/build/routes/user/index-6MH4LIZF.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-1C6E2372.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/user/$userName": {
    id: "routes/user/$userName",
    parentId: "root",
    path: "user/:userName",
    index: void 0,
    caseSensitive: void 0,
    module: userName_exports
  },
  "routes/user/index": {
    id: "routes/user/index",
    parentId: "root",
    path: "user",
    index: !0,
    caseSensitive: void 0,
    module: user_exports
  },
  "routes/register": {
    id: "routes/register",
    parentId: "root",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: register_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/feed": {
    id: "routes/feed",
    parentId: "root",
    path: "feed",
    index: void 0,
    caseSensitive: void 0,
    module: feed_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  publicPath,
  routes
});
