import type { JSX } from "react"

type Block = {
  type: string,
  data: any
}

const BlockRenderer = ({ blocks }: { blocks: Block[] }) => {
  console.log(blocks)
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "header":
            const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
            return <Tag key={i} className="header">
              {block.data.text}
            </Tag>;

          case "code":
            return (
              <div className="flex-center">
                <div className="code">
                  <pre key={i}>
                    <code>{block.data.code}</code>
                  </pre>
                </div>
              </div>
            )

          case "paragraph":
            return (
              <p key={i} className="paragraph">
                {block.data.text}
              </p>
            )

          case "image":
            return (
              <figure key={i} className="image">
                <img 
                  src={block.data.file.url} 
                  alt={block.data.caption || ""} 
                  className="min-w-full"
                />

                {block.data.caption && <figcaption className="image-caption">{block.data.caption}</figcaption>}
              </figure>
            )

          case "list":
            return block.data.style === "ordered" ? (
              <ol key={i} className="ordered-cont">
                {block.data.items.map((item: any, index: number) => (
                  <div className="ordered">
                    <span>{index + 1}. </span>
                  
                    <li key={index}>
                      {item.content}
                    </li>
                  </div>
                ))}
              </ol>
            ) : (
              block.data.style === "unordered" ? (
                <ul key={i} className="bullet-cont">
                  {block.data.items.map((item: any, index: number) => (
                    <div className="bullet">
                      <div className="bullet-dot"></div>

                      <li key={index}>
                        {item.content}
                      </li>
                    </div>
                  ))}
                </ul>
              ) : (
                <div key={i} className="checklist-cont">
                  {block.data.items.map((item: any, index: number) => (
                    <div className="checklist">
                      <div className="checklist-box"></div>

                      <p key={index}>
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              )
            );

          default:
            return null
        }
      })}
    </>
  )
}

export default BlockRenderer