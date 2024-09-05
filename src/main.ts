import './style.scss'
import { HtmlPostProcessor, Plugin } from '@typora-community-plugin/core'


export default class extends Plugin {

  onload() {
    this.register(
      this.app.workspace.on('file:open', () =>
        Array.from(document.querySelectorAll('#write [mdtype="blockquote"] > :first-child'))
          .map(render)
          .map(fold))
    )

    this.registerMarkdownPostProcessor(
      HtmlPostProcessor.from({
        selector: '#write [mdtype="blockquote"] > :first-child',
        process: render,
      })
    )

    const write = document.getElementById('write')!
    this.registerDomEvent(write, 'click', unfold)
  }

  onunload() {
    $('#write .typ-callout').removeClass('typ-callout')
  }
}

function render(p: HTMLElement) {
  const blockquote = p.parentElement!
  const [, type, foldStatus] = p.textContent!.match(/^\[!(\w+)\]([+-]?)/) ?? []

  if (type) {
    blockquote.classList.add('typ-callout')
    blockquote.dataset.callout = p.dataset.callout = type.toLowerCase()
  }
  else {
    blockquote.classList.remove('typ-callout')
  }

  return [blockquote, foldStatus === '-']
}

function fold([blockquote, isFolded]: [HTMLElement, boolean]) {
  if (!isFolded) return

  blockquote.classList.add('typ-callout--folded')
}

function unfold(event: MouseEvent) {
  (<HTMLElement>event.target)
    .closest('.typ-callout--folded')
    ?.classList.remove('typ-callout--folded')
}
