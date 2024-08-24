import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypePrettyCode from "rehype-pretty-code";

import WindowHandler from "@components/Home/WindowHandler";
import { adminStorage } from "@services/firebaseAdmin";

const FetchDoc = async (path: string) => {
  "use server";

  const file = adminStorage
    .bucket("gs://ionicargon-portfolio-website.appspot.com")
    .file(path);
  if (!(await file.exists())[0]) {
    return <div>File not found</div>;
  }

  const [data] = await file.download();
  const parsedMarkdown = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeDocument)
    .use(rehypePrettyCode, {
      theme: "synthwave-84",
    })
    .use(rehypeFormat)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(data.toString());

  return (
    <div dangerouslySetInnerHTML={{ __html: parsedMarkdown.toString() }} />
  );
};

const Home = async () => {
  return (
    <main>
      <WindowHandler getMarkdown={FetchDoc} />
    </main>
  );
};

export default Home;
