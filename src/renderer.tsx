import 'hono';
import { jsxRenderer } from 'hono/jsx-renderer';

export const renderer = jsxRenderer(
  ({ children }) => {
    return (
      <html data-theme="light" lang="ja">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=devide-width, initial-scale=1" />
          <link
            href="https://cdn.jsdelivr.net/npm/daisyui@4.4.19/dist/full.min.css"
            rel="stylesheet"
            type="text/css"
          />
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="/static/style.css" rel="stylesheet" />
          <title>ユーザー登録</title>
        </head>
        <body class="px-8 py-12 mx-auto max-w-2xl">{children}</body>
      </html>
    );
  },
  {
    docType: true,
  },
);
