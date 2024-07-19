import { BodyData } from 'hono/utils/body';
import * as v from 'valibot';

const FormSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, '名前を入力してください'),
    v.custom(
      (input) => typeof input !== 'string' || input.toLowerCase() !== 'john',
      'Johnは使えません',
    ),
    v.custom(
      (input) => typeof input !== 'string' || input.toLowerCase() !== 'bob',
      'Bobは使えません',
    ),
  ),
  email: v.pipe(
    v.string(),
    v.email(),
    v.custom(
      (input) => typeof input !== 'string' || !input.includes('example.com'),
      'example.comは使えません',
    ),
  ),
});

type FormValue = v.InferOutput<typeof FormSchema>;

export type FormErrors = v.FlatErrors<typeof FormSchema>['nested'];

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

export function parseForm(body: BodyData): ParseFormResult {
  const result = v.safeParse(FormSchema, body);

  if (result.success) {
    return { ok: true, form: result.output };
  } else {
    const errors = v.flatten(result.issues);
    console.log(errors);
    return { ok: false, form: body, errors: errors.nested };
  }
}
