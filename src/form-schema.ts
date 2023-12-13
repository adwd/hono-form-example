import { BodyData } from 'hono/utils/body';
import {
  FlatErrors,
  Input,
  custom,
  email,
  flatten,
  minLength,
  object,
  safeParse,
  string,
} from 'valibot';

const FormSchema = object({
  name: string([
    minLength(1, '名前を入力してください'),
    custom((input) => input.toLowerCase() !== 'john', 'Johnは使えません'),
    custom((input) => input.toLowerCase() !== 'bob', 'Bobは使えません'),
  ]),
  email: string([
    email(),
    custom(
      (input) => !input.includes('example.com'),
      'example.comは使えません',
    ),
  ]),
});

export type FormValue = Input<typeof FormSchema>;

export type FormErrors = FlatErrors<typeof FormSchema>['nested'];

type ParseFormResult =
  | {
      ok: true;
      form: FormValue;
    }
  | {
      ok: false;
      form: BodyData;
      errors: FormErrors;
    };

export function parseForm(
  body: BodyData,
): ParseFormResult {
  const result = safeParse(FormSchema, body);

  if (result.success) {
    return { ok: true, form: result.output };
  } else {
    const errors = flatten(result.issues);
    console.log(errors);
    return { ok: false, form: body, errors: errors.nested };
  }
}
