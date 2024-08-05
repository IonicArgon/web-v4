import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

import WindowHandler from "@components/Home/WindowHandler";
import { adminStorage } from "@services/firebaseAdmin";

const PretendFetch = async (path: string) => {
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
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(data.toString());

  return (
    <div dangerouslySetInnerHTML={{ __html: parsedMarkdown.toString() }} />
  );
};

const Home = async () => {
  return (
    <main>
      <WindowHandler getMarkdown={PretendFetch} />
    </main>
  );
};

export default Home;
