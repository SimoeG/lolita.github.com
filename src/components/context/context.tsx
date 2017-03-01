import * as React from 'react';
import * as MarkdownIt from 'markdown-it'
let style = require("./context.less");
let markdownItTocAndAnchor = require('../../lib/markdown-it-toc-and-anchor/index.js').default;

let md = new MarkdownIt({
  html: true,
  linkify: true
})
  .use(markdownItTocAndAnchor, {
    anchorLink: false
  });

interface contentProps {
  id?: string,
  className?: string,
  markdown?: boolean,
  content?: string,
  excerpt?: string,
  toc?: (tocArray: toc[]) => void
}

export function removeHTMLTag(str: String) {
  str = str.replace(/<\/?[^>]*>/g, '');
  str = str.replace(/[ | ]*\n/g, '\n');
  str = str.replace(/ /ig, '');
  return str;
}

export interface toc {
  anchor: string,
  content: string,
  level: number
}

export default class Content extends React.Component<contentProps, undefined>{
  excerpt() {
    let {excerpt: e = ""} = this.props
    return removeHTMLTag(e.toString());
  }
  putHTMLin() {
    if (this.props.content) {
      let hasHTML = $(this.refs['body']).html();
      if ($.trim(hasHTML) == "" || $.trim(hasHTML) == $.trim(this.props.excerpt)) {
        let html = this.props.content;
        if (this.props.markdown) {
          html = md.render(this.props.content, {
            tocCallback: (tocMarkdown: any, tocArray: toc[], tocHtml: any) => {
              if (this.props.toc) {
                this.props.toc(tocArray);
              }
            }
          })
        }
        $(this.refs['body']).html(html);
      }
    }
  }
  componentDidUpdate() {
    this.putHTMLin();
  }
  componentDidMount() {
    this.putHTMLin();
  }
  render() {
    let {id, className = ''} = this.props
    return (
      <div id={id} ref="body" className={className + " " + style.context}>
        {
          this.excerpt()
        }
      </div>
    )
  }
}