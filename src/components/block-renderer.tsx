"use client";

import type { JSX } from "react";
import DOMPurify from "dompurify";

type Block = {
  type: string;
  data: any;
};

const BlockRenderer = ({ blocks }: { blocks: Block[] }) => {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "header": {
            const Tag =
              `h${block.data.level}` as keyof JSX.IntrinsicElements;
            return (
              <Tag
                key={i}
                className="header"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(block.data.text),
                }}
              />
            );
          }

          case "code":
            return (
              <div key={i} className="flex-center w-full">
                <div className="code w-full overflow-hidden">
                  <pre className="overflow-x-auto max-w-full">
                    <code>{block.data.code}</code>
                  </pre>
                </div>
              </div>
            );

          case "paragraph":
            return (
              <p
                key={i}
                className="paragraph"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(block.data.text),
                }}
              />
            );

          case "image":
            return (
              <figure key={i} className="image">
                <img
                  src={block.data.file.url}
                  alt={block.data.caption || ""}
                  className="min-w-full"
                />
                {block.data.caption && (
                  <figcaption className="image-caption">
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "list":
            if (block.data.style === "ordered") {
              return (
                <ol key={i} className="ordered-cont">
                  {block.data.items.map((item: any, index: number) => (
                    <li key={index} className="ordered">
                      <span>{index + 1}. </span>
                      <span
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                    </li>
                  ))}
                </ol>
              );
            } else if (block.data.style === "unordered") {
              return (
                <ul key={i} className="ordered-cont">
                  {block.data.items.map((item: any, index: number) => (
                    <li key={index} className="ordered gap-2">
                      <div className="bullet-dot" />
                      <span
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                    </li>
                  ))}
                </ul>
              );
            } else {
              return (
                <div key={i} className="checklist-cont">
                  {block.data.items.map((item: any, index: number) => (
                    <div key={index} className="checklist">
                      <div className="checklist-box" />
                      <p>{item.content}</p>
                    </div>
                  ))}
                </div>
              );
            }

          default:
            return null;
        }
      })}
    </>
  );
};

export default BlockRenderer;
