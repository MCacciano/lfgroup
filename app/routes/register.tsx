import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useSearchParams } from '@remix-run/react';
import { db } from '~/utils/db.server';

function validateUsername(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Username must be at least 3 characters long.`;
  }
}

function validatePassword(password: unknown, confirmPassword?: unknown) {
  if (typeof password !== 'string' || password.length < 5) {
    return `Username must be at least 3 characters long.`;
  }

  if (confirmPassword && password !== confirmPassword) {
    return `Passwords do not match.`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
    confirmPassword: string | undefined;
  };
  fields?: {
    username: string | undefined;
    password: string | undefined;
    confirmPassword: string | undefined;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const confirmPassword = form.get('confirm-password');

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof confirmPassword !== 'string'
  ) {
    return badRequest({ formError: 'Form not submitted correctly' });
  }

  const fields = { username, password, confirmPassword };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password, confirmPassword),
    confirmPassword: validatePassword(confirmPassword, password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fields, fieldErrors });
  }

  const user = await db.user.findFirst({
    where: { username },
  });

  console.log({ fields, fieldErrors });
  console.log('user', user);
  if (user) {
    return badRequest({
      fields,
      formError: `User with the username ${username} already exsists`,
    });
  }

  // create the user
  // redirect to.....somewhere lol
  return badRequest({
    fields,
    formError: `Not implemented`,
  });
};

export default function Login() {
  const [searchParams] = useSearchParams();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-y-4 p-10 border border-black rounded shadow-md">
        <h1 className="text-4xl font-rubik font-medium">Register</h1>
        <form method="post" action="/register" className="flex flex-col gap-y-5">
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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full border border-black rounded p-1"
            />
          </div>
          <div className="flex flex-col items-start gap-y-1">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              className="w-full border border-black rounded p-1"
            />
          </div>
          <button type="submit" className="bg-black text-gray-100 p-1 rounded shadow-md">
            Submit
          </button>
          <div className="flex gap-x-1">
            <p>Already registered?</p>
            <Link to="/login" className="text-blue-600 cursor-pointer">
              Log In!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
