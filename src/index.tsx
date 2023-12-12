import { Hono } from 'hono';
import { renderer } from './renderer';
import { parseForm } from './form-schema';
import { FC } from 'hono/jsx';

const app = new Hono();

app.get('*', renderer);
app.post('*', renderer);

app.get('/', async (c) => {
  const message = await fetchMessage();

  return c.render(
    <main>
      <form method="POST">
        <Header message={message} />
        <Input label="ユーザー名" type="text" name="name" required />
        <Input label="メールアドレス" type="email" name="email" required />

        <div class="divider"></div>
        <button type="submit" class="btn btn-success w-full">
          登録する
        </button>
      </form>
    </main>,
  );
});

app.post('/', async (c) => {
  const message = await fetchMessage();
  
  const body = await c.req.parseBody();
  const result = parseForm(body);

  if (result.ok) {
    const { name, email } = result.form;

    return c.render(
      <main>
        <Header message={message} />
        <div>
          <h1 class="text-2xl font-bold pb-2">ユーザー登録が完了しました</h1>
          <p>ユーザー名: {name}</p>
          <p>メールアドレス: {email}</p>
        </div>
      </main>,
    );
  }

  const { form, errors } = result;
  return c.render(
    <main>
      <form method="POST">
        <Header message={message} />
        <p class="text-error">入力項目にエラーがあります。</p>
        <Input
          label="ユーザー名"
          type="text"
          name="name"
          value={form.name as string}
          required
          errors={errors.name}
        />
        <Input
          label="メールアドレス"
          type="email"
          name="email"
          value={form.email as string}
          required
          errors={errors.email}
        />

        <div class="divider"></div>
        <button type="submit" class="btn btn-success w-full">
          登録する
        </button>
      </form>
    </main>,
  );
});

const Input: FC<
  { label: string; errors?: string[] } & Hono.InputHTMLAttributes
> = (props) => {
  const { label, errors, ...inputProps } = props;
  const { required } = inputProps;

  return (
    <div class="form-control">
      <Label htmlFor={inputProps.name} label={label} required={required} />
      <input
        {...inputProps}
        id={inputProps.name}
        class={`input input-bordered${errors ? ' input-error' : ''}`}
      />
      <ErrorMessage errors={errors} />
    </div>
  );
};

const Label: FC<{ htmlFor?: string; label: string; required?: boolean }> = ({
  htmlFor,
  label,
  required,
}) => {
  return (
    <label for={htmlFor} class="label">
      <div>
        <span class="label-text">{label}</span>
        {required ? <span class="text-xs ml-1 text-accent">(必須)</span> : null}
      </div>
    </label>
  );
};

const Header: FC<{ message: string }> = ({ message }) => {
  return (
    <div class="hero bg-base-200 mb-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-3xl font-bold">{message}</h1>
        </div>
      </div>
    </div>
  );
};

const ErrorMessage: FC<{ errors?: string[] }> = ({ errors }) => {
  return errors ? (
    <p class="p-1 text-sm text-error">{errors.join('\n')}</p>
  ) : (
    <></>
  );
};

function fetchMessage(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('ユーザー登録');
    }, 10);
  });
}

export default app;
