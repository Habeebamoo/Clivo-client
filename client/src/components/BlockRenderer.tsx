import type { JSX } from "react"

type Block = {
  type: string,
  data: any
}

const BlockRenderer = ({ blocks }: { blocks: Block[] }) => {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "header":
            const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
            return <Tag key={i} className="render">
              {block.data.text}
            </Tag>;

          case "code":
            return (
              <div className="code">
                <pre key={i}>
                  <code>{block.data.code}</code>
                </pre>
              </div>
            )

          case "paragraph":
            return (
              <p key={i} className="render">
                {block.data.text}
              </p>
            )

          case "image":
            return (
              <figure key={i} className="render">
                <img src={block.data.file.url} alt={block.data.caption || ""} />
                {block.data.caption && <figcaption>{block.data.caption}</figcaption>}
              </figure>
            )

          case "list":
            return block.data.style === "ordered" ? (
              <ol key={i} className="render">
                {block.data.items.map((item: any, index: number) => (
                  <li key={index}>
                    {item.content}
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="render">
                {block.data.items.map((item: any, index: number) => (
                  <li key={index}>
                    {item.content}
                  </li>
                ))}
              </ul>
            );

          default:
            return null
        }
      })}
    </>
  )
}

export default BlockRenderer