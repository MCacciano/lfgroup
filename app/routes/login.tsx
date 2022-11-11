import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useActionData, useSearchParams } from '@remix-run/react';
import { createUserSession, getUser, login } from '~/utils/session.server';

function validateUsername(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Username must be at least 3 characters long.`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 5) {
    return `Password must be at least 5 characters long.`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string | undefined;
    password: string | undefined;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (user) {
    return redirect('/');
  }
  return json(user);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const redirectTo = form.get('redirectTo') || '/';

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({ formError: 'Form not submitted correctly' });
  }

  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fields, fieldErrors });
  }

  const user = await login(fields);

  if (!user) {
    return badRequest({ fields, formError: `Username and/or password incorrect` });
  }

  return createUserSession(user.id, redirectTo);
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-y-4 p-10 border border-black rounded shadow-md">
        <h1 className="text-4xl font-rubik font-medium">Login</h1>
        <form method="post" action="/login" className="flex flex-col gap-y-5">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <div className="flex flex-col items-start gap-y-1">
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              id="username-input"
              name="username"
              className="w-full border border-black rounded p-1"
            />
          </div>
          <div className="flex flex-col items-start gap-y-1">
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              type="password"
              className="w-full border border-black rounded p-1"
            />
          </div>
          <button type="submit" className="bg-black text-gray-100 p-1 rounded shadow-md">
            Submit
          </button>
          <div className="flex gap-x-1">
            <p>New around here?</p>
            <Link to="/register" className="text-blue-600 cursor-pointer">
              Sign Up!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
