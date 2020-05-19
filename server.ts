import { Application, Router } from "https://deno.land/x/oak@v4.0.0/mod.ts";

type Book = {
  id: number;
  title: string;
  author: string;
};

const books: Book[] = [
  {
    id: 1,
    title: "The Hobbit",
    author: "J. R. R. Tolkien",
  },
];

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
});

const router = new Router();

router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/books", (context) => {
    context.response.body = books;
  })
  .get("/books/:id", (context) => {
    if (context.params && context.params.id) {
      const id = context.params.id;
      context.response.body = books.find((book) => book.id === parseInt(id));
    }
  })
  .post("/books", async (context) => {
    const body = await context.request.body();
    if (!body.value.title || !body.value.author) {
      context.response.status = 400;
      return;
    }
    const newBook: Book = {
      id: 2,
      title: body.value.title,
      author: body.value.author,
    };
    books.push(newBook);
    context.response.status = 201;
  });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });